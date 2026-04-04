# Flipper Zero IR データベース完全ガイド

> 比較対象: Lucaslhm/Flipper-IRDB · heytem/Flipper-Zero-IR-DataBase · 外部 IR リソース
> 最終更新: 2026-04-05
> 目的: `.ir` ファイルをどこから取ってくるか、どう整理するか、どう Flipper に流し込むかを 1 枚にまとめる

---

## 1. `.ir` ファイル形式の基礎

Flipper Zero が読む `.ir` はプレーンテキスト (.flipper フォーマット):

```
Filetype: IR signals file
Version: 1
#
name: Power
type: parsed
protocol: NECext
address: 20 DF 00 00
command: 10 EF 00 00
#
name: Vol_up
type: raw
frequency: 38000
duty_cycle: 0.330000
data: 9042 4484 592 533 ...
```

### 1.1 二つのタイプ

| type | 用途 | 生成方法 |
|---|---|---|
| `parsed` | 既知プロトコル (NEC / NECext / RC5 / Samsung32 / Sony / Kaseikyo) | Flipper が学習時にプロトコルを判定できた場合 |
| `raw` | 不明プロトコル / 学習失敗時のフォールバック | パルス列をそのまま記録 |

**実運用での教訓:**
- `parsed` のほうが圧倒的に小さい (1 行 ~30 bytes vs. raw の数 KB)
- `parsed` のほうが受信側デバイスの個体差に強い (プロトコル規格通りの波形を再生成するため)
- `raw` は Flipper の学習品質に依存する。ノイズのせいで微妙にズレていると他のデバイスで動かない

### 1.2 命名規則 (コミュニティ暗黙合意)

```
ACs/                    ← カテゴリ
├── Daikin/             ← ブランド
│   ├── Daikin_ARC433.ir    ← <Brand>_<Model>.ir
│   └── Daikin_ARC470.ir
└── ...

TVs/
├── Samsung/
│   ├── Samsung_UN55.ir
│   └── Samsung_QLED_Q70.ir
```

カテゴリ (Flipper の内部分類):
- `TVs/`, `ACs/`, `Audio_Receivers/`, `Projectors/`, `DVD_Players/`, `Cable_Boxes/`, `Streaming_Devices/`, `Fans/`, `Cameras/`, `Heaters/`, `Car_Multimedia/`, `Fireplaces/`, `Misc/`

---

## 2. 主要 2 リポジトリの徹底比較

### 2.1 Lucaslhm/Flipper-IRDB

- **URL**: https://github.com/Lucaslhm/Flipper-IRDB
- **Star 数**: 3k+ (2026-04 時点、最大級)
- **ファイル数**: 3500+ の `.ir` ファイル
- **構成**: `Category/Brand/Model.ir` の 3 層階層
- **更新頻度**: 週次レベルで PR がマージされる
- **命名**: `Brand_Model.ir` (アンダースコア区切り) を強制
- **品質管理**: CI で Flipper `.ir` フォーマット検証、重複検出

**強み:**
- コミュニティ最大 = カバレッジ最強 (マイナーブランドも拾える)
- PR テンプレートが整備されていて混乱しない
- `raw` より `parsed` を優先する方針、サイズが小さい
- UberGuidoZ / awesome-flipperzero から公式にリンクされている

**弱み:**
- フラットすぎて「同じ Samsung TV でも 4 ファイルある、どれ使うか迷う」ケース多発
- ボタン名の揺れ (`Power` / `Pwr` / `POWER`) が残っている
- カテゴリ分けが英語のみで、アジア圏ブランド (Haier, Hisense, Midea) は見つけにくい

### 2.2 heytem/Flipper-Zero-IR-DataBase

- **URL**: https://github.com/heytem/Flipper-Zero-IR-DataBase
- **Star 数**: ~200
- **ファイル数**: 1500+
- **構成**: カテゴリ直下にまとめた 2 層階層 (Brand 階層を省略)
- **更新頻度**: 月数件
- **命名**: ブランド名をファイル名に含める `SamsungUN55.ir`

**強み:**
- 階層が浅いので Flipper SD カードにそのまま流し込みやすい
- エアコンだけで 200+ ファイル、地域密着 (中東ブランド強い)
- Arab 圏 / アフリカ向けブランドのカバレッジがここだけある

**弱み:**
- 規模が Lucaslhm の半分以下
- フォーマットバリデーションが緩い
- ブランド階層がないので同ブランド複数モデルの探索が難しい

### 2.3 直接比較表

| 観点 | Lucaslhm/Flipper-IRDB | heytem/Flipper-Zero-IR-DataBase |
|---|---|---|
| ファイル数 | ~3500 | ~1500 |
| 階層 | 3 層 (Cat/Brand/Model) | 2 層 (Cat/Model) |
| カバレッジ | 欧米・日本が強い | 中東・アフリカが強い |
| 更新性 | ◎ 週次 | △ 月数件 |
| バリデーション | CI あり | なし |
| 教材化難易度 | ◎ 構造整っている | △ 命名揺れあり |
| Flipper SD への流し込み | 階層込み or スクリプトで圧縮 | そのまま投入可能 |

### 2.4 選び方

- **まず Lucaslhm を入れる** → カバレッジと信頼性で優位
- **それで出ないブランド**は heytem を漁る → 地域ブランド補完
- **最終手段**: 自分で学習 → Flipper `Learn New Remote` → 実機記録

