# Flipper Zero 趣味 App 完全收录

> Flipper Zero 不只是个安全工具，它是个玩具、是个学习平台、是个让你探索无线世界的入口
> 基于官方 Catalog 336 个应用 + 社区独立项目整理
> 更新日期：2026-03-27

---

## 这是什么？

Flipper Zero 官方应用目录有 336 个应用，社区还有无数奇奇怪怪的项目。这份文档把最有趣、最实用、最值得玩的挑出来了。

**你能在这里找到：**
- **BLE 玩具** — 搞点 AirPods 弹窗、模拟 AirTag、当蓝牙键盘用
- **USB 神器** — 让鼠标自己动、模拟条码枪、当乐高 ToyPad
- **经典游戏** — Doom、俄罗斯方块、德军总部、小行星
- **硬件扩展** — 接 ESP32-CAM 当相机、查天气、控制舵机
- **音乐工具** — 时之笛、节拍器、调音叉
- **加密玩具** — 二战恩尼格玛机、密码生成器

**一句话：玩得开心，学得明白。**

---

## 关于这份文档

### 文档结构

每个 App 包含：
- **来源**：官方目录 / 社区独立项目
- **GitHub**：源码仓库链接
- **功能**：它是干啥的
- **玩法**：怎么玩、怎么用
- **技术点**：能学到什么

### 官方应用目录

官方商店：https://catalog.flipperzero.one/

当前收录：336 个应用（截至 2026-03-24）

分类统计：
- Bluetooth: 11 个
- GPIO: 130+ 个
- Games: 80+ 个
- Infrared: 30+ 个
- NFC: 25+ 个
- Sub-GHz: 20+ 个
- Tools: 40+ 个
- USB: 15+ 个

---

## 目录

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

## 1. 蓝牙/BLE 类

### 1.1 FindMyFlipper ⭐ 热门

| 属性 | 详情 |
|-----|------|
| **来源** | 社区独立项目 |
| **GitHub** | https://github.com/MatthewKuKanich/FindMyFlipper |
| **官方目录** | ✅ applications/Bluetooth/findmy |
| **作者** | @MatthewKuKanich |
| **版本** | v3.0 |

**干啥的？**

把你的 Flipper Zero 变成一个 AirTag。丢进包里，然后在 iPhone 的 Find My 里就能看到它。

**支持的网络：**
- Apple Find My（苹果设备都能看见）
- Samsung SmartThings Find
- Tile 网络

**玩法：**
- 把 Flipper 扔包里当追踪器
- 测试 Find My 网络覆盖范围
- 研究 AirTag 的工作原理（广播包格式、加密机制）

**安装：**
```bash
Apps > Bluetooth > FindMy
```

---

### 1.2 BLE Spam 🔥 神器

| 属性 | 详情 |
|-----|------|
| **来源** | 社区独立项目 |
| **GitHub** | https://github.com/noproto/ble_spam_ofw |
| **官方目录** | ❌ 未收录（太野了） |
| **固件要求** | 官方固件 |

**干啥的？**

向周围疯狂发送 BLE 广播包，让附近的设备以为有新的 AirPods/AirTag/Apple TV 在旁边。

**效果：**
- iPhone：弹出 "AirPods Pro" 配对窗口
- Android：显示 Fast Pair 弹窗
- Windows：显示 Swift Pair 弹窗

**技术原理：**

BLE 设备会不断广播自己的存在（advertising）。你的手机一直在扫描这些广播。这个工具就是伪造 AirPods 的广播数据包，让手机以为有新的耳机在附近。

**学习价值：**
- BLE GAP（Generic Access Profile）协议
- 广播包结构（AD Structure）
- 设备配对流程
- 无线协议的开放性（以及为什么这既是特性也是问题）

**怎么用：**

在自己的设备上测试，看看 BLE 广播到底是怎么回事。理解它之后，你也能明白为什么 AirTag 能被 Find My 网络追踪。

**提示：**

Flipper 官方没收录这个，因为它确实能造成干扰。了解技术原理，在受控环境玩，别在公共场合搞事（会挨揍）。

---

