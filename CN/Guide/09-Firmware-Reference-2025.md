# 09. 固件参考 2025-2026

[返回中文教学导航](README.md) | [上一章：08. 社区参考](08-Community-Reference.md) | [返回中文入口](../README.md)

## 本章作用

本章补充截至 2025-2026 年的主流固件最新状态。社区固件（Unleashed、Momentum）更新频繁，功能演进快，需要定期同步。本章与 [08. 社区参考](08-Community-Reference.md) 的区别在于：08 章讲"如何判断社区资料价值"，本章讲"当前各固件实际有什么功能"。

**注意**：社区固件功能可能随版本快速变化，使用前应核对官方 Release 页面获取最新信息。

---

## 主流固件版本速查（2026年3月）

| 固件 | 最新版本 | 发布日期 | 定位 |
|------|----------|----------|------|
| **官方固件** | 1.4.3 | 2025-12-05 | 基线功能，符合法规 |
| **Momentum** | mntm-012 | 2025-12-31 | UI定制+功能增强 |
| **Unleashed** | unlshd-086 | 2026-03-08 | 协议破解+安全测试 |
| **Marauder** | v1.11.0 | 2026-03-10 | Wi-Fi/BLE 安全测试（ESP32） |

---

## 官方固件（Official Firmware）

### 当前状态（v1.4.3）

官方固件是平台的**事实标准**。所有社区固件都基于它修改，所有 App 开发都应先以官方固件为测试基线。

**v1.4.3 更新内容：**
- Infrared CLI 插件修复 MissingImports 错误
- 基于 v1.4.2 的 bugfix 版本

**官方固件特点：**
- 无线电频段符合各国法规限制
- 不包含破解/绕过安全机制的功能
- 滚动码（Rolling Code）协议支持有限
- 最稳定的 API 兼容性

**适用场景：**
- 日常使用和开发
- 需要稳定性的项目
- 合规要求严格的环境

---

## Momentum 固件

### 定位与特点

Momentum 强调 **UI 个性化** 和 **高级功能**，是追求视觉体验与功能丰富性的用户首选。

**核心特色：**
- 资产包与主题系统（动画、图标、字体）
- Find My / Bad KB / BLE Spam 蓝牙工具包
- 新界面与控制中心
- JavaScript API 扩展（USBDisk、Storage、GUI、BLE、SubGHz）
- 支持脚本化自动化流程

### mntm-012 重大更新（2025-12-31）

**⚠️ 破坏性变更：JavaScript SDK 1.0**

两个模块 API 发生变更，旧脚本需要更新：

| 模块 | 变更内容 | 迁移成本 |
|------|----------|----------|
| `gui/submenu` | 子菜单项从 view prop 改为 view children | 很低 |
| `gui/widget` | `button` 事件返回对象格式变化（`{key, type}` 而非仅 key name） | 很低 |

**新增 40+ 应用：**

| 类别 | 新应用 |
|------|--------|
| **GPIO** | Ghost ESP、GPIO Explorer、FM Transmitter、FTDI232H FlipTDI、INA2xx Meter |
| **GPIO/FlipBoard** | FlipBoard Blinky/Keyboard/Signal/Simon（by @jamisonderek） |
| **GPIO/FlipperHTTP** | FlipMap、FlipTelegram、Free Roam（by @jblanked） |
| **NFC** | Amiibo Toolkit、NFC-Eink、SaFlip、NFC Login |
| **SubGHz** | Chief Cooker、Flipper Share、HC-11 Modem、Sub Analyzer、Sub-GHz Scheduler |
| **Infrared** | Hitachi/Midea/Mitsubishi AC Remote、LIDAR Emulator、Xbox Controller |
| **Media** | Video Player、Image Viewer、Space Playground、Fmatrix |
| **USB** | LEGO Dimensions Toy Pad、USB-MIDI |
| **工具** | CAN Tools、FlipCrypt、IconEdit、Programmer Calculator、Tasks |