---

## 3. 他の外部 IR リソース

### 3.1 Flipper ネイティブ `.ir` リソース

| サイト | URL | 内容 | 転用難易度 |
|---|---|---|---|
| UberGuidoZ/Flipper | https://github.com/UberGuidoZ/Flipper | IR / SubGHz / NFC / BadUSB 総合パック | そのまま使える |
| Flipper-Zero-Sub-GHz (同作者) | https://github.com/UberGuidoZ/Flipper/tree/main/Infrared | 整形済 | そのまま |
| DJsime1/awesome-flipperzero | https://github.com/djsime1/awesome-flipperzero | リンク集 (入口) | 発見層 |
| Flipper Community IRDB Mirror | https://flipper-irdb.org | web UI 検索 | webUI 経由 DL |

### 3.2 Pronto / LIRC 形式からの変換

| リソース | 形式 | 変換ツール |
|---|---|---|
| RemoteCentral.com | Pronto Hex | `pronto2flipper` (Python スクリプト群) |
| LIRC Remotes DB (https://sourceforge.net/p/lirc-remotes/) | LIRC config | `lirc2flipper` |
| Global Caché Control Tower | GC TCP strings | 自作変換必要 |

**実用的な変換スクリプト例:**

```python
# pronto_to_flipper.py (抜粋)
def pronto_to_raw(pronto_hex):
    parts = [int(p, 16) for p in pronto_hex.split()]
    freq_code = parts[1]
    frequency = int(1000000 / (freq_code * 0.241246))
    burst_pair_1 = parts[2]
    pulses = parts[4:4 + burst_pair_1 * 2]
    timings = [int(p * (1000000 / frequency / 1)) for p in pulses]
    return frequency, timings
```

### 3.3 ブランド固有ソース

| ブランド | 専門ソース |
|---|---|
| Panasonic | https://github.com/probonopd/irdb → LIRC 形式 |
| Samsung Smart TV | https://github.com/eclair4151/SmartCrypto → Wi-Fi (IR ではない) |
| LG | https://github.com/bendavid/aiopylgtv (ネットワーク制御) |
| Sony | IRP プロトコル仕様公開済 |

### 3.4 学術・仕様書

- **IRP Protocol Library**: https://github.com/bengtmartensson/IrpTransmogrifier — プロトコル定義 500+ 個
- **DecodeIR / AnalyzeIR**: プロトコル自動判定ツール

---

## 4. Flipper への流し込みワークフロー

### 4.1 一括取り込み (推奨フロー)

```bash
# 1. Lucaslhm 全リポジトリ取得
git clone --depth 1 https://github.com/Lucaslhm/Flipper-IRDB.git /tmp/irdb

# 2. Flipper SD に置く (このワークスペースのスクリプトで)
#    → /ext/infrared/assets_user/ に配置
py scripts/dataset_sync.py --protocol ir --source /tmp/irdb --report-only
py scripts/dataset_sync.py --protocol ir --source /tmp/irdb  # 実行

# 3. 巨大ならドラッグ&ドロップ推奨 (CLAUDE.md feedback memory 参照)
#    SD 取り外し → PC 直差し → コピー → 挿し直す
```

### 4.2 デバイス側パス

```
/ext/infrared/                  ← Flipper 内蔵 IR (読み込み専用扱い)
/ext/infrared/assets_user/      ← ユーザー追加 .ir (ここに入れる)
/ext/infrared/assets_user/TVs/Samsung/Samsung_UN55.ir
```

### 4.3 検索性を上げる工夫

Flipper 実機の IR メニューは **フォルダ階層を表示できる** が、ファイル名の先頭文字で絞れる:

```
/ext/infrared/assets_user/
├── _pinned/                    ← _先頭で一番上に固定
│   ├── home_AC.ir
│   └── home_TV.ir
├── ACs/
├── TVs/
└── ...
```

---

## 5. このサイトでの扱い方 (提案)

このナレッジベースは、IR リモコンコードを直接配信するリポジトリにはしない。代わりに:

- **ガイド**: どのソースから取るか、どう整理するか (本ドキュメント)
- **スクリプト**: `scripts/dataset_sync.py` でのまとめて転送
- **リンク集**: 外部リポジトリへの導線
- **品質管理メモ**: 実機検証ログ、動かなかった .ir のブラックリスト

---

## 6. 参考: `.ir` ファイル検証用ツール

```bash
# 簡易バリデータ (Python, このリポジトリに追加する候補)
import re

REQUIRED_HEADER = [
    r"^Filetype: IR signals file$",
    r"^Version: 1$",
]

def validate_ir(path):
    with open(path, 'r', encoding='utf-8') as f:
        lines = [l.rstrip() for l in f]
    if not re.match(REQUIRED_HEADER[0], lines[0]):
        return False, f"bad magic: {lines[0]}"
    # ... entry parsing
    return True, "ok"
```

---

## 7. まとめ (3 行)

- **Lucaslhm/Flipper-IRDB をメインに使え**、迷わないし CI で検証されている
- heytem は地域ブランド補完用
- 大量転送は scripts/dataset_sync.py + ドラッグ&ドロップ併用、serial 経由だと遅すぎる
