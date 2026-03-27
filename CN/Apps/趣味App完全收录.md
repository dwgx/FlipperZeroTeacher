# Flipper Zero 趣味 App 完全收录

> 从官方应用目录和社区精选的趣味、实用、学习类 App
> 基于官方 Catalog 336 个应用 + 社区独立项目整理
> 更新日期：2026-03-27

---

## 写在前面的话

**欢迎来到 Flipper Zero 趣味应用的世界！**

Flipper Zero 不仅是一个安全工具，也是一个开放的学习平台。这份文档收集了官方应用目录和社区开发的有趣应用，帮助你：

- **学习技术原理** — 了解 BLE、USB、GPIO 等技术如何工作
- **提升工作效率** — 用 Mouse Jiggler、Pomodoro 等工具改善工作流
- **享受开发乐趣** — 体验 Doom、Tetris 等游戏在 Flipper 上的移植
- **探索创意边界** — 发现社区开发者的奇思妙想

### ⚠️ 使用准则

1. **合法合规** — 所有工具仅供学习和个人使用，不得用于非法用途
2. **尊重他人** — 在公共场合使用可能干扰他人的功能前，请获得他人同意
3. **了解风险** — 部分功能可能涉及系统安全，请在受控环境中测试
4. **保护隐私** — 不要录制、存储或传播他人的敏感信息

让我们开始探索吧！

---

## 目录