**NFC 重大改进：**

1. **MIFARE Ultralight C 完整支持**
   - 字典攻击（使用系统/用户字典）
   - 密钥管理：添加/列出/删除 Ultralight C 密钥
   - 与 MIFARE Classic 功能对等

2. **MFKey 4.0**（by @noproto）
   - 密钥恢复速度提升 20%
   - Static Encrypted Nested 攻击速度提升 **70 倍**
   - NFC 应用中 Nested 攻击速度提升 **10 倍**

3. **FeliCa 增强**
   - 服务目录遍历 + 导出所有未加密可读块
   - 模拟处理特定 Polling 命令
   - 导出所有系统
   - Amusement IC Card 解析器（FeliCa Lite/Lite-S）

**SubGHz 增强：**

- Roger（静态 28 bit）支持手动添加
- V2 Phoenix 完整支持（按钮切换、手动添加、计数器加解密）
- Keeloq 新增：Motorline、Rosh、Pecinin、Rossi、Merlin、Steelmate 支持
- BFT 在读模式实时解码（2按钮遥控器）
- Came Atomo TOP44RBN 支持
- 实验性计数器溢出模式（OFEX）

**桌面端改进：**
- 主菜单支持目录和普通文件（包括 JS 文件）
- 锁屏支持跳过滑入动画
- 冬季动画启用