### 1.3 HID BLE（蓝牙键盘鼠标）

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Bluetooth/hid_ble |
| **功能** | 蓝牙键盘、鼠标、媒体控制器 |

**功能表：**

| 模式 | 说明 |
|-----|------|
| Keyboard | 完整蓝牙键盘 |
| Mouse | 蓝牙鼠标 |
| Media | 媒体播放控制 |
| Mouse Jiggler | 蓝牙鼠标自动移动 |
| Stealth Jiggler | 随机移动模式 |

**玩法：**
- 把手机/平板当电脑用，Flipper 当键盘
- 远程控制演示幻灯片
- 研究蓝牙 HID 协议

---

## 2. USB 工具类

### 2.1 Mouse Jiggler ⭐ 摸鱼神器

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/USB/mouse_jiggler |
| **GitHub** | https://github.com/DavidBerdik/flipper-mouse-jiggler |
| **作者** | @DavidBerdik |

**干啥的？**

让鼠标自己轻微移动，防止电脑进入休眠或锁屏。

**核心机制：**
- 模拟 USB HID 鼠标设备
- 发送微小的鼠标位移（几个像素）
- 随机模式（非规律性移动，更难被检测）
- 可调节频率和幅度

**应用场景：**
- 长时间下载大文件时保持电脑活跃
- 运行需要持续运行的脚本
- 远程会议保持在线状态
- 某些监控软件检测活跃度时

**技术点：**

USB HID（Human Interface Device）协议。Flipper 把自己注册成一个 USB 鼠标，然后不断报告"鼠标移动了"。操作系统认为用户在操作，就不会锁屏。

**安装：**
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

**干啥的？**

模拟 USB 条码扫描器。插到电脑上，它会像真扫描器一样自动输入条码数据。

**工作原理：**

Flipper 注册为一个 USB HID 键盘设备。当你"扫描"条码时，它把条码内容转换成键盘按键序列发送给电脑。

**应用场景：**
- 测试自己开发的 POS 系统
- 自动化测试数据输入
- 研究条码扫描技术
- 开发调试时没有物理扫描器

**技术点：**
- USB HID 协议
- 条码格式（Code128、EAN、UPC 等）
- POS 系统数据输入流程

---

### 2.3 LD Toypad Emulator

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/USB/ldtoypad |
| **GitHub** | https://github.com/SegerEnd/Flipper-Zero-LD-Toypad-Emulator |
| **作者** | @SegerEnd |

**干啥的？**

模拟乐高 Dimensions 游戏的 ToyPad。ToyPad 是一个 USB 设备，玩家把实体乐高人偶放上去，游戏就解锁对应角色。

**技术点：**
- USB 设备枚举过程
- 特定硬件协议逆向
- HID 报告描述符

**玩法：**
- 解锁游戏角色（你懂的）
- 研究游戏外设如何工作
- 学习 USB 设备模拟

---

## 3. 经典游戏

### 3.1 Doom

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Games/doom |
| **GitHub** | https://github.com/p4nic4ttack/doom-flipper-zero |
| **版本** | v1.5 |

**说明：**

Doom-like 游戏，不是完整 Doom，是简化版克隆。但在 Flipper 这个小屏幕上玩 FPS，体验很独特。

---

### 3.2 Tetris（俄罗斯方块）

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Games/tetris |
| **原作者** | @jeffplang |
| **维护者** | @xMasterX |

**操作：**
- 方向键：移动
- OK：旋转
- Back：暂停

---

### 3.3 Flappy Bird

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Games/flappy_bird |
| **原作者** | @DroomOne |

经典像素鸟游戏 Flipper 移植版。

---

### 3.4 Asteroids（小行星）

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Games/asteroids |
| **GitHub** | https://github.com/SimplyMinimal/FlipperZero-Asteroids |
| **作者** | @SimplyMinimal |
| **版本** | v3.4.0 |

**特性：**
- 自动连发
- 能量系统
- 高分记录
- 震动反馈
- LED 效果
- 暂停功能
- 反向推进器

---

### 3.5 Chess（国际象棋）

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Games/chess |
| **GitHub** | https://github.com/xtruan/flipper-chess |
| **作者** | @xtruan |
| **版本** | v1.12 |

