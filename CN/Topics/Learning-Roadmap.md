# Flipper Zero 学习路线图

> 最后更新：2026-04-05
> 面向：从零开始 → 能独立开发 `.fap` 的完整路径
> 总时长估计：0h → 200h+

---

## 阶段总览

| 阶段 | 名称 | 累计时长 | 里程碑 |
|---|---|---|---|
| 1 | 玩家 · Player | 0–20h | 能用全部内置功能 + 懂得查资料 |
| 2 | 探索者 · Explorer | 20–60h | 理解协议 + 能自己组装资源库 |
| 3 | 改装者 · Modder | 60–120h | 能刷自定义固件 + 加载第三方 `.fap` + 写简单脚本 |
| 4 | 开发者 · Developer | 120h+ | 能独立开发 `.fap` + 贡献 PR |

---

## 阶段 1：玩家（0–20h）

**目标：摸透内置功能，搞清楚 Flipper 能做什么不能做什么**

### 1.1 开箱必做
- 看一遍 [docs.flipper.net](https://docs.flipper.net/) 的 Getting Started
- qFlipper 连上去，更新到最新官方固件
- 走完 5 个经典 demo：测试电视遥控（Infrared Universal）、读一张公交卡（NFC Read）、学一个 433MHz 门铃（SubGHz Read）、试玩 Snake 游戏（Apps）、装一个 `.fap` 应用

### 1.2 必须理解的概念
- GPIO / UART / SPI / I2C 四种接口是什么
- IR / SubGHz / NFC / RFID / BLE 各是什么频段，互不干扰
- `.ir` / `.sub` / `.nfc` / `.rfid` / `.txt` 五种文件格式和它们对应的协议

### 1.3 验收标准
- 能用自己的家电遥控器 / 门禁卡做一次完整 Read → Save → Emulate
- 知道 "TX is blocked in your region" 是什么、为什么、怎么处理
- 看得懂 Flipper 屏幕上每个菜单项

---

## 阶段 2：探索者（20–60h）

**目标：把协议原理搞清楚，能自己组装资源库，能看懂社区的讨论**

### 2.1 协议深入
- **NFC**：MIFARE Classic 1K/4K 扇区/块/密钥/ACL，MFKey32 原理，DESFire vs Classic
- **SubGHz**：OOK / FSK / PSK 调制，固定码 vs 滚码，Keeloq
- **IR**：NEC / RC5 / Samsung32 / Sony SIRC / Kaseikyo 协议编码差异
- **BLE**：GAP / GATT，广播 vs 连接，Apple Continuity / Google Fast Pair / Microsoft Swift Pair 协议

### 2.2 资源库建设
- 导入 Lucaslhm IR 全库到 `/ext/infrared/assets_user/`
- 组装一份自己的 `mf_classic_dict_user.nfc`
- 收集常用 SubGHz 样本（家里的遥控器、门铃、气象站）
- 按 `docs/datasets/README.md` 走一遍 dataset 流水线

### 2.3 社区参与
- 加入 Reddit r/flipperzero 和官方 Discord
- 给 Lucaslhm IRDB 提一个 PR（缺少的家电遥控器）

### 2.4 验收标准
- 能独立破解一张 MFC 卡（完整读出 16 扇区）
- 能看着示波器/Frequency Analyzer 判断一个 433 遥控器是固定码还是滚码
- 能解释为什么滚码不能单纯复制

---

## 阶段 3：改装者（60–120h）

**目标：迈进固件/脚本世界**

### 3.1 自定义固件
- 理解官方固件 vs Momentum / Xtreme / Unleashed / RogueMaster 的差异
- 在安全范围内刷 Momentum（功能最全、合规性中等）
- 刷完恢复官方固件一次，掌握恢复流程

### 3.2 第三方 `.fap` 管理
- 学会用 Flipper App Catalog 装应用
- 理解 `.fap` 的结构（manifest + binary + icons）
- 学会从 GitHub 克隆 `.fap` 源码，用 `ufbt launch` 编译上传

### 3.3 BadUSB / 脚本自动化
- 写出第一个可用的 BadUSB 脚本（打开记事本写 "hello world"）
- 理解 Rubber Ducky 语法和 Flipper 的超集
- 写一个 `scripts/` 下的 Python 工具（比如批量转换 IR）

### 3.4 硬件扩展
- 焊一个 WiFi Devboard（ESP32-S3 Marauder 固件）
- 接 GPIO 驱动一个舵机 / LED / 电机

### 3.5 验收标准
- 能独立在 Momentum / Xtreme 间切换而不丢数据
- 写一个长度 > 50 行的 BadUSB 脚本并跑通
- GPIO 能控制外设

---

## 阶段 4：开发者（120h+）

**目标：能独立写 `.fap`、看懂固件源码、贡献代码**

### 4.1 开发环境
- ufbt 工作流（`ufbt update`, `ufbt launch`, `ufbt cli`）
- VSCode + Flipper SDK 配置
- 熟悉 `applications_user/` 目录结构

### 4.2 固件 API 核心
- **GUI**：ViewDispatcher, View, Widget, VariableItemList, DialogEx, Popup
- **Input**：InputEvent 流、长按识别
- **Storage**：`/ext/*` 文件系统，FlipperFormat
- **Furi**：Message Queue, Thread, Timer, Record
- **HAL**：`furi_hal_bt`, `furi_hal_light`, `furi_hal_speaker`, `furi_hal_subghz`, `furi_hal_infrared`

### 4.3 协议栈
- **SubGHz**：`cc1101` HAL + `SubGhzProtocol` 注册新协议
- **BLE**：`furi_hal_bt_extra_beacon_*` 做广播（参考本项目 x_ble_spam）
- **NFC**：`furi_hal_nfc` + `nfc_protocols` 支持新卡型

### 4.4 发布流程
- 写 README + 截图
- 按 App Catalog 规范提交（manifest / icons / categories）
- 贡献到 awesome-flipperzero 索引

### 4.5 进阶
- 研究 Marauder / ESP32 协作
- 写自定义 SubGHz 协议解码器
- 反向工程商业 IC 卡（DESFire / iCLASS）

### 4.6 验收标准
- 发布至少一个 `.fap` 到 App Catalog
- 给固件/热门 `.fap` 提过合并的 PR
- 能看懂 `furi_hal_bt_extra_beacon` 整条链路

---

## 时间分配建议

- 平日每晚 30–60min 摸索一个小 demo
- 周末 3–4h 做一个完整项目
- 每周看一次 r/flipperzero 热帖
- 月度输出一篇学习笔记

---

## 学不下去怎么办

1. **硬件买错了**：Flipper 是**协议研究工具**，不是渗透神器。期望不对会放弃
2. **环境配不好**：优先用 qFlipper 做基本操作，别一开始就钻 ufbt
3. **资料太多**：先走完阶段 1，不要一上来就读固件源码
4. **社区法律警告**：遵守本地法规，别拿来做邻居/陌生人的坏事

---

## 延伸

- 进阶：[专题 · BLE 实装指南](./BLE-Implementation.md) / [专题 · IR 数据库完整指南](./IR-Database-Guide.md)
- 工具链：[主知识库 · 04 构建与调试](../Guide/04-Build-Debug-Tools.md)
- JS 脚本：[主知识库 · 05 JavaScript](../Guide/05-JavaScript.md)