**下载方式：**
- [Web Updater（推荐）](https://momentum-fw.dev/update?version=mntm-012)
- [Flipper Lab](https://lab.flipper.net/)
- qFlipper 安装包

---

## Unleashed 固件

### 定位与特点

Unleashed 专注于 **SubGHz 协议破解** 和 **安全测试功能**，是安全研究者的首选社区固件。

**核心特色：**
- 移除地区限制，支持更多频率
- 滚动码（Rolling Code）协议支持
- RF 分析仪、频谱扫描
- 蓝牙测试工具
- GPS 子驾功能

### unlshd-086 更新内容（2026-03-08）

**SubGHz 新协议：**
- **Ditec GOL4** 54bit 动态协议（支持编程模式、按钮切换、手动添加）
- **KeyFinder** 24bit 静态协议
- **Somfy Keytis** 按钮切换和手动添加支持
- **Genius Echo/Bravo** 2 按钮长按模拟
- **Roger** 静态协议（来自 Momentum 同步）

**SubGHz 修复与改进：**
- 修复读取界面的传输 bug
- BFT Mitto 解码 bug 修复（种子在成功解码后未重置）
- KeeLoq：更改 delta 大小
- KeeLoq：修复 AN-Motors 和 HCS101 密钥显示
- Nero Radio 显示更多数据
- Marantec 协议 CRC 验证和手动添加

**其他更新：**
- LFRFID：Indala 224-bit（长格式）协议支持
- MFKey：更新至 v4.1
- 应用构建标签：22feb2026

**已知问题：**
- Mifare Mini 克隆卡读取损坏（原版 Mini 正常）
- 某些 EMV 卡通过 NFC->Read 读取时可能导致崩溃，请通过 Extra actions->Read specific card type->EMV 读取

**安装选项：**

| 后缀 | 基础应用 | 额外应用 | 说明 |
|------|----------|----------|------|
| 无后缀 | ✅ | ❌ | 默认版本 |
| `e` | ✅ | ✅ | 完整版（Extra apps） |
| `c` | ❌ | ❌ | 精简版（No apps） |

- [Web 安装器](https://web.unleashedflip.com)
- [Lab.flipper.net 安装](https://lab.flipper.net/)

---

## ESP32 Marauder 固件

### 定位

Marauder 是运行在 **ESP32 开发板**上的独立固件，通过 GPIO 与 Flipper Zero 连接，提供 Wi-Fi 和蓝牙安全测试能力。

**当前版本：v1.11.0（2026-03-10）**

### 支持的硬件

- Flipper Zero Wi-Fi 开发板（官方，ESP32-S2）
- Flipper Zero ESP32-S3 开发板
- Rabbit-Labs Flipper Zero ESP32-C5 多功能板
- M5StickC Plus/Plus2
- CYD（Cheap Yellow Display）系列
- Marauder Dev Board Pro
- ESP32 LDDB
- 其他 ESP32 开发板

### 核心命令

**扫描类：**
```
scanap      # 扫描无线接入点
scansta     # 扫描接入点下的客户端
sniffbeacon # 捕获信标帧
sniffpmkid  # 捕获 PMKID 数据
```

**攻击类：**
```
attack      # 发送攻击（信标骚扰、deauth、探测请求、rickroll）
```

### 与 Flipper Zero 连接

1. 将 Marauder 固件刷入 ESP32 开发板
2. 通过 GPIO 连接线与 Flipper Zero 连接
3. 在 Flipper 上安装 Wi-Fi Marauder 应用
4. 通过串口通信控制 ESP32

**第三方扩展板亮点（Rabbit-Labs C5）：**
- 双频 Wi-Fi 6（2.4 GHz 和 5 GHz）
- BLE 5.0 和 802.15.4（Zigbee、Thread、Matter）
- 集成 CC1101 sub-GHz 收发器
- GPS 模块
- microSD 卡槽

---

## 固件选择建议

| 用户需求 | 推荐固件 | 理由 |
|----------|----------|------|
| 初学者入门 | 官方固件 | 稳定、合规、文档齐全 |
| 追求 UI 和丰富功能 | Momentum | 主题系统、JS API、40+新应用 |
| 安全测试/协议研究 | Unleashed | 滚动码支持、更多协议 |
| Wi-Fi/蓝牙安全测试 | Marauder | 专业的无线安全工具 |
| 开发 App | 官方固件 | API 最稳定，兼容性最好 |
| 需要 GPIO 扩展 | Momentum | 最多的 GPIO 应用支持 |

---

## 应用生态结构

截至 2026 年，官方应用目录包含以下类别：

```
applications/
├── Bluetooth/     # 蓝牙工具（BT Trigger、BTHome、FindMy、HID BLE 等）
├── GPIO/          # GPIO 扩展（ESP Flasher、GPS、传感器、调试器等）
├── Games/         # 游戏
├── Infrared/      # 红外遥控
├── Media/         # 媒体播放
├── NFC/           # NFC 工具（读取、模拟、破解）
├── RFID/          # RFID 工具
├── Sub-GHz/       # 无线协议（遥控器、门禁）
├── Tools/         # 通用工具
├── USB/           # USB 工具（BadUSB、Mass Storage 等）
└── iButton/       # iButton 工具
```

---

## 学习建议

1. **先建立官方基线**
   - 先熟悉官方固件，理解平台原生能力
   - 阅读 [01. 设备与生态](01-Device-Ecosystem.md)

2. **明确需求再选固件**
   - 不要为了"功能多"而刷社区固件
   - 根据实际使用场景选择

3. **关注更新日志**
   - 社区固件更新频繁
   - 关注 GitHub Releases 获取最新信息

4. **备份原固件**
   - 刷机前备份原厂固件
   - 保留恢复能力

---

## 参考链接

- [官方固件 Release](https://github.com/flipperdevices/flipperzero-firmware/releases)
- [Momentum 固件](https://github.com/Next-Flip/Momentum-Firmware/releases)
- [Momentum 官网](https://momentum-fw.dev)
- [Unleashed 固件](https://github.com/DarkFlippers/unleashed-firmware/releases)
- [Unleashed Web 安装器](https://web.unleashedflip.com)
- [ESP32 Marauder](https://github.com/justcallmekoko/ESP32Marauder/releases)
- [官方应用目录](https://github.com/flipperdevices/flipper-application-catalog)

---

[返回中文教学导航](README.md) | [上一章：08. 社区参考](08-Community-Reference.md) | [返回中文入口](../README.md)