完整国际象棋规则，带 AI 对手。

---

### 3.6 Minesweeper（扫雷）

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Games/minesweeper_redux |
| **GitHub** | https://github.com/squee72564/F0_Minesweeper_Fap |

经典扫雷游戏。

---

### 3.7 Wolfenduino（德军总部 3D）

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Games/wolfenduino |
| **GitHub** | https://github.com/apfxtech/FlipperWolfenstein.git |
| **作者** | @apfxtech |

Wolfenstein 3D 的 Flipper 移植版，基于 Arduboy FX 版本。第一人称射击，简化版 3D 渲染。

---

### 3.8 Scorched Tanks（坦克对战）

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Games/scorched_tanks |
| **作者** | @jasniec |
| **版本** | v1.4 |

回合制坦克对战，可调节发射角度和力度，地形破坏效果。

---

### 3.9 ZombieZ（僵尸防御）

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Games/zombiez |
| **原作者** | @Dooskington |
| **维护者** | @DevMilanIan & @xMasterX |
| **版本** | v1.3 |

塔防游戏，建立防御工事抵御僵尸波次。

---

### 3.10 更多游戏

| 游戏 | 类型 |
|-----|------|
| 2048 | 数字益智 |
| Arkanoid | 打砖块 |
| City Bloxx | 堆叠建造 |
| Color Guess | 颜色记忆 |
| Dice App | 掷骰子 |
| Flipper Hero | 节奏游戏 |
| FNAF | 恐怖生存 |
| Game 15 | 15 拼图 |
| Hanoi Towers | 汉诺塔 |
| Laser Tag | 激光枪对战 |
| Mandelbrot Set | 分形可视化 |
| Paint | 像素画板 |
| Pinball | 弹珠台 |
| Roots of Life | 禅意拼图 |
| Snake | 贪吃蛇 |
| Space Impact | 太空射击 |
| T-Rex Runner | Chrome 恐龙 |
| Tic Tac Toe | 井字棋 |

---

## 4. 创意工具

### 4.1 Theme Manager

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Tools/theme_manager |
| **GitHub** | https://github.com/Hoasker/flipper-theme-manager.git |
| **作者** | @Hoasker |

从 SD 卡管理海豚动画主题，切换不同动画包。

---

### 4.2 Analog Clock

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Tools/analog_clock |
| **作者** | @scrolltex |

在 Flipper 屏幕上显示模拟时钟。

---

### 4.3 Pomodoro Timer

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Tools/pomodoro_timer |
| **GitHub** | https://github.com/Th3Un1q3/flipp_pomodoro |

番茄工作法计时器。25 分钟工作 + 5 分钟休息。

---

### 4.4 Calculator（计算器）

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Tools/calculator |

科学计算器，支持基础运算。

---

### 4.5 QR Code Generator（QR 码生成器）

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Tools/qrcode_generator |

在 Flipper 屏幕上生成 QR 码。

---

### 4.6 Tone Generator（音频信号发生器）

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Tools/tone_gen |

音频信号发生器，产生不同频率的声音。用于测试扬声器、学习音频频率。

---

## 5. 恶搞神器

### 5.1 Executor Keychain（80s 钥匙扣）

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Media/executor_keychain |
| **GitHub** | https://github.com/EstebanFuentealba/Flipper-Keyller.git |
| **作者** | Esteban Fuentealba |
| **名称** | Flipper Keyller |
| **版本** | 0.1 |

**干啥的？**

模拟 80 年代经典电子钥匙扣的声音。复古 8-bit 音效，开锁声、警报声、激光枪声。

**玩法：**
- 怀旧复古
- 测试 Flipper 扬声器
- 在朋友面前装 X

---

### 5.2 DCF77 Clock Spoof

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Tools/dcf77_clock_spoof |
| **GitHub** | https://github.com/molodos/dcf77-clock-spoof.git |
| **作者** | @Molodos |

**干啥的？**

伪造 DCF77 时间信号。DCF77 是德国长波时间信号发射台，欧洲的电波钟用它对时。这个工具发送伪造的信号，让周围的电波钟按你设置的时间走。