- [使用说明](#使用说明)
- [蓝牙/BLE 类](#1-蓝牙ble-类)
- [USB 工具类](#2-usb-工具类)
- [经典游戏](#3-经典游戏)
- [创意工具](#4-创意工具)
- [恶搞神器](#5-恶搞神器)
- [GPIO 外设类](#6-gpio-外设类)
- [多媒体类](#7-多媒体类)
- [安全/加密工具](#8-安全加密工具)
- [实用工具](#9-实用工具)
- [安装指南](#安装指南)
- [分类索引表](#分类索引表)
- [截图预览](#截图预览)

---

## 使用说明

### 文档结构

每个 App 包含以下信息：
- **来源**：官方目录 / 社区独立项目
- **安装**：直接安装 / 需要编译
- **固件要求**：官方固件 / Momentum / Unleashed 等
- **用途说明**：详细功能描述

### 官方应用目录

官方维护的应用商店：https://catalog.flipperzero.one/

当前收录应用数量：336 个（截至 2026-03-24）

分类：
- Bluetooth: 11 个
- GPIO: 130+ 个
- Games: 80+ 个
- Infrared: 30+ 个
- NFC: 25+ 个
- Sub-GHz: 20+ 个
- Tools: 40+ 个
- USB: 15+ 个

---

## 1. 蓝牙/BLE 类

### 1.1 FindMyFlipper ⭐热门

| 属性 | 详情 |
|-----|------|
| **来源** | 社区独立项目 |
| **GitHub** | https://github.com/MatthewKuKanich/FindMyFlipper |
| **官方目录** | ✅ 已收录 (applications/Bluetooth/findmy) |
| **作者** | @MatthewKuKanich |
| **版本** | v3.0 |
| **固件要求** | 官方固件兼容 |

**功能说明**

将 Flipper Zero 模拟成 AirTag，可在以下查找网络中定位：
- Apple Find My 网络
- Samsung SmartThings Find
- Tile 网络

**使用场景**
- 把 Flipper 当作追踪器放在包里
- 测试 Find My 网络的覆盖范围
- 了解 AirTag 的工作原理

**安装**
```bash
# 官方目录安装
Apps > Bluetooth > FindMy

# 或手动下载
https://github.com/MatthewKuKanich/FindMyFlipper/releases
```

---

### 1.2 BLE Spam (ble_spam_ofw) — 学习用工具

| 属性 | 详情 |
|-----|------|
| **来源** | 社区独立项目 |
| **GitHub** | https://github.com/noproto/ble_spam_ofw |
| **官方目录** | ❌ 未收录（涉及系统干扰） |
| **固件要求** | 官方固件 |
| **适用场景** | 仅限个人学习和测试 |

**这是什么？**

这是一个**教学演示工具**，用于展示 BLE（蓝牙低功耗）广播包的工作原理。通过发送伪造的 BLE 广播数据包，模拟 AirPods、AirTag 等设备的信号，从而让周围的设备弹出配对提示。

**产生的现象**
- Apple 设备（iPhone/iPad/Mac）：弹出 "AirPods" 配对窗口
- Android 设备：显示 Fast Pair 弹窗
- Windows 电脑：显示 Swift Pair 弹窗

**技术原理（简化版）**

想象一下，你的手机就像一个一直在听广播的收音机。当 AirPods 开启配对模式时，它会发出特定的"广播信号"告诉手机"我在这里"。这个工具就是模拟发出类似的信号，让手机误以为有新的 AirPods 在旁边。

**技术学习价值**
- 理解 BLE 广播机制是如何工作的
- 了解设备自动配对流程
- 认识无线协议的开放性特征
- 学习蓝牙安全性的边界

**⚠️ 使用边界（请仔细阅读）**

| 风险类型 | 说明 |
|---------|------|
| **干扰风险** | 频繁发送广播可能影响周围设备的蓝牙功能，导致他人设备出现卡顿或异常弹窗 |
| **公共场所** | **严禁在商场、地铁、餐厅等公共场所使用**，这会干扰大量陌生用户的设备 |
| **法律风险** | 某些地区可能将故意干扰通信设备视为违法行为，请了解当地法规 |
| **伦理问题** | 未经他人同意影响其设备是不礼貌的行为，可能引起纠纷 |

**建议的使用场景**
- ✅ 在自己的房间里，只影响自己的设备
- ✅ 学习 BLE 协议的工作原理和技术细节
- ✅ 了解无线安全概念和防护方法
- ✅ 研究如何防范此类干扰
- ❌ 在公共场所对陌生人使用
- ❌ 对他人设备进行恶作剧
- ❌ 用于任何商业目的或恶意目的

**为什么官方目录没有收录？**

Flipper 官方团队有意识地没有将此工具加入官方应用目录，正是因为它容易被滥用造成他人困扰。这体现了官方对负责任披露的考虑。

**如果你想学习这个工具**

建议按以下步骤：
1. 先阅读 BLE 协议的基础知识，了解 GAP、GATT 等概念
2. 在自己控制的设备上测试（你自己的手机/平板）
3. 了解《无线电管理条例》等相关法规
4. 理解技术能力的边界和伦理责任

---

### 1.3 HID BLE (蓝牙键盘鼠标)

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Bluetooth/hid_ble |
| **功能** | 蓝牙键盘、鼠标、媒体控制器 |

**子功能**

| 模式 | 说明 |
|-----|------|
| Keyboard | 完整蓝牙键盘，含修饰键 |
| Mouse | 蓝牙鼠标控制 |
| Media | 媒体播放控制 |
| Mouse Jiggler | 蓝牙鼠标抖动（防休眠） |
| Mouse Jiggler Stealth | 随机方向和距离的隐蔽抖动 |

**使用场景**
- 作为蓝牙遥控器控制电脑/手机
- 在演示时远程控制幻灯片
- 蓝牙鼠标抖动保持电脑不休眠（注意：某些工作环境可能有规定）

**使用建议**

这个工具让你可以把 Flipper 当作蓝牙键盘使用。这在很多场景下都很有用：

**正当用途**
- 控制连接的智能家居设备
- 作为演示遥控器
- 远程操作你的个人电脑
- 测试蓝牙 HID 协议

**注意事项**
- 不要连接他人的设备
- 在公共场合注意蓝牙配对安全
- 某些工作环境可能禁止使用此类工具

---

### 1.4 BT Trigger

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Bluetooth/bt_trigger |
| **GitHub** | https://github.com/xMasterX/all-the-plugins |

**功能**

通过蓝牙信号触发动作，可用作蓝牙遥控器。

---

### 1.5 BTHome

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Bluetooth/bthome |

**功能**

BTHome 协议支持，用于智能家居传感器数据广播。

---

### 1.6 PC Monitor

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Bluetooth/pc_monitor |
| **GitHub** | https://github.com/TheSainEy/flipper-pc-monitor |

**功能**

通过蓝牙显示电脑系统信息（CPU/内存使用率等）。

---

## 2. USB 工具类

### 2.1 Mouse Jiggler ⭐ 实用工具

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/USB/mouse_jiggler |
| **GitHub** | https://github.com/DavidBerdik/flipper-mouse-jiggler |
| **作者** | @DavidBerdik (forked from @matthewwwillard) |

**这是什么？**

Mouse Jiggler 通过轻微移动鼠标来防止电脑进入休眠或锁定状态。它的工作原理是模拟真实的鼠标移动，让操作系统认为用户仍在活跃使用。

**核心机制**
- 发送微小的鼠标位移信号
- 随机移动模式（非规律性往返，更难被检测）
- 可调节移动频率和幅度

**实用场景**
- 长时间下载大文件时保持电脑活跃
- 运行需要持续运行的程序或脚本
- 远程会议时防止屏幕锁定（注意：某些公司监控系统可能能检测到此行为）
- 演示时保持屏幕常亮

**⚠️ 使用边界**

| 风险类型 | 说明 |
|---------|------|
| **公司政策** | 很多公司有明确的 IT 使用政策，**明确禁止使用此类工具**。违反可能导致纪律处分 |
| **诚信问题** | 如果你是为了欺骗雇主或规避工作监控而使用，这是不诚信的行为 |
| **安全风险** | 保持电脑 unlocked 可能让他人访问你的敏感信息 |
| **检测风险** | 一些高级监控系统可以检测到非人类行为的鼠标移动模式 |

**我们的建议**
- 在个人设备上自由使用
- 在工作设备上使用前，**务必确认公司政策允许**
- 不要用于规避合理的工作要求
- 理解技术能力与职业道德的边界

**技术特点**
- 随机移动模式（非简单往返）
- 更难被检测算法识别
- 可调节移动频率
- 对系统资源占用极低

**安装**
```
Apps > USB > Mouse Jiggler
```

---

### 2.2 Barcode Scanner Emulator

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/USB/bc_scanner |
| **GitHub** | https://github.com/polarikus/flipper-zero_bc_scanner_emulator |
| **作者** | @polarikus |

**这是什么？**

模拟 USB 条码扫描器，插入电脑后像真正的扫描器一样自动输入条码数据。电脑会将其识别为一个标准的 HID（人机接口设备）键盘设备。

**工作原理**
- Flipper 模拟 USB HID 键盘设备
- 将条码数据转换为键盘按键序列
- 像真实扫描器一样"输入"条码内容
- 支持添加回车/制表符等后缀

**学习价值**
- 了解 USB HID 协议的工作方式
- 理解条码扫描器的技术实现
- 学习 POS 系统的数据输入流程
- 探索自动化数据输入的方法

**实用场景**
- **测试自己开发的 POS 系统或库存软件**
- 自动化测试数据输入流程
- 学习条码扫描技术原理
- 在没有物理扫描器的情况下进行开发调试

**⚠️ 使用边界**

| 风险类型 | 说明 |
|---------|------|
| **系统权限** | 只在你拥有完全控制权的系统上使用 |
| **数据安全** | 不要生成或扫描涉及个人隐私的条码 |
| **法律风险** | 生成商品条码（如 UPC）用于欺诈性交易是违法行为 |
| **商店测试** | **严禁在实体商店、超市等场所测试**，这可能被视为欺诈行为 |

**技术特点**
- 支持自定义条码数据内容
- 支持 Code128、EAN、UPC 等多种条码格式
- 可调节"扫描"速度（模拟真实扫描器的输入延迟）
- 支持添加前缀/后缀字符

**使用建议**
- 仅在测试环境或自己的系统上使用
- 了解条码生成和使用的相关法规
- 不要将生成的条码用于任何商业欺诈
- 尊重他人的财产权和系统安全

---

### 2.3 LD Toypad Emulator

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/USB/ldtoypad |
| **GitHub** | https://github.com/SegerEnd/Flipper-Zero-LD-Toypad-Emulator |
| **作者** | @SegerEnd |

**这是什么？**

这个工具可以模拟乐高 Dimensions 游戏的 ToyPad 配件。ToyPad 是一个特殊的 USB 设备，玩家把实体乐高人偶放在上面，游戏就会解锁对应的角色。

**学习价值**
- 了解 USB 设备枚举过程
- 学习如何模拟特定硬件设备
- 理解游戏外设的工作原理

**正当使用场景**
- 你的 ToyPad 损坏或丢失，用于恢复游戏功能
- 学习游戏外设协议
- 测试和开发相关项目

**⚠️ 版权提醒**

| 注意事项 | 说明 |
|---------|------|
| **游戏版权** | 你需要合法拥有乐高 Dimensions 游戏 |
| **角色解锁** | 解锁你未购买的角色可能涉及版权 |
| **支持正版** | 建议支持正版乐高人偶 |

**功能特点**
- 模拟放置乐高人偶
- 激活游戏角色
- 无需物理 ToyPad 即可游戏

**建议**
- 仅用于恢复已购买游戏的功能
- 支持正版游戏和硬件
- 了解相关版权法律

---

### 2.4 USB HID Autofire

| 属性 | 详情 |
|-----|------|
| **来源** | 社区独立 |
| **GitHub** | https://github.com/pbek/usb_hid_autofire |
| **作者** | @pbek |

**功能**

USB 自动连点器，持续发送鼠标左键点击。

---

### 2.5 COM Port Scanner Emulator

| 属性 | 详情 |
|-----|------|
| **来源** | 社区独立 |
| **GitHub** | https://github.com/polarikus/flipper-zero_bc_scanner_emulator |

**功能**

模拟串口条码扫描器。

---

## 3. 经典游戏

### 3.1 Tetris (俄罗斯方块)

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Games/tetris |
| **GitHub** | https://github.com/xMasterX/all-the-plugins |
| **原作者** | @jeffplang |
| **维护者** | @xMasterX |

**操作**
- 方向键：移动
- OK：旋转
- Back：暂停

---

### 3.2 Flappy Bird

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Games/flappy_bird |
| **原作者** | @DroomOne |
| **维护者** | @xMasterX |

---

### 3.3 Doom

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Games/doom |
| **GitHub** | https://github.com/p4nic4ttack/doom-flipper-zero |
| **维护者** | @xMasterX @Svarich @hedger |
| **版本** | v1.5 |

**说明**

Doom-like 游戏，非完整 Doom，是简化版克隆。

---

### 3.4 Asteroids (小行星)

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Games/asteroids |
| **GitHub** | https://github.com/SimplyMinimal/FlipperZero-Asteroids |
| **作者** | @SimplyMinimal |
| **版本** | v3.4.0 |

**特性**
- 自动连发
- 能量系统
- 高分记录
- 震动反馈
- LED 效果
- 暂停功能
- 反向推进器

---

### 3.5 Arkanoid (打砖块)

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Games/arkanoid |
| **原作者** | @gotnull |
| **维护者** | @xMasterX |

---

### 3.6 Chess (国际象棋)

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Games/chess |
| **GitHub** | https://github.com/xtruan/flipper-chess |
| **作者** | @xtruan |
| **版本** | v1.12 |

**特点**
- 完整国际象棋规则
- AI 对战
- 修复了非法移动 bug

---

### 3.7 Minesweeper (扫雷)

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Games/minesweeper_redux |
| **GitHub** | https://github.com/squee72564/F0_Minesweeper_Fap |
| **作者** | Alexander Rodriguez |

---

### 3.8 Flipper Hero

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Games/flipper_hero |
| **GitHub** | https://github.com/mentoster/flipper-hero |
| **作者** | @mentoster |

**类型**

节奏音乐游戏，类似 Guitar Hero。

---

### 3.9 Five Nights at Flipper's (FNAF)

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Games/flipperzero_fnaf |
| **GitHub** | https://github.com/sillygir1/flipperzero-fnaf |
| **作者** | @sillygir1 |

**类型**

恐怖生存游戏，FNAF 同人作品。

---

### 3.10 其他游戏

| 游戏 | 类型 | 说明 |
|-----|------|------|
| 2048 | 数字益智 | 经典 2048 |
| Snake | 贪吃蛇 | 经典街机 |
| T-Rex Runner | 跑酷 | Chrome 恐龙游戏 |
| Color Guess | 猜颜色 | 色彩记忆游戏 |
| Flipper Pong | 弹球 | 经典乒乓球 |
| Game 15 | 数字拼图 | 15  puzzle |
| Hanoi Towers | 益智 | 汉诺塔 |
| Laser Tag | 动作 | 激光枪对战 |
| Pinball | 弹珠台 | 经典弹珠 |

---

## 4. 创意工具

### 4.1 Theme Manager

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Tools/theme_manager |
| **GitHub** | https://github.com/Hoasker/flipper-theme-manager.git |
| **作者** | @Hoasker |

**功能**

从 SD 卡管理海豚动画主题。

**特点**
- 切换不同动画包
- 预览主题效果
- 无需刷机换主题

---

### 4.2 Analog Clock

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Tools/analog_clock |
| **作者** | @scrolltex |
| **维护者** | @xMasterX |

**功能**

在 Flipper 屏幕上显示模拟时钟。

---

### 4.3 Calculator

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Tools/calculator |

**功能**

科学计算器，支持基础运算。

---

### 4.4 Pomodoro Timer

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Tools/pomodoro_timer |
| **GitHub** | https://github.com/Th3Un1q3/flipp_pomodoro |

**功能**

番茄工作法计时器。

**特点**
- 25 分钟工作 + 5 分钟休息
- 循环计数
- 音效提醒

---

### 4.5 QR Code Generator

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Tools/qrcode_generator |

**功能**

在 Flipper 屏幕上生成 QR 码。

---

### 4.6 Tone Generator

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Tools/tone_gen |

**功能**

音频信号发生器，产生不同频率的声音。

---

## 5. 恶搞神器

### 5.1 Executor Keychain (80s 钥匙扣)

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Media/executor_keychain |
| **GitHub** | https://github.com/EstebanFuentealba/Flipper-Keyller.git |
| **作者** | Esteban Fuentealba |
| **名称** | Flipper Keyller |
| **版本** | 0.1 |

**功能说明**

模拟 80 年代经典电子钥匙扣的声音。

**声音效果**
- 开锁声
- 警报声
- 激光枪声
- 经典 8-bit 音效

**使用场景**
- 复古怀旧
- 恶作剧音效
- 测试 Flipper 扬声器

---

### 5.2 DCF77 Clock Spoof

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Tools/dcf77_clock_spoof |
| **GitHub** | https://github.com/molodos/dcf77-clock-spoof.git |
| **作者** | @Molodos |

**功能说明**

通过 RFID 天线和 A4 GPIO 引脚伪造 DCF77 时间信号。

**技术原理**

DCF77 是德国长波时间信号发射台，欧洲很多电波钟用它对时。这个 App 可以发送伪造的时间信号，让周围的电波钟按你设置的时间走。

**使用场景**
- 测试电波钟
- 了解 DCF77 协议
- 时间同步实验

---

### 5.3 Fire String

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Tools/fire_string |
| **GitHub** | https://github.com/RyanAboueljoud/Fire-String.git |

**功能**

屏幕视觉效果，模拟火焰字符串。

---

### 5.4 Flipper95

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Tools/flipper95 |
| **GitHub** | https://github.com/CookiePLMonster/flipper-bakery.git |

**功能**

Windows 95 风格界面模拟器。

**特点**
- 复古 Win95 界面
- 开始菜单
- 窗口管理
- 经典音效

---

### 5.5 Flip Crypt

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Tools/flip_crypt |
| **GitHub** | https://github.com/Tyl3rA/FlipCrypt.git |
| **作者** | @Tyl3rA |

**功能**

文件加密工具，用密码保护文件。

---

### 5.6 Password Manager

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Tools/password_manager |

**功能**

密码管理器，存储和管理密码。

---

### 5.7 Orgasmotron

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Tools/orgasmotron |
| **GitHub** | https://github.com/leedave/Leeds-Flipper-Zero-Applications |
| **作者** | Leedave |

**功能**

震动马达测试工具（名字是玩笑）。

### 3.11 Wolfenduino (德军总部 3D)

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Games/wolfenduino |
| **GitHub** | https://github.com/apfxtech/FlipperWolfenstein.git |
| **作者** | @apfxtech |

**功能说明**

Wolfenstein 3D 的 Flipper Zero 移植版，基于 Arduboy FX 版本移植。

**特点**
- 经典第一人称射击
- 简化版 3D 渲染
- 多关卡设计
- 复古像素风格

---

### 3.12 Scorched Tanks (坦克对战)

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Games/scorched_tanks |
| **GitHub** | 基于 Scorched Earth 灵感 |
| **作者** | @jasniec |
| **版本** | v1.4 |

**特点**
- 回合制坦克对战
- 可调节发射角度和力度
- 地形破坏效果
- 多种武器选择

---

### 3.13 Roots of Life (生命之根)

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Games/roots_of_life |
| **GitHub** | https://github.com/xMasterX/all-the-plugins |
| **原作者** | @Xorboo |
| **版本** | v1.4 |

**功能说明**

Global Game Jam 2023 参赛作品，禅意拼图游戏。

**主题**：Roots（根）

**玩法**
- 连接根部网络
- 解谜探索
- 放松禅意氛围

---

### 3.14 City Bloxx

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Games/citybloxx |
| **GitHub** | https://github.com/Milk-Cool/fz-citybloxx.git |
| **作者** | @milk_cool |
| **版本** | v1.0 |

**功能说明**

基于经典手机游戏 City Bloxx 的移植版。

**玩法**
- 堆叠建筑方块
- 建造城市天际线
- 平衡搭建挑战

---

### 3.15 ZombieZ (僵尸防御)

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Games/zombiez |
| **GitHub** | https://github.com/xMasterX/all-the-plugins |
| **原作者** | @Dooskington |
| **维护者** | @DevMilanIan & @xMasterX |
| **版本** | v1.3 |

**功能说明**

防御僵尸进攻的塔防游戏。

**玩法**
- 建立防御工事
- 抵御僵尸波次
- 资源管理

---

### 3.16 其他精选游戏

| 游戏 | 类型 | 说明 |
|-----|------|------|
| **2048** | 数字益智 | 经典 2048 |
| **ArduGolf** | 体育 | Arduino 风格高尔夫 |
| **BzzBzz** | 动作 | 蜜蜂飞行游戏 |
| **Catacombs** | 冒险 | 地牢探险 |
| **Color Guess** | 记忆 | 颜色记忆游戏 |
| **Dice App** | 工具 | 掷骰子模拟器 |
| **Digital Kaleidoscope** | 视觉 | 数字万花筒 |
| **Drifter** | 赛车 | 漂移赛车 |
| **Eight Ball** | 娱乐 | 魔法8号球预测 |
| **Flippy Road** | 跑酷 | 过马路游戏 |
| **Furious Birds** | 弹射 | 愤怒的小鸟风格 |
| **Game 15** | 拼图 | 15数字拼图 |
| **Hangman** | 文字 | 猜单词游戏 |
| **Hanoi Towers** | 益智 | 汉诺塔 |
| **Laser Tag** | 动作 | 激光枪对战 |
| **Mandelbrot Set** | 演示 | 曼德勃罗特集可视化 |
| **Minesweeper Redux** | 益智 | 扫雷升级版 |
| **Monty Hall** | 概率 | 蒙提霍尔问题模拟 |
| **Myblab** | 虚拟宠物 | 电子宠物 |
| **Paint** | 绘图 | 像素画板 |
| **Pinball** | 弹珠 | 弹珠台游戏 |
| **Race Game** | 竞速 | 赛车游戏 |
| **Reaction** | 反应 | 反应速度测试 |
| **Rock Paper Scissors** | 随机 | 石头剪刀布 |
| **Slot Machine** | 随机 | 老虎机 |
| **Snake** | 经典 | 贪吃蛇 |
| **Space Impact** | 射击 | 太空射击 |
| **T-Rex Runner** | 跑酷 | Chrome 恐龙游戏 |
| **Tic Tac Toe** | 策略 | 井字棋 |
| **Umpire Indicator** | 工具 | 棒球裁判指示器 |
| **XYZ Slots** | 随机 | 老虎机变种 |

---

## 6. GPIO 外设类

### 6.1 Camera Suite (ESP32-CAM 相机套件) ⭐热门

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/GPIO/camera_suite |
| **GitHub** | https://github.com/CodyTolene/Flipper-Zero-Camera-Suite.git |
| **作者** | @CodyTolene @Z4urce @leedave @rnadyrshin |

**功能说明**

将 ESP32-CAM 模块连接到 Flipper Zero，实现相机功能。

**功能**
- 实时预览
- 拍照保存到 SD 卡
- 灰度/彩色模式
- 设置调整

**硬件要求**
- ESP32-CAM 模块
- GPIO 连接线

---

### 6.2 Flipagotchi (Pwnagotchi 伴侣)

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/GPIO/flipagotchi |
| **GitHub** | https://github.com/Matt-London/pwnagotchi-flipper.git |
| **作者** | @Matt-London |

**功能说明**

Pwnagotchi 的 Flipper Zero 显示界面。

**用途**
- 显示 Pwnagotchi AI 状态
- 查看捕获的握手包
- 控制 Pwnagotchi 设置

---

### 6.3 FlipWeather (天气应用)

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/GPIO/flip_weather |
| **GitHub** | https://github.com/jblanked/FlipWeather.git |
| **作者** | @JBlanked |
| **版本** | 1.2 |

**功能说明**

通过 WiFi 获取 GPS 和天气信息。

**功能**
- 当前天气显示
- GPS 定位
- 多城市支持
- 温度/湿度/风速

**硬件要求**
- ESP8266/ESP32 WiFi 模块

---

### 6.4 Servo Tester (舵机测试器)

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/GPIO/servotester |
| **功能** | 测试和校准舵机 |

**用途**
- 舵机角度测试
- 校准舵机中位
- 连续旋转测试

---

### 6.5 Flashlight (手电筒)

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/GPIO/flashlight |
| **功能** | 使用 GPIO 控制外部 LED |

---

### 6.6 Air Mouse (空中鼠标)

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/GPIO/air_mouse |
| **功能** | MPU6050 传感器控制的空中鼠标 |

**用途**
- 手势控制电脑
- 演示控制器

---

## 7. 多媒体类

### 7.1 Tuning Fork (音叉)

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Media/tuning_fork |
| **GitHub** | https://github.com/besya/flipperzero-tuning-fork.git |
| **作者** | @besya |
| **版本** | 2.1 |

**功能说明**

把 Flipper Zero 当作音叉使用。

**特点**
- 多种标准音高
- 440Hz A调标准
- 吉他调音模式
- 持续发声

**用途**
- 乐器调音
- 物理实验
- 音高参考

---

### 7.2 Ocarina (时之笛)

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Media/ocarina |
| **GitHub** | https://github.com/xMasterX/all-the-plugins |
| **原作者** | @invalidna-me |
| **版本** | v1.3 |

**功能说明**

塞尔达传说：时之笛中的陶笛模拟器。

**特点**
- 完整八度音阶
- 和 N64 版相同的操作方式
- 演奏经典曲目

**操作**
- 方向键 + OK 组合演奏
- C键对应不同音高

---

### 7.3 BPM Tapper (节拍器)

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Media/bpm_tapper |
| **GitHub** | https://github.com/xMasterX/all-the-plugins |
| **原作者** | @panki27 |
| **版本** | v1.3 |

**功能说明**

点击中心按钮测量 BPM（每分钟节拍数）。

**用途**
- 音乐练习
- DJ 打碟
- 舞蹈排练

---

### 7.4 Music Player (音乐播放器)

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Media/music_player |
| **功能** | 播放 RTTTL 格式音乐 |

**支持格式**
- RTTTL（铃声文本传输语言）
- 内置示例曲目
- 自定义音乐文件

---

### 7.5 Metronome (节拍器)

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Media/metronome |
| **功能** | 专业节拍器 |

**特点**
- 可调节 BPM
- 不同拍号
- 声音/震动提示

---

### 7.6 Morse Code (摩斯电码)

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Media/morse_code |
| **功能** | 摩斯电码练习和发送 |

**功能**
- 电码学习
- 文本转电码
- 声音/灯光发送

---

### 7.7 WAV Player

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Media/wav_player |
| **功能** | 播放 WAV 音频文件 |

---

### 7.8 DVD Screensaver

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Media/dvd_screensaver |
| **功能** | 经典 DVD 屏保动画 |

**特点**
- 复古 DVD 弹跳 logo
- 期待角落命中
- 放松观赏

---

## 8. 安全/加密工具

### 8.1 Enigma (恩尼格玛密码机)

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Tools/enigma |
| **GitHub** | https://github.com/xtruan/flipper-enigma.git |
| **作者** | @xtruan |
| **版本** | v1.1 |

**功能说明**

二战德国 Enigma 密码机模拟器。

**特点**
- 完整转子系统
- 8种转子选择
- 插线板设置
- 历史加密体验

**用途**
- 密码学学习
- 历史教育
- 信息加密

---

### 8.2 Password Generator

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Tools/passgen |
| **GitHub** | https://github.com/xMasterX/all-the-plugins |
| **版本** | v1.4 |

**功能**

强密码生成器。

---

### 8.3 Caesar Cipher (凯撒密码)

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Tools/caesar_cipher |
| **功能** | 凯撒密码加密/解密 |

---

### 8.4 ROT13

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Tools/rot13_app |
| **功能** | ROT13 编码转换 |

---

### 8.5 Roman Decoder (罗马数字解码)

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Tools/roman_decoder |
| **功能** | 罗马数字与阿拉伯数字互转 |

---

### 8.6 Flip Crypt

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Tools/flip_crypt |
| **GitHub** | https://github.com/Tyl3rA/FlipCrypt.git |
| **作者** | @Tyl3rA |

**功能**

文件加密工具，用密码保护文件。

---

## 9. 实用工具

### 9.1 Calculator (计算器)

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Tools/calculator |
| **功能** | 科学计算器 |

---

### 9.2 QR Code Generator

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Tools/qrcode_generator |
| **功能** | 生成 QR 码 |

---

### 9.3 Hex Viewer (十六进制查看器)

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Tools/hex_viewer |
| **功能** | 查看文件十六进制内容 |

---

### 9.4 Text Viewer (文本查看器)

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Tools/text_viewer |
| **功能** | 阅读文本文件 |

---

### 9.5 Tasks (任务管理)

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Tools/tasks |
| **功能** | 简单任务清单 |

---

### 9.6 Key Copier (钥匙复制)

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Tools/key_copier |
| **功能** | 物理钥匙解码和复制 |

---

### 9.7 Programmer Calculator (程序员计算器)

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Tools/programmercalc |
| **功能** | 支持二进制/八进制/十六进制计算 |

---

## 安装指南

### 方法1：官方应用目录（推荐）

1. 确保 Flipper 运行最新固件
2. 进入 **Apps** → **Flipper Lab**
3. 浏览或搜索想要的 App
4. 点击安装

### 方法2：qFlipper 安装

1. 去 GitHub Release 页面下载 `.fap` 文件
2. 连接 Flipper 到电脑
3. 打开 qFlipper
4. 在文件管理器中找到 SD 卡
5. 将 `.fap` 文件复制到 `/apps/` 目录
6. 在 Flipper 上 **Apps** → 找到并运行

### 方法3：Momentum 固件内置

Momentum 固件已内置大量有趣 App：
- Find My / Bad KB / BLE Spam
- Mouse Jiggler
- 多款游戏
- 各种工具

### 方法4：编译安装

如果只有源码没有 FAP：
```bash
# 克隆仓库
git clone <repo-url>
cd <repo>

# 使用 uFBT 编译
ufbt

# 生成的 .fap 在 dist/ 目录
```

---

## 分类索引表

### 快速查找

按类别排序的所有应用索引：

#### 蓝牙/BLE (Bluetooth)

| 应用名称 | 功能 | 官方目录 |
|---------|------|---------|
| FindMyFlipper | AirTag 模拟器 | ✅ |
| BLE Spam | BLE 弹窗工具 | ❌ |
| HID BLE | 蓝牙键盘鼠标 | ✅ |
| BT Trigger | 蓝牙触发器 | ✅ |
| BTHome | 智能家居协议 | ✅ |
| PC Monitor | 电脑状态监视 | ✅ |

#### USB 工具 (USB)

| 应用名称 | 功能 | 官方目录 |
|---------|------|---------|
| Mouse Jiggler | 鼠标抖动器 | ✅ |
| Barcode Scanner | 条码扫描器模拟 | ✅ |
| LD Toypad | 乐高 ToyPad 模拟 | ✅ |
| USB HID Autofire | 自动连点器 | ❌ |
| COM Port Scanner | 串口扫描器 | ❌ |
| XInput Controller | Xbox 手柄模拟 | ✅ |

#### 游戏 (Games)

| 应用名称 | 类型 | 官方目录 |
|---------|------|---------|
| Tetris | 俄罗斯方块 | ✅ |
| Flappy Bird | 像素鸟 | ✅ |
| Doom | FPS 射击 | ✅ |
| Asteroids | 太空射击 | ✅ |
| Arkanoid | 打砖块 | ✅ |
| Chess | 国际象棋 | ✅ |
| Minesweeper | 扫雷 | ✅ |
| Flipper Hero | 节奏游戏 | ✅ |
| FNAF | 恐怖生存 | ✅ |
| Wolfenduino | 德军总部 3D | ✅ |
| Scorched Tanks | 坦克对战 | ✅ |
| Roots of Life | 禅意拼图 | ✅ |
| City Bloxx | 堆叠建造 | ✅ |
| ZombieZ | 塔防 | ✅ |
| 2048 | 数字益智 | ✅ |
| Snake | 贪吃蛇 | ✅ |
| T-Rex Runner | 跑酷 | ✅ |
| Color Guess | 记忆 | ✅ |
| Flipper Pong | 弹球 | ✅ |
| Game 15 | 拼图 | ✅ |
| Hanoi Towers | 益智 | ✅ |
| Laser Tag | 动作 | ✅ |
| Mandelbrot Set | 演示 | ✅ |
| Paint | 绘图 | ✅ |
| Pinball | 弹珠台 | ✅ |
| Slot Machine | 随机 | ✅ |
| Tic Tac Toe | 策略 | ✅ |

#### GPIO 外设 (GPIO)

| 应用名称 | 功能 | 官方目录 |
|---------|------|---------|
| Camera Suite | ESP32-CAM 相机 | ✅ |
| Flipagotchi | Pwnagotchi 显示 | ✅ |
| FlipWeather | 天气查询 | ✅ |
| Servo Tester | 舵机测试 | ✅ |
| Flashlight | 手电筒 | ✅ |
| Air Mouse | 空中鼠标 | ✅ |

#### 多媒体 (Media)

| 应用名称 | 功能 | 官方目录 |
|---------|------|---------|
| Tuning Fork | 音叉 | ✅ |
| Ocarina | 时之笛 | ✅ |
| BPM Tapper | 节拍测量 | ✅ |
| Music Player | 音乐播放器 | ✅ |
| Metronome | 节拍器 | ✅ |
| Morse Code | 摩斯电码 | ✅ |
| WAV Player | WAV 播放器 | ✅ |
| DVD Screensaver | DVD 屏保 | ✅ |
| Executor Keychain | 80s 钥匙扣音效 | ✅ |

#### 安全/加密 (Security)

| 应用名称 | 功能 | 官方目录 |
|---------|------|---------|
| Enigma | 恩尼格玛密码机 | ✅ |
| Password Generator | 密码生成器 | ✅ |
| Caesar Cipher | 凯撒密码 | ✅ |
| ROT13 | ROT13 编码 | ✅ |
| Roman Decoder | 罗马数字解码 | ✅ |
| Flip Crypt | 文件加密 | ✅ |
| Password Manager | 密码管理器 | ✅ |

#### 实用工具 (Tools)

| 应用名称 | 功能 | 官方目录 |
|---------|------|---------|
| Theme Manager | 主题管理 | ✅ |
| Analog Clock | 模拟时钟 | ✅ |
| Calculator | 计算器 | ✅ |
| Pomodoro Timer | 番茄钟 | ✅ |
| QR Code Generator | QR 码生成 | ✅ |
| Hex Viewer | 十六进制查看 | ✅ |
| Text Viewer | 文本查看 | ✅ |
| Tasks | 任务清单 | ✅ |
| Key Copier | 钥匙复制 | ✅ |
| Programmer Calc | 程序员计算器 | ✅ |
| DCF77 Clock Spoof | DCF77 时间伪造 | ✅ |
| Fire String | 火焰效果 | ✅ |
| Flipper95 | Win95 模拟器 | ✅ |
| Orgasmotron | 震动测试 | ✅ |

#### 恶搞神器 (Prank)

| 应用名称 | 功能 | 官方目录 |
|---------|------|---------|
| Executor Keychain | 80s 钥匙扣 | ✅ |
| DCF77 Clock Spoof | 时间信号伪造 | ✅ |
| Fire String | 火焰效果 | ✅ |
| Flipper95 | Win95 界面 | ✅ |
| BLE Spam | BLE 弹窗 | ❌ |

---

## 截图预览

### 游戏截图

| 游戏 | 预览 | 说明 |
|-----|------|------|
| Doom | ![doom](https://catalog.flipperzero.one/application/doom/screenshot) | 经典 FPS |
| Tetris | ![tetris](https://catalog.flipperzero.one/application/tetris/screenshot) | 俄罗斯方块 |
| Flappy Bird | ![flappy](https://catalog.flipperzero.one/application/flappy_bird/screenshot) | 像素鸟 |

### 工具截图

| 工具 | 预览 | 说明 |
|-----|------|------|
| FindMyFlipper | ![findmy](https://catalog.flipperzero.one/application/findmy/screenshot) | AirTag 模拟 |
| Mouse Jiggler | ![jiggler](https://catalog.flipperzero.one/application/mouse_jiggler/screenshot) | 鼠标抖动 |
| Camera Suite | ![camera](https://catalog.flipperzero.one/application/camera_suite/screenshot) | 相机套件 |

### 官方目录截图源

所有官方目录应用截图可在以下地址查看：
```
https://catalog.flipperzero.one/application/<app-id>/page
```

例如：
- FindMy: https://catalog.flipperzero.one/application/findmy/page
- Doom: https://catalog.flipperzero.one/application/doom/page
- Tetris: https://catalog.flipperzero.one/application/tetris_game/page

---

## 相关资源

- [官方应用目录](https://catalog.flipperzero.one/)
- [Flipper Lab](https://lab.flipper.net/)
- [awesome-flipperzero](https://github.com/djsime1/awesome-flipperzero)
- [xMasterX/all-the-plugins](https://github.com/xMasterX/all-the-plugins)

---

## 更新日志

- 2026-03-27: 初始版本，收录官方目录 336 个应用中的精选项目 + 社区独立项目

---

*文档基于官方 Catalog 和社区资源整理，仅供学习交流使用。*