**技术点：**
- 长波时间信号协议
- 射频信号调制
- RFID 天线作为发射器

**玩法：**
- 测试电波钟
- 研究时间同步协议
- 了解无线电授时系统

---

### 5.3 Fire String

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Tools/fire_string |
| **GitHub** | https://github.com/RyanAboueljoud/Fire-String.git |

屏幕视觉效果，模拟火焰字符串。

---

### 5.4 Flipper95

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Tools/flipper95 |
| **GitHub** | https://github.com/CookiePLMonster/flipper-bakery.git |

Windows 95 风格界面模拟器。复古 Win95 UI，开始菜单，窗口管理，经典音效。

---

### 5.5 Orgasmotron

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Tools/orgasmotron |
| **GitHub** | https://github.com/leedave/Leeds-Flipper-Zero-Applications |
| **作者** | Leedave |

震动马达测试工具（名字是玩笑）。测试 Flipper 的震动功能。

---

## 6. GPIO 外设类

### 5.1 Camera Suite (ESP32-CAM) ⭐ 热门

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/GPIO/camera_suite |
| **GitHub** | https://github.com/CodyTolene/Flipper-Zero-Camera-Suite.git |
| **作者** | @CodyTolene 等 |

**干啥的？**

把 ESP32-CAM 模块接到 Flipper Zero 上，变成一台相机。

**功能：**
- 实时预览
- 拍照保存到 SD 卡
- 灰度/彩色模式
- 设置调整

**硬件：**
- ESP32-CAM 模块（淘宝十几块钱）
- GPIO 连接线

**技术点：**
- ESP32 摄像头驱动
- 串口通信协议
- 图像数据传输

---

### 5.2 Flipagotchi（Pwnagotchi 伴侣）

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/GPIO/flipagotchi |
| **GitHub** | https://github.com/Matt-London/pwnagotchi-flipper.git |
| **作者** | @Matt-London |

Pwnagotchi（WiFi 握手包捕获 AI）的 Flipper 显示界面。

---

### 5.3 FlipWeather（天气应用）

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/GPIO/flip_weather |
| **GitHub** | https://github.com/jblanked/FlipWeather.git |
| **作者** | @JBlanked |
| **版本** | 1.2 |

通过 WiFi 模块获取 GPS 和天气信息。

**硬件：** ESP8266/ESP32 WiFi 模块

---

### 5.4 Servo Tester（舵机测试器）

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/GPIO/servotester |

测试和校准舵机，控制舵机角度。

---

### 5.5 Air Mouse（空中鼠标）

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/GPIO/air_mouse |

用 MPU6050 陀螺仪模块控制鼠标，手势操作。

---

### 5.6 Flashlight（手电筒）

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/GPIO/flashlight |

使用 GPIO 控制外部 LED，当手电筒用。

---

## 7. 多媒体类

### 6.1 Tuning Fork（音叉）

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Media/tuning_fork |
| **GitHub** | https://github.com/besya/flipperzero-tuning-fork.git |
| **作者** | @besya |
| **版本** | 2.1 |

把 Flipper 当音叉用，440Hz A调标准，吉他调音模式。

---

### 6.2 Ocarina（时之笛）

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Media/ocarina |
| **原作者** | @invalidna-me |
| **版本** | v1.3 |

塞尔达传说：时之笛的陶笛模拟器。完整八度音阶，和 N64 版相同的操作方式。

**操作：** 方向键 + OK 组合演奏

---

### 6.3 BPM Tapper

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Media/bpm_tapper |
| **原作者** | @panki27 |

点击中心按钮测量 BPM（每分钟节拍数）。音乐练习、DJ 打碟用。

---

### 6.4 Music Player

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Media/music_player |

播放 RTTTL 格式音乐。

---

### 6.5 Metronome（节拍器）

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Media/metronome |

专业节拍器，可调节 BPM，不同拍号。

---

### 6.6 Morse Code（摩斯电码）

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Media/morse_code |

摩斯电码练习和发送。学习电报通信。

---

### 6.7 DVD Screensaver

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Media/dvd_screensaver |

经典 DVD 弹跳 logo 屏保，等它撞到角落。

---

### 6.8 WAV Player

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Media/wav_player |

播放 WAV 音频文件。

---

## 8. 安全/加密工具

### 7.1 Enigma（恩尼格玛密码机）

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Tools/enigma |
| **GitHub** | https://github.com/xtruan/flipper-enigma.git |
| **作者** | @xtruan |
| **版本** | v1.1 |

二战德国 Enigma 密码机模拟器。完整转子系统，8种转子选择，插线板设置。

**学习价值：** 密码学历史、对称加密原理、机械密码机工作机制。

---

### 7.2 Password Generator

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Tools/passgen |

强密码生成器。

---

### 7.3 Caesar Cipher（凯撒密码）

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Tools/caesar_cipher |

凯撒密码加密/解密。最古老的替换密码。

---

### 7.4 ROT13

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Tools/rot13_app |

ROT13 编码转换。

---

### 7.5 Roman Decoder（罗马数字解码）

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Tools/roman_decoder |

罗马数字与阿拉伯数字互转。

---

### 7.6 Flip Crypt

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Tools/flip_crypt |
| **GitHub** | https://github.com/Tyl3rA/FlipCrypt.git |
| **作者** | @Tyl3rA |

文件加密工具，用密码保护文件。

---

## 9. 实用工具

### 8.1 Calculator（计算器）

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Tools/calculator |

科学计算器。

---

### 8.2 QR Code Generator

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Tools/qrcode_generator |

在 Flipper 屏幕上生成 QR 码。

---

### 8.3 Hex Viewer

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Tools/hex_viewer |

查看文件十六进制内容。逆向工程必备。

---

### 8.4 DCF77 Clock Spoof

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Tools/dcf77_clock_spoof |
| **GitHub** | https://github.com/molodos/dcf77-clock-spoof.git |
| **作者** | @Molodos |

**干啥的？**

伪造 DCF77 时间信号。DCF77 是德国长波时间信号发射台，欧洲的电波钟用它对时。这个工具发送伪造的信号，让周围的电波钟按你设置的时间走。

**技术点：**
- 长波时间信号协议
- 射频信号调制
- RFID 天线作为发射器

**玩法：**
- 测试电波钟
- 研究时间同步协议
- 了解无线电授时系统

---

### 8.5 Flipper95

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Tools/flipper95 |
| **GitHub** | https://github.com/CookiePLMonster/flipper-bakery.git |

Windows 95 风格界面模拟器。复古 Win95 UI，开始菜单，窗口管理。

---

### 8.6 Text Viewer（文本查看器）

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Tools/text_viewer |

阅读文本文件。

---

### 8.7 Tasks（任务管理）

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Tools/tasks |

简单任务清单。

---

### 8.8 Key Copier（钥匙复制）

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Tools/key_copier |

物理钥匙解码和复制。

---

### 8.9 Programmer Calculator（程序员计算器）

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Tools/programmercalc |

支持二进制/八进制/十六进制计算。

---

### 8.10 Executor Keychain

| 属性 | 详情 |
|-----|------|
| **来源** | 官方目录 |
| **官方目录** | ✅ applications/Media/executor_keychain |
| **GitHub** | https://github.com/EstebanFuentealba/Flipper-Keyller.git |
| **作者** | Esteban Fuentealba |

模拟 80 年代电子钥匙扣的声音效果。开锁声、警报声、激光枪声。

---

## 安装指南

### 方法 1：官方应用目录（最简单）

1. 确保 Flipper 是最新固件
2. Apps → Flipper Lab
3. 搜索想要的 App
4. 点击安装

### 方法 2：qFlipper 安装

1. 去 GitHub Release 下载 `.fap` 文件
2. 连接 Flipper 到电脑
3. 打开 qFlipper
4. 把 `.fap` 拖到 SD 卡的 `/apps/` 目录
5. 在 Flipper 上 Apps → 找到并运行

### 方法 3：Momentum 固件（已内置）

Momentum 固件已经内置大量 App：
- Find My / Bad KB / BLE Spam
- Mouse Jiggler
- 各种游戏和工具

### 方法 4：自己编译

```bash
# 克隆仓库
git clone <repo-url>
cd <repo>

# 编译
ufbt

# .fap 文件在 dist/ 目录
```

---

## 分类索引表

### 快速查找

| 类别 | 数量 | 代表应用 |
|-----|------|---------|
| 蓝牙/BLE | 6 | FindMyFlipper, BLE Spam, HID BLE |
| USB 工具 | 6 | Mouse Jiggler, Barcode Scanner, LD Toypad |
| 游戏 | 30+ | Doom, Tetris, Wolfenduino, Chess |
| GPIO 外设 | 6 | Camera Suite, FlipWeather, Air Mouse |
| 多媒体 | 8 | Tuning Fork, Ocarina, BPM Tapper |
| 安全/加密 | 6 | Enigma, Password Generator, Flip Crypt |
| 实用工具 | 10 | Calculator, QR Code, DCF77 Spoof |

### 按功能筛选

**想要玩无线电？**
- Sub-GHz 应用（查看 FlipperZero 资源库）
- DCF77 Clock Spoof

**想要搞蓝牙？**
- FindMyFlipper
- BLE Spam
- HID BLE

**想要玩游戏？**
- Doom, Tetris, Wolfenduino, Chess
- 30+ 游戏任你选

**想要接硬件？**
- Camera Suite（相机）
- FlipWeather（WiFi）
- Servo Tester（舵机）

**想要学密码学？**
- Enigma（二战密码机）
- Caesar Cipher（凯撒密码）
- Flip Crypt（文件加密）

---

## 详细分类索引

### 蓝牙/BLE (Bluetooth)

| 应用名称 | 功能 | 官方目录 |
|---------|------|---------|
| FindMyFlipper | AirTag 模拟器 | ✅ |
| BLE Spam | BLE 弹窗工具 | ❌ |
| HID BLE | 蓝牙键盘鼠标 | ✅ |
| BT Trigger | 蓝牙触发器 | ✅ |
| BTHome | 智能家居协议 | ✅ |
| PC Monitor | 电脑状态监视 | ✅ |

### USB 工具 (USB)

| 应用名称 | 功能 | 官方目录 |
|---------|------|---------|
| Mouse Jiggler | 鼠标抖动器 | ✅ |
| Barcode Scanner | 条码扫描器模拟 | ✅ |
| LD Toypad | 乐高 ToyPad 模拟 | ✅ |
| USB HID Autofire | 自动连点器 | ❌ |
| COM Port Scanner | 串口扫描器 | ❌ |
| XInput Controller | Xbox 手柄模拟 | ✅ |

### 游戏 (Games)

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

### GPIO 外设 (GPIO)

| 应用名称 | 功能 | 官方目录 |
|---------|------|---------|
| Camera Suite | ESP32-CAM 相机 | ✅ |
| Flipagotchi | Pwnagotchi 显示 | ✅ |
| FlipWeather | 天气查询 | ✅ |
| Servo Tester | 舵机测试 | ✅ |
| Flashlight | 手电筒 | ✅ |
| Air Mouse | 空中鼠标 | ✅ |

### 多媒体 (Media)

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

### 安全/加密 (Security)

| 应用名称 | 功能 | 官方目录 |
|---------|------|---------|
| Enigma | 恩尼格玛密码机 | ✅ |
| Password Generator | 密码生成器 | ✅ |
| Caesar Cipher | 凯撒密码 | ✅ |
| ROT13 | ROT13 编码 | ✅ |
| Roman Decoder | 罗马数字解码 | ✅ |
| Flip Crypt | 文件加密 | ✅ |
| Password Manager | 密码管理器 | ✅ |

### 实用工具 (Tools)

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

### 恶搞神器 (Prank)

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

- **官方应用目录**：https://catalog.flipperzero.one/
- **Flipper Lab**：https://lab.flipper.net/
- **社区插件合集**：https://github.com/xMasterX/all-the-plugins
- **Awesome Flipper**：https://github.com/djsime1/awesome-flipperzero

---

## 更新日志

- 2026-03-27: 初始版本，收录 80+ 个精选应用

---

**玩得开心，学得明白。**