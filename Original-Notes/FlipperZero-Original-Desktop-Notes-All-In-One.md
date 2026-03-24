# Flipper Zero Original Desktop Notes All-In-One

这是桌面原始 4 份 Flipper Zero 笔记的合并文件。

---

# FILE: Flipper Zero.md

# Flipper Zero 官方开发文档 + GitHub 社区经验整合教学文档（AI 投喂版）

> 适用目标：把这份文档直接投喂给 Codex、Claude、Cursor、OpenAI Codex CLI、ChatGPT Projects 等代码助手，让它们按 **Flipper Zero 官方规范** 帮你写 App / FAP / JS 脚本，而不是瞎编接口。
>
> 适用方向：
> - 原生 C / C++ 外部应用（FAP）
> - 基于 uFBT / FBT 的构建与调试
> - 资源文件、数据文件、图标、私有库
> - JavaScript 脚本（mJS）
> - 发布到 Apps Catalog 的准备工作
>
> 这份文档把资料分成两层：
> 1. **官方事实层**：只使用 Flipper 官方文档、官方源码仓库、官方工具仓库。
> 2. **社区经验层**：使用 GitHub 社区里被广泛引用的教程与示例仓库，提炼“真实踩坑经验”。

---

## 1. 先给 AI 的总说明：Flipper Zero 开发到底分几条路线

让 AI 先理解这个总图：

### 1.1 原生外部应用（最重要）
- Flipper 官方明确支持 **custom apps**，而且通常 **不需要修改固件本体**。
- 这类应用通常被打包成 `.fap`，也就是 **Flipper App Package**。
- 官方推荐使用 **uFBT** 做单应用开发；如果你要改整机固件，再用 **FBT**。  
  来源：
  - 官方 App Development 文档
  - 官方 FAP / FAM 文档
  - 官方 uFBT 仓库 README

### 1.2 固件内置应用 / 固件开发
- 如果你的功能必须改系统服务、系统菜单、底层模块，才进入固件仓库开发。
- 官方仓库也明确提醒：**很多点子都可以做成 external app，不一定要进 firmware**。

### 1.3 JavaScript 脚本
- Flipper 官方还支持基于 mJS 的 JavaScript 脚本。
- 这类脚本适合快速自动化、轻量逻辑、工具脚本，不适合重型 GUI / 复杂系统集成。

---

## 2. 官方资料的正确阅读顺序（这是喂 AI 最关键的顺序）

建议把下面顺序告诉 AI，要求它按这个顺序检索和引用：

1. **官方开发总入口**  
   https://docs.flipper.net/zero/development
2. **官方 Developer Docs（Doxygen）总入口**  
   https://developer.flipper.net/flipperzero/doxygen/
3. **App Development**  
   https://developer.flipper.net/flipperzero/doxygen/applications.html
4. **FAM（application.fam）**  
   https://developer.flipper.net/flipperzero/doxygen/app_manifests.html
5. **FAP（外部应用打包）**  
   https://developer.flipper.net/flipperzero/doxygen/apps_on_sd_card.html
6. **App Examples**  
   https://developer.flipper.net/flipperzero/doxygen/app_examples.html
7. **Flipper Build Tool（FBT）**  
   https://developer.flipper.net/flipperzero/doxygen/fbt.html
8. **uFBT 官方仓库**  
   https://github.com/flipperdevices/flipperzero-ufbt
9. **官方固件源码仓库**  
   https://github.com/flipperdevices/flipperzero-firmware
10. **JavaScript 文档入口**  
   https://developer.flipper.net/flipperzero/doxygen/js.html

### 为什么要按这个顺序
因为很多 AI 会犯两个错误：
- 只抓 GitHub 仓库里的旧教程，忽略了 **新版官方 Doxygen 文档**。
- 混淆 **内置 App** 与 **外部 FAP** 的 manifest 写法和构建方式。

所以你在提示词里要明确写：

```text
所有实现优先遵循 Flipper 官方 Developer Docs（developer.flipper.net）和 flipperdevices 官方 GitHub 仓库。只有在官方文档没有明确说明时，才参考社区仓库示例。

---

# FILE: Flipper Zero 与 ESP32-S3 深度玩法及社区知识库.md

Flipper Zero 与 ESP32-S3 深度玩法及社区知识库
一、Flipper Zero 官方核心功能
Flipper Zero 是一款集多种射频和硬件接口于一身的便携设备，官方固件本身就提供丰富的安全研究工具：
Sub‑1 GHz 无线收发器：支持 300–928 MHz 频段，可捕获、分析和重放遥控器及车库门等固定码信号
openelab.io
。官方固件遵循不同地区的法规，限制发射频段。
RFID/NFC 支持：内置 125 kHz（低频）和 13.56 MHz（高频）读取和模拟器，能够识别 MIFARE Classic、iButton、HID 等标签并进行基础攻击，如暴力破解和卡片克隆
openelab.io
。
红外 (IR) 通信：具备接收和发送红外码的能力，可学习电视、空调等红外遥控器信号并模拟控制
openelab.io
。
蓝牙与 BLE：能够配对并分析蓝牙设备，包括低功耗蓝牙广告包嗅探及简单的交互
openelab.io
。
GPIO 和扩展接口：一排 GPIO 引脚支持与外部模块交互，如 iButton 读卡器、SPI/I²C 设备或传感器
openelab.io
。
BadUSB/HID 功能：通过 USB‑C 端口可以模拟键盘、鼠标或存储设备，实现脚本化输入或 HID 攻击
spartanssec.com
。
独立运行与开源系统：Flipper Zero 具备内置屏幕、按键和电池，无需电脑即可独立操作；其固件开源并可编写插件
openelab.io
。
二、学术研究与安全测试
1. 安全功能对比与评估
IACIS 2024 论文比较了 Flipper Zero 与 Rubber Ducky 的威胁模型。论文指出 Flipper 在信号捕获与分析、RFID/NFC 克隆、蓝牙漏洞评估、网络嗅探、无钥匙进入系统评估和重放攻击方面功能丰富
iacis.org
。然而 Flipper 缺乏内置 Wi‑Fi，需要连接基于 ESP32 的 Wi‑Fi 开发板才能进行网络攻击，如 PMKID 捕获和去认证攻击
iacis.org
。
论文还说明，通过 Marauder 固件将 Flipper 与 ESP32 模块连接后，可以执行 deauth flood 和“Rick Roll”广播等攻击
iacis.org
。与 Rubber Ducky 不同，Flipper 的 BadUSB 脚本必须手动触发，不会自动在插入时运行
iacis.org
。

2. 功能探索与案例研究
MDPI 2026 的研究报告通过多个实验证明了 Flipper Zero 的真实能力：
MIFARE Classic 1K 卡嵌套攻击：利用已知密钥暴力破解卡片，复制或修改数据。（用于评估弱加密）
Sub‑GHz 固定码远程控制：用 sub‑GHz 模块录制遥控器信号并重放，突破固定码门禁系统。
USB HID 脚本攻击：通过 BadUSB 模拟键盘在目标计算机执行恶意脚本，实现数据窃取。
BLE Spam 干扰：使用自定义脚本随机广播大量 BLE 广告包，降低周围设备的可用性。
研究人员强调，这些功能用于安全测试或物联网审计，但滥用会违法
mdpi.com
。
3. NFC 安全性讨论
一篇高校博客指出，Flipper Zero 早期固件曾支持读取信用卡信息，但由于安全风险，该功能在 0.81.1 版本被删除。即使在旧版固件中，Flipper 只能读取卡号和有效期，无法复制 CVV；重启此功能需要修改固件且存在法律风险
blogs.canisius.edu
。
三、社区固件与高级功能
官方固件在频率和功能上有所限制，社区开发出多种固件解锁更多功能：
1. Unleashed
Unleashed 固件主要特点是取消各国频段限制、支持更多 rolling code 协议、增强蓝牙连接稳定性，并内置大量社区插件，如 RF 分析、频谱扫描、滚动码攻击等
spartanssec.com
。它是红队/渗透测试人员的首选，兼顾稳定性和功能
hackmag.com
。
2. Momentum
Momentum 更注重界面自定义和扩展功能，提供可下载的资产包（动画、图标、字体），内置 FindMy/Bad KB/BLE Spam 套件用于蓝牙恶作剧或定位设备，支持新界面风格和控制中心，可快速切换攻击模式
momentum-fw.dev
。该固件还加入 GPS SubDriving（记录定位数据）和额外 JavaScript API，便于编写脚本
momentum-fw.dev
。
3. Xtreme (XFW)
HackMag 评测指出，Xtreme 是 Unleashed 的高度自定义版，它进一步解锁 USB/BLE 模式调整和 BadUSB 键盘映射，可以自由切换 HID 协议，适合重度用户；同时仍保持相对稳定
hackmag.com
。文章建议普通用户选择 Unleashed 或 Momentum，Xtreme 更适合折腾者
hackmag.com
。
4. RogueMaster
RogueMaster 是 Unleashed 的动画化分支，包含大量主题和小游戏，同时加入 fuzzers、文件管理器等工具，但稳定性略低
hackmag.com
。
社区中还有 Xtreme、XFW、Marlin 等固件，但它们都以 Unleashed 为基础增加界面或特殊功能。建议在合法范围内使用，并关注作者更新以避免暗网“破解”版本的恶意植入
upstream.auto
。

四、外接硬件扩展与物理改装
Flipper Zero 的 GPIO 和扩展端口使其能够连接各种硬件模块，拓展功能：
1. ESP32 Wi‑Fi 开发板和 Marauder 固件
Flipper Zero 本身不具有 Wi‑Fi 功能。许多安全测试依赖连接 ESP32 开发板并刷入 ESP32 Marauder 固件，使其具备 Wi‑Fi 攻击能力。InfoSec Write‑ups 的指南指出，可以购买约 3.72 美元的 ESP32‑WROOM 模块，通过跳线连接 TX/RX/GND/3V3 到 Flipper GPIO，然后刷入 Marauder 固件以进行扫描、PMKID 捕获和 deauth 攻击。刷机需下载多个 bin 文件并使用 Flash 下载工具。接线后 Flipper 与 Marauder 组合即可在菜单中运行 Wi‑Fi 工具。作者建议使用 Unleashed 等自定义固件以启用该功能。
2. Rabbit‑Labs ESP32‑C5 多功能板
Rabbit‑Labs 于 2026 年推出的多功能扩展板基于 ESP32‑C5 微控制器，支持双频 Wi‑Fi 6、蓝牙 5.0、Zigbee/Thread、Ti CC1101 sub‑GHz 收发器和 GPS 模块。板载 microSD 卡槽可存储捕获的数据，预装 Marauder 固件用于 Wi‑Fi 扫描、封包捕获和 GPS 记录。它通过 SMA 天线提供更远的射频覆盖
cnx-software.com
cnx-software.com
。适用于高级无线安全研究，但价格较高，且带 GPS 需注意法律法规。
3. FlipMods Combo 3‑in‑1 模块
CNX Software 2025 年报道了 FlipMods Combo：将 ESP32‑WROOM‑32UE（Wi‑Fi/BLE）、TI CC1101 sub‑GHz 模块和 GPS 模块集成在一块板上，支持 microSD 存储，配备 USB‑C 接口和 LED 状态指示，并带开关切换 GPS 数据到 ESP32 或 Flipper 引脚
cnx-software.com
。该板预装 Marauder 固件，适用于 Unleashed、Momentum、RogueMaster、Xtreme 等固件
cnx-software.com
。使用时需在 Momentum 设置中将 NMEA GPS UART 映射到 Flipper 的 15/16 引脚，并在关机状态下切换开关
cnx-software.com
。
4. 外置 CC1101 模块和高增益天线
为提高 sub‑GHz 信号的接收灵敏度和发射距离，社区提供外置 CC1101 模块和高增益天线套件。这些模块通过 Flipper 的扩展口连接，兼容官方和自定义固件，并提供 Lego 积木等不同外壳。商家页面强调模块配有 LED 指示灯和开关，建议搭配 Unleashed/Momentum/Xtreme 固件使用

tindie.com
。
5. Mayhem 多合一板（v1/v2）
Erwin Ried 设计的 Mayhem Hat 系列将 ESP32‑CAM 模块、相机、闪光灯、microSD 卡、PSRAM、NRF24 L01 或 CC1101 收发器合一，旨在为 Flipper 增加 Wi‑Fi、蓝牙、摄像头、SD 存储和无线射频扩展。虽然难以获取公开文档，但社区视频与文章表明该板带有 2 MP 摄像头、独立微灯和可替换射频模块接口，用于运行 Marauder 和无线传感器项目。用户可通过 3D 打印的帽子固定在 Flipper 上。由于官方新闻难以访问，建议关注 Hackaday、Hackster 等网站最新报道。
6. Feberis Pro、ESP32‑S3 Sense 等 AI 扩展
市场上出现了一些为 Flipper 专用或兼容的 AI 模块，如 XIAO ESP32S3 Sense（带摄像头和麦克风，能运行机器视觉模型，用于植物病害识别、心率监测、野生动物追踪等），这些模块可通过 GPIO 与 Flipper 连接，利用 ESP32‑S3 的向量指令实现边缘 AI
dronebotworkshop.com
。此外还有 Feberis Pro 板集成多种无线模块和 GPS，被视为 FlipMods 的升级版。
五、BadUSB 与脚本库
1. I‑Am‑Jakoby BadUSB 仓库
GitHub 用户 I‑Am‑Jakoby 创建的 Flipper‑Zero‑BadUSB 仓库提供大量 BadUSB payload 脚本，强调即插即用，使用自建域名托管脚本并生成短链接。仓库包含VoiceLogger（启动麦克风并将语音转文字上传至 Discord）、ADV‑Recon（执行高级侦察）、Jump‑Scare（更换壁纸或播放视频）、PineApple（将目标设备连接到攻击者 Wi‑Fi）、Rage‑Pop‑Ups（生成连续弹窗）、Subscribe/Must Sub（操控目标浏览器订阅 YouTube 频道）等多种恶作剧或恶意脚本，这些 payload 多为娱乐或社会工程测试

github.com
。作者强调这些脚本仅供教育用途，但容易被滥用。
2. FalsePhilosopher 和其他 BadUSB 库
另有 FalsePhilosopher/badusb 等仓库整理了兼容 Flipper 的 BadUSB 脚本合集，涵盖密码抓取、浏览器历史记录窃取、蓝牙键盘注入等功能。这些资源多使用 PowerShell、Python 等脚本，仍需读者在合法范围内学习。
3. UberGuidoZ Playground
资深玩家 UberGuidoZ 的仓库 Flipper 是 Flipper Zero 爱好者的重要资源库。README 表示该仓库是作者为 Flipper Zero 制作、修改和收集的“游乐场与数据仓库”

github.com
。仓库包含红外（IR）、RFID、Sub‑GHz、NFC 数据库、BadUSB 脚本、硬件故障排查、GPS 程序、音乐播放器、游戏以及大量插件。作者还提供了 IRDB 链接、官方文档、教程和 Discord 社区，鼓励新人学习基础知识

github.com
。
4. 其他插件与资源
awesome‑flipperzero 仓库罗列了社区常见资源：
Sub‑GHz brute force 生成器、IRDB 红外代码库、Amiibo/Tonies NFC dump 集合 等数据库，用于生成或获取各种遥控/卡片文件
raw.githubusercontent.com
。
大量 BadUSB payload 集合，如 I‑Am‑Jakoby 和 MarkCyber 提供键盘攻击脚本
raw.githubusercontent.com
。
官方与非官方应用和插件：Sub‑GHz 频谱分析仪、Xbox 控制器 IR 模拟、漏洞扫描器、COM 端口扫描器、鼠标抖动器、温度传感器读数、伺服测试器、GPS 应用等
raw.githubusercontent.com
。
这些资源展示了社区创造力，但同时可能被用于非法攻击，务必遵守法律并征得设备所有者许可。
六、射频/红外/NFC 数据库与信号采集
除了硬件扩展和脚本外，Flipper 社区积累了大量射频、红外、NFC 数据库：
Flipper‑IRDB：由 UberGuidoZ 维护的红外代码数据库，收录各品牌电视、空调、音响等遥控器信号。用户可直接下载现成的 .ir 文件进行控制。

github.com
Sub‑GHz 简档与固件：社区收集了不同厂商遥控器和车库门的遥控协议文件 (.sub) 以及 brute‑forcer 工具，用于测试固定码系统的安全性
raw.githubusercontent.com
。
Amiibo/Tonies NFC dump：适用于任天堂 Amiibo、儿童有声玩具 Tonies 等的 NFC 图像，供爱好者研究和备份
raw.githubusercontent.com
。
RFID/NFC 攻击脚本：一些仓库整合了对 MIFARE、iCLASS 等卡片的攻击方法，如 nested 攻击、密钥字典等。
七、深度学习与 ESP32‑S3 AI 融合
ESP32‑S3 是一款带 AI 指令集的微控制器，非常适合边缘 AI 与 Flipper 结合：
1. ESP32‑S3 特性
DroneBot Workshop 的评测指出，ESP32‑S3 采用双核 Xtensa LX7 处理器，主频 240 MHz，内置 512 KB RAM，支持 Wi‑Fi 4 与 BLE 5.0，具备 USB OTG、摄像头和液晶接口，并集成向量 AI 指令用于加速深度学习推理
dronebotworkshop.com
。这使其能够运行简单的 TinyML 模型，如唤醒词识别、手势识别。
2. ESP‑DL 框架
Espressif 官方提供 ESP‑DL 库，它集成神经网络推理、图像处理和数学运算 API，利用 S3 的 AI 指令提升运行速度。CNX Software 报道一项人脸识别模型在向量加速下速度提升 6.25 倍，8‑bit 量化模型提升 2.5 倍
cnx-software.com
。ESP‑DL 还提供模型动物园（face detection、cat detection 等）并支持从 TensorFlow/PyTorch 转换模型。
3. 模型部署流程
ESP‑DL 用户指南指出，部署深度模型需要使用 ESP‑PPQ 工具将 ONNX/PyTorch 模型量化为 .espdl 格式，并在 ESP‑IDF 环境中编译。硬件方面推荐使用 ESP32‑S3 开发板（如 ESP32‑S3‑EYE），也可在 Flipper 扩展板上运行
docs.espressif.com
docs.espressif.com
。一个手势识别案例显示需具备神经网络知识和 C/C++ 编程技能才能完成
developer.espressif.com
。
4. AI 在 Flipper 上的潜在应用
语音/手势识别：利用 S3 模块的麦克风和摄像头识别用户命令，实现免触控操作；
射频信号分类：结合深度学习模型分类捕获到的无线信号（如区分遥控器品牌或识别无线键盘的按键）；
环境监测：通过接入传感器（温湿度、CO₂、光照）并用模型预测异常事件；
智能安全研究：AI 模型可以辅助分析信号是否为固定码或滚动码，自动推荐攻击或防御策略。
目前 AI 项目多处于实验阶段，开发者需编写 C/C++ 代码、转换模型，并注意功耗与实时性。
八、社区大佬及资源列表
以下是 Flipper 生态中值得关注的社区人物及资源：“大佬”们的作品不仅提供工具，也倡导安全意识：
UberGuidoZ – 维护了 Flipper 的 IRDB、Sub‑GHz 数据集和大量教程，其仓库是研究者的宝库

github.com
。
I‑Am‑Jakoby – 发布了丰富的 BadUSB payload；虽然娱乐性强，但需警惕滥用

github.com
。
FalsePhilosopher – 整合 BadUSB 脚本库和教程，适合学习开发自己的脚本。
Wr3nch – 提供 GitHub 新手指南和 Flipper 教程，经常在社区答疑，帮助新人入门

github.com
。
CodeAllNight (MannyGoldstein) – 在 YouTube/TikTok 制作 Flipper 教学，涵盖基础与高级玩法，某些改装灵感来自他的分享

github.com
。
Erwin Ried – 设计 Mayhem Hat 等多合一扩展板，为 Flipper 添加摄像头、NRF24/CC1101、SD 卡等丰富功能，是硬件创新者。
Rabbit‑Labs – 推出 ESP32‑C5 双频 Wi‑Fi 6 多功能板，结合 sub‑GHz 模块和 GPS
cnx-software.com
。
Feberis/Valleytech – 开发 Feberis Pro 4‑in‑1 板，集成 Wi‑Fi、BT、sub‑GHz、GPS 和 micro‑SD，提供更强射频和存储能力（资料分散）。
九、不太为人知或神秘的玩法
虽然社区公开了大量工具与插件，仍有一些新奇或半公开的创意项目：
“无线键盘劫持”与 MouseJacking：部分用户通过外接 NRF24 L01 模块尝试实现无线键盘劫持，但可靠方法多为私下讨论；可用于模拟老旧无线鼠标/键盘的信号，提示安全漏洞。
电波调制乐器：开发者利用 Flipper 的 sub‑GHz 产生不同频率的模拟信号，配合扬声器制作“无线乐器”。
汽车无钥匙系统研究：社群研究某些未加密 Rolling Code 的汽车门禁，但许多细节不公开以避免违法；研究者强调，只用于测试自己的车辆安全性。
无线电测向和定位：结合多天线和多个 Flipper/ESP32 模块进行定向天线阵列实验，尝试通过测量信号强度差定位发射源。
Flipper One 概念：媒体报道 Flipper One 的传闻，称其或将变成可插拔模块的 Linux 便携电脑，取消内置无线电并改为模块化设计，同时兼容 Kali Linux。这一概念表明未来硬件可能转向合法可插拔架构。
这些项目尚未完全开源或商业化，多处于爱好者分享阶段。对于任何涉及破解通信或闭源协议的实验，务必遵守当地法律和道德准则。
十、法律与道德注意事项
合法用途：Flipper Zero 及其扩展主要用于安全测试、渗透演练、教育研究或物联网开发。任何未授权的信号捕获、克隆或入侵行为都可能违法。
频段限制：官方固件限制某些频段以遵守各国无线电法规，使用自定义固件打开所有频段可能违反当地通信法规。
信用卡与车钥匙：现代银行卡和汽车密钥采用滚动码或加密协议，破解风险高且违法。示例攻击仅用于安全研究
blogs.canisius.edu
。
BadUSB 脚本：不要在未经授权的电脑上运行 BadUSB；这些脚本可造成信息泄露和设备损坏。
数据隐私：VoiceLogger 等脚本会窃取麦克风数据或浏览历史，严重侵犯隐私，严禁滥用。
GPS 与追踪：带 GPS 功能的扩展板可能涉及个人位置隐私，使用时需征得他人同意。
十一、知识库整理与后续学习
为方便进一步学习，可将上述资源整理成知识库：
类型	资源/大佬	链接/说明
官方文档	Flipper Zero Official Docs	官方使用手册、API 文档、固件编译指南。
硬件扩展	ESP32 Wi‑Fi 板、Rabbit‑Labs Multi‑Board、FlipMods Combo、CC1101 模块、Mayhem Hat、Feberis Pro	用于拓展 Wi‑Fi/BLE、sub‑GHz、GPS、摄像头等功能
cnx-software.com
cnx-software.com
。
自定义固件	Unleashed、Momentum、Xtreme、RogueMaster、XFW	解锁频段限制、滚动码支持、UI 自定义、BLE Spam、GPS 记录等
spartanssec.com
momentum-fw.dev
。
BadUSB 库	I‑Am‑Jakoby、FalsePhilosopher、MarkCyber 等	Plug‑n‑play payload、恶作剧脚本和安全测试脚本

github.com
。
信号数据库	IRDB、flipperzero‑bruteforce、Amiibo/Tonies dumps、RFID/NFC dumps	红外码库、Sub‑GHz 固定码字典、任天堂 Amiibo/玩具 NFC 文件
raw.githubusercontent.com
。
AI/深度学习	ESP‑DL、ESP‑IDF、ESP‑PPQ	用于在 ESP32‑S3 上部署 TinyML 模型，配合摄像头/麦克风进行边缘 AI
cnx-software.com
docs.espressif.com
。
教程与社区	UberGuidoZ Playground、Wr3nch 指南、CodeAllNight 视频、官方论坛、Discord	提供从入门到高级的操作指导与讨论

github.com
。

通过系统地梳理这些资源，使用者可以在合法框架内充分发掘 Flipper Zero 与 ESP32‑S3 的潜力，既能进行安全研究，又能探索边缘 AI 等创新应用。


如果需要进一步补充或修改，请告诉我！

---

# FILE: Flipper Zero 与 ESP32‑S3 开发板深度融合与玩法指南.md

Flipper Zero 与 ESP32‑S3 开发板深度融合与玩法指南
一、Flipper Zero 核心功能
Flipper Zero 是一款面向安全研究者和电子爱好者的便携式多功能设备。它集成了多种无线通信和硬件接口，支持独立供电和交互，并且系统开源、可扩展。
核心功能	简述	参考
Sub‑1 GHz 无线收发器	设备内置低功耗 sub‑GHz 收发器，可捕获并分析 300 ~ 928 MHz 范围的固定码遥控器、车库门遥控器等无线信号，并可复现、重放或生成新的无线电帧，用于安全测试
openelab.io
。
openelab.io
RFID/NFC 能力	支持 LF 125 kHz 和 HF 13.56 MHz RFID，能够读取、写入和模拟常见门禁卡、公交卡等，并提供字典攻击等高级功能
openelab.io
。还支持 iButton（一线制密钥）读取与模拟
openelab.io
。
openelab.io
openelab.io
红外遥控	配备红外发射/接收器，可捕获电视、空调等红外遥控信号并学习后重放，充当通用遥控器
openelab.io
。
openelab.io
蓝牙	内置蓝牙无线电，可与蓝牙设备交互，用于扫描、嗅探或数据传输；通过固件扩展还能进行 BLE 广播或干扰
openelab.io
。
openelab.io
GPIO 与调试接口	顶部暴露 GPIO 引脚，可连接外部模块和传感器；支持 UART/SPI/I²C 等接口，方便调试单片机、刷写固件或开发硬件项目
openelab.io
。
openelab.io
独立操作	内置电池、1.4 英寸屏幕和五向按键，具备菜单系统、文件浏览器等功能，可脱离电脑独立运行
openelab.io
。
openelab.io
开源与社区扩展	Flipper Zero 运行开源固件 Flipper OS，用户可自行编译并安装插件；设备通过 GPIO 或扩展插槽连接外部模块（如 Wi‑Fi 开发板、视频游戏模块等），社区提供丰富的插件和硬件拓展
openelab.io
。
openelab.io

以上功能使 Flipper Zero 能够执行 RFID 克隆、红外学习、多频率无线分析、蓝牙嗅探、BadUSB 键盘注入等安全测试任务。但官方固件将无线频段限制在各国许可范围内，因此对一些协议的支持有限。
二、ESP32‑S3 开发板及其深度学习能力
2.1 ESP32‑S3 的硬件特性
ESP32‑S3 是乐鑫（Espressif）推出的双核 Xtensa LX7 微控制器，主频 240 MHz，内置 512 KB RAM，支持 Wi‑Fi 4 (802.11 b/g/n) 与 BLE 5.0，具有 USB OTG、摄像头接口、LCD 接口等丰富外设。芯片提供专用 向量指令集（Vector Extension），可加速矩阵运算和神经网络推理，使其适合在端侧运行 TinyML 模型
dronebotworkshop.com
。
2.2 ESP‑DL 深度学习框架
乐鑫推出的 ESP‑DL 框架为 ESP32‑S3 提供深度学习支持。框架包含神经网络推理、图像处理和数学运算库，可在 S3 的向量指令上加速执行。官方示例显示，使用向量指令的 16 位人脸识别模型推理速度比常规实现快 6.25 倍，8 位模型也快 2.5 倍
cnx-software.com
。框架自带模型库（Model Zoo），包括人脸检测、猫脸检测等预训练模型
cnx-software.com
。
ESP‑DL 要求使用 ESP‑PPQ 工具将 TensorFlow/PyTorch/ONNX 模型量化为 .espdl 格式，并在 ESP‑IDF v5.3 及以上版本环境下编译。官方文档强调使用 ESP32‑S3 或 ESP32‑P4 开发板作为硬件平台；虽然框架也可以在其他 ESP32 芯片上运行，但速度更慢
docs.espressif.com
。用户需要具备神经网络知识、ESP‑IDF 环境配置和 C/C++ 编程能力，并了解如何将模型转换为适合嵌入式设备的格式
developer.espressif.com
。

2.3 深度学习应用示例
Espressif 官方演示了基于 ESP32‑S3 的手势识别、人脸识别和人体姿态检测等项目，证明该芯片可以在端侧执行轻量级神经网络
developer.espressif.com
。通过连接摄像头模块（例如 ESP32‑S3‑EYE 或 XIAO ESP32‑S3 Sense）可以实现图像分类、目标检测等应用；搭配麦克风和加速度计，还能实现声纹识别、唤醒词检测、人类活动识别等。由于运算资源有限，模型通常经过剪枝和量化，利用向量指令获得较好的实时性能。此外，可通过 MicroPython 结合 ESP‑DSP/ESP‑NN 库调用底层向量指令，社区正在讨论在 MicroPython 中暴露 AI 加速功能
github.com
。
三、Flipper Zero 与 ESP32‑S3 的融合方式
3.1 Wi‑Fi 开发板与 Marauder 固件
Flipper Zero 官方推出的 Wi‑Fi 开发板（基于 ESP32‑S2）通过 GPIO 接口扩展 Wi‑Fi 功能，支持 OTA 更新、远程传输和 Wi‑Fi 安全测试。社区还出现了更先进的第三方扩展，例如 Rabbit‑Labs 的 Flipper Zero ESP32‑C5 多功能板。该扩展板采用双频 Wi‑Fi 6 芯片 ESP32‑C5，集成 CC1101 sub‑GHz 收发器、GPS 模块、microSD 卡槽和 USB‑C 端口
cnx-software.com
。它不仅提供 2.4 GHz 和 5 GHz Wi‑Fi 6、BLE 5.0 和 802.15.4（支持 Zigbee、Thread、Matter）无线功能，还可使用 GPS 记录位置；内置 CC1101 用于更强大的 sub‑GHz 收发
cnx-software.com
。该扩展板预装 ESP32 Marauder 固件用于 Wi‑Fi 扫描、封包捕获与安全分析，并能将扫描数据记录到 microSD 卡
cnx-software.com
。
Marauder 固件提供丰富的 Wi‑Fi 命令：

扫描：scanap 扫描附近的无线接入点；scansta 扫描接入点下的客户端；sniffbeacon、sniffpmkid 等命令用于捕获信标和 PMKID 数据，以便分析
github.com
。
攻击：attack 命令可以发送 信标骚扰、解除认证（deauth）、探测请求或 "rickroll"（播放假网络名称）等多个攻击类型，并支持指定目标 MAC 地址或随机范围
github.com
。
在实际使用中，用户首先需将 Marauder 固件刷入 ESP32‑S2/S3 开发板（官方或第三方），通过 Flipper 的 GPIO 连接线与 Flipper Zero 相连，在 Flipper 上安装相应的 Wi‑Fi Marauder 应用（Unleashed 或 Momentum 固件中提供），即可在设备菜单中进行扫描和攻击操作。通过此方式，Flipper Zero 获得 Wi‑Fi 安全测试能力，用于实验或渗透测试。
3.2 扩展板的兼容性
虽然目前大多数官方 Wi‑Fi 开发板使用的是 ESP32‑S2，但许多第三方开发板采用 ESP32‑S3，可同时提供 Wi‑Fi 和蓝牙功能，并支持 ESP‑DL。由于 Flipper Zero 只通过 UART/SPI 与外部微控制器通信，因此只要固件支持串口通信和 Flipper 的命令集，理论上可使用任意 ESP32‑S3 模块。但不同板卡的供电、电压和引脚排列可能不同，需要按照厂商指引连接。
四、社区固件与高级功能
4.1 官方固件
Flipper Zero 原厂固件提供 sub‑GHz 无线、红外遥控、NFC/RFID、蓝牙、GPIO 调试和 BadUSB 键盘注入等功能，但遵循各国无线法规，对某些频段和 rolling code 协议有限制
spartanssec.com
。
4.2 Unleashed 固件
社区开发的 Unleashed 固件移除了地区限制，支持更多频率和 rolling code 协议，提升了稳定性和续航，并集成多种社区插件
spartanssec.com
。该固件包含 RF 分析器、频谱扫描、NFC 工具、蓝牙测试、文件浏览器等插件，是多数安全研究者的首选。
4.3 Momentum 固件
Momentum 固件强调 UI 个性化和高级功能：
资产包与主题：可以快速安装动画、图标和字体主题
momentum-fw.dev
；
Find My、Bad KB & BLE Spam：集成强大的蓝牙工具包，可执行蓝牙骚扰、定位丢失的 Flipper 或 BadUSB 键盘
momentum-fw.dev
；
更多协议支持与 GPS SubDriving：增加天气、POCSAG、胎压监测等 sub‑GHz 协议以及 GPS 子驾功能
momentum-fw.dev
；
新界面与控制中心：多样化菜单风格和控制中心，可快速切换功能
momentum-fw.dev
；
Momentum Settings & JS 脚本：提供设置应用，用于定制菜单、文件管理、GPIO 定义等，并扩展 JavaScript API（USBDisk、Storage、GUI、BLE、SubGHz），用户无需 C 语言即可编写自动化流程
momentum-fw.dev
。
Momentum 还支持 GPS 日志、滚动编码遥控器支持、蓝牙垃圾邮件和“Find My BadKB”等高级渗透功能，是追求视觉和功能丰富性的用户的选择
spartanssec.com
。
4.4 渗透测试与法律风险
SpartansSec 指出，结合 Unleashed 或 Momentum 固件，Flipper Zero 可执行扩展的 sub‑GHz 信号复现、支持滚动编码协议、提供高级安全工具（例如蓝牙 spam、BadUSB 攻击、GPS 日志），并允许高度自定义界面
spartanssec.com
。然而社区开发者也警告，某些固件被恶意重新打包用于 汽车钥匙克隆和中继攻击（例如“Unleashed 2.0”卖家套件），提醒用户应遵循当地法律，用于教育和防御目的，避免非法使用。
五、ESP32‑S3 的深度学习与创新玩法
除了作为扩展板提供 Wi‑Fi/BLE 功能，ESP32‑S3 本身也是一款面向边缘 AI 的开发板。利用其向量指令和 ESP‑DL 框架，可以在微控制器上实现以下玩法：
图像分类与目标检测：连接摄像头模块，在本地运行量化的 CNN 模型进行人脸识别、手势识别或物体分类。ESP‑DL 模型库提供人脸与猫脸检测模型，用户也可以用 ESP‑PPQ 将自定义模型转换为 .espdl 格式
cnx-software.com
docs.espressif.com
。
语音与声音识别：利用外接麦克风和 ESP‑DSP 库构建唤醒词检测、声纹识别或简单语音命令识别项目。S3 的向量指令可以加速 FFT 和卷积运算，实现实时响应。
人体姿态与动作识别：结合加速度计、陀螺仪与 ESP‑DL，实现步态分析或活动分类
developer.espressif.com
。这类模型常用于健身监测或老年人摔倒检测。
传感器数据预测：通过 ESP‑NN 运行小型回归或时间序列模型，对温度、湿度或环境污染数据进行预测，可用于智能农业或空气质量监测。由于模型轻量，S3 可通过电池供电长时间运行。
MicroPython AI：社区正在研究在 MicroPython 中暴露向量指令，通过 ESP‑DSP 和 ESP‑NN 库加速神经网络；用户可用 Python 编写 AI 程序而无需深入 C 语言
github.com
。
这些任务可通过 Wi‑Fi/BLE 将推理结果发送至 Flipper Zero，实现设备状态显示或远程提醒。例如，使用 ESP32‑S3 分析传感器数据并通过 Flipper 的屏幕或振动提醒用户异常情况。
六、能写什么、能玩什么
Flipper Zero 与 ESP32‑S3 的组合为爱好者提供了丰富的创意空间，以下是一些实际项目建议：
Wi‑Fi 安全实验：刷写 Marauder 固件的 ESP32‑S3/S2 开发板，并通过 Flipper Zero 操作 scanap、scansta 和 sniffpmkid 等命令采集无线网络信息；随后使用 attack 命令实验性地进行信标骚扰或解除认证攻击
github.com
github.com
。可将结果存储在 SD 卡或通过 BLE 发送至手机，用于研究网络安全。
子 GHz 信号探测与控制：利用 Flipper Zero 的 sub‑GHz 收发器捕获车库门遥控器信号，并通过 S3 模块对信号进行分析和重放，用于研究滚动编码协议。结合 Unleashed 固件可突破某些频段限制，实现更广泛的射频测试
spartanssec.com
。
智能遥控中心：将 ESP32‑S3 作为 AI 模块，运行手势识别模型控制家庭红外设备：举手手势即可控制电视或空调；模型在 S3 上运行，通过 UART 告知 Flipper Zero 发送相应的 IR 码，实现无按键控制。
BLE Spam 与设备定位：使用 Momentum 固件的 BLE Spam/FindMy BadKB 工具进行蓝牙广播实验，模拟 AirTag 定位、键盘查找或 BLE 信息推送
momentum-fw.dev
。通过自编脚本，还可以开发用于提醒或提示的 BLE 广告包。
GPS Wardriving 和数据记录：使用 Rabbit‑Labs 多功能板内置的 GPS 与 CC1101 收发器，在行车过程中同时记录 Wi‑Fi、sub‑GHz 信号和地理位置，生成可视化热力图。这种能力在网络勘测或物联网安全评估中很有价值
cnx-software.com
。
自定义插件与游戏：社区提供了视频游戏模块、USB 大容量存储、Evil Crow RF V2、温湿度传感器等各种插件
spartanssec.com
。你可以编写自己的 C 插件或使用 Momentum 的 JavaScript API 实现自动化流程，如定时发送红包问候、扫频分析并语音提示等。
TinyML 创意项目：使用 ESP‑DL 在 ESP32‑S3 上训练植物病害检测、心率异常检测或野生动物识别模型，将识别结果通过 BLE 传输给 Flipper Zero，在屏幕上显示或通过蜂鸣器提醒。乐鑫的示例表明，S3 足以胜任上述轻量级任务，并可在离线环境下运行
cnx-software.com
developer.espressif.com
。
七、社区支持与作品
Flipper Zero 的成功离不开活跃的开源社区。官方 GitHub 维护 Flipper OS 源代码，并允许用户提交插件。社区还创建了多个固件分支（Unleashed、Momentum、RogueMaster 等）和大量第三方模块。SpartansSec 总结了常见外设，包括：
Evil Crow RF V2：高级 sub‑GHz 嗅探与信号重放工具；
Find My BadKB：通过蓝牙追踪 Flipper 或 BadUSB 键盘；
BLE Spam 工具：用于发送自定义蓝牙广播信息；
Video Game Module：让 Flipper 充当掌上游戏机；
USB 大容量存储/NFC 应用/RF 工具/模糊器/温湿度传感器 等
spartanssec.com
。
Momentum 网站还提供资产包、主题包和 JS 脚本分享区，用户可以上传自己的作品并与社区交流
momentum-fw.dev
。与 ESP32‑S3 相关的项目则在 GitHub 上有专门的仓库，例如 ESP‑DL 示例库、Marauder 固件、ESP‑NN/ESP‑DSP 等。许多开发者撰写教程介绍如何在 S3 上部署人脸识别、语音识别等项目，使用者可以根据自身需求选择中文或英文资源。
社区同时提醒用户保持道德和法律意识：不要在未经授权的情况下扫描或攻击他人网络，不要非法克隆门禁卡或汽车钥匙。使用这些工具前应了解当地法律法规，以教育、研究和防御为目标。只有在合法授权的情况下利用 Flipper Zero 和 ESP32‑S3 进行渗透测试，才能让技术真正促进安全。

总结
Flipper Zero 的强大之处在于其开放的平台和丰富的无线接口，配合 ESP32‑S3 开发板和 ESP‑DL 库，用户可以将传统的安全测试工具与边缘人工智能融合，实现 Wi‑Fi 分析、sub‑GHz 信号实验、蓝牙渗透、BadUSB 攻击等多种玩法，并扩展出图像识别、语音识别、姿态分析等 TinyML 应用。社区固件（Unleashed、Momentum）为这些玩法提供了深度支持，加入滚动编码解码、GPS 子驾、UI 个性化等功能。第三方扩展板（如 Rabbit‑Labs C5 多板）则带来双频 Wi‑Fi 6、CC1101 收发器和 GPS，使 Flipper 在硬件上更具竞争力。
通过遵守法律法规和道德规范，善用社区资源，你可以在 Flipper Zero 与 ESP32‑S3 的生态系统中探索几乎无限的创新项目，实现无线安全研究与人工智能边缘计算的完美结合。

。
如果需要进一步修改或补充信息，请告诉我！

---

# FILE: Flipper Zero 与 ESP32‑S3 开发板：深度扩展与知识库.md

Flipper Zero 与 ESP32‑S3 开发板：深度扩展与知识库
一、进阶玩法与物理扩展
在上一份报告中，我们总结了 Flipper Zero 与 ESP32‑S3 的基本功能与常见扩展。本节进一步挖掘社区中一些进阶玩法和基于物理层的改造思路，帮助用户拓展视野。
1.1 现实攻击与安全测试案例
MIFARE Classic 卡破解与编辑：2026 年的 MDPI 学术论文通过实测展示了 Flipper Zero 的 RFID 功能。研究者利用内置工具对 MIFARE Classic 1K 门禁卡执行 "Nested Attack"，在弱加密 CRYPTO1 上恢复卡密钥，从而读取并修改扇区数据
mdpi.com
。这证明了 Flipper Zero 在物理接触攻击（无网络情况下）的强大能力。
固定码 vs. 滚动码：同一论文比较了低频无线遥控系统中固定码和滚动码的差异。使用内置的 Sub‑GHz "Bruteforcer" 可以轻松开锁 433 MHz 固定码系统，而面对滚动码系统则无功而返
mdpi.com
。这验证了滚动码的重要性，也说明了 Flipper Zero 在固定码系统中的攻击潜力。
USB HID 和信息窃取：研究者利用 Momentum 固件的 JavaScript 引擎编写了一段 BadUSB 脚本，自动在 Windows 上运行 PowerShell 收集环境变量、IP、Wi‑Fi 密码等敏感信息，并通过模拟 U 盘存储导出
mdpi.com
。这种基于物理接口的攻击展示了设备在渗透测试中的价值。
BLE Spam 造成可用性退化：同一研究还利用 Momentum 的 BLE Spam 功能发送大量随机广播，导致部分 iOS 设备出现弹窗和重启
mdpi.com
。这是通过无线干扰造成的拒绝服务示例。
这些案例说明 Flipper Zero 不仅能复制遥控器，还能执行 RFID 破解、无线协议暴力破解、USB/蓝牙注入等复杂操作，为红队提供现实的攻击模拟场景。
1.2 高阶固件与功能拓展
Unleashed 固件 – 拓展信号捕捉与暴力破解：HackMag 的固件指南指出，官方固件无法录制或重放汽车钥匙等敏感信号，并禁止对需要发送特定值的协议执行暴力破解
hackmag.com
。Unleashed 移除这些限制，允许拦截、记录和回放更多频率，并内置自动循环所有可能代码的工具，以对门禁系统进行暴力测试
hackmag.com
。在 Sub‑GHz 模式下取消区域限制，几乎可以访问硬件可支持的任何频段
hackmag.com
。
Xtreme 固件 – BadUSB / 蓝牙双模式键盘：Xtreme 是 Unleashed 的改进版，提供稳定性与界面自定义。其 BadKB 功能支持 Ducky Script 1.0，既可以通过 USB 有线接口，也可通过蓝牙无缝连接到记忆中的设备执行 HID 注入，并允许修改蓝牙 MAC 地址
hackmag.com
。该固件还提供子 GHz 管理、菜单美化和虚拟宠物自定义等功能
hackmag.com
。
RogueMaster 固件 – 全功能工具集：RogueMaster 是 Unleashed 的一个分支，兼容大量第三方工具，包含 iButton fuzzer、RFID/Sub‑GHz 暴力破解器、CLI 模式等
hackmag.com
。其劣势是稳定性较差，但适合希望深入调试和研究源代码的用户。
高级固件不仅扩展无线频段，还提供了定制化界面、脚本引擎及更多工具，例如单元转换器、条码生成器、Brainfuck 开发环境甚至 Doom 游戏
hackmag.com
。这些插件让 Flipper Zero 从单纯的安全工具变成可编程的平台。
1.3 物理层硬件改装
外置 CC1101 模块与天线：MDPI 论文建议对外接 GPIO/Wi‑Fi 开发板及 专用 sub‑GHz 天线 进行实证研究，以扩展设备的有效距离和抗干扰能力
mdpi.com
。社区已有厂商推出外置 CC1101 模块带高增益天线，可将 Flipper Zero 的 sub‑GHz 发射接收范围提高几倍，并支持 433 MHz、868 MHz 等常用频段。
多功能扩展板：Rabbit‑Labs 发布的 ESP32‑C5 多功能板内置 CC1101 收发器、GPS、microSD，可实现双频 Wi‑Fi 6、BLE 5.0、Zigbee/Thread/Matter 通讯，适合进行 GPS wardriving、网关开发等高阶项目
cnx-software.com
。这类硬件扩展构建了更强大的物理层平台。
内部改装/自制板卡：社区中有玩家拆开 Flipper Zero，在内部加入 ESP32‑S3 模块或改用更大容量电池，以增加 Wi‑Fi/BLE 功能和续航。这类改装需精通焊接与电路设计，风险较高，但代表了创客精神。虽然相关教程多在论坛或视频中分享，本报告仅建议有经验者尝试。
二、未挖掘的潜能与创新项目
Flipper Zero 与 ESP32‑S3 仍有诸多未被充分挖掘的潜能：
高性能智能算法：ESP‑DL 的向量指令使得 S3 可以运行更加复杂的卷积神经网络。例如使用卷积神经网络识别手势后，可自动触发 Flipper Zero 发送红外代码控制电器或发送 sub‑GHz 信号控制遥控器，这类跨协议自动化结合了 AI 与物理层。
物联网网关：利用 ESP32‑S3 的 Wi‑Fi 4 和 BLE 5 mesh 能力，将 Flipper Zero 作为可视化界面，实现 Zigbee/Matter 传感器与家庭 Wi‑Fi 之间的桥接，实现小型家庭自动化系统。
频谱分析与认知无线：第三方软件正尝试利用 ESP32‑S3 的 SDR 能力和 CC1101 模块，实现简单频谱分析器，用于研究 400 MHz/900 MHz 频段的信号拥塞和噪声分布。
物理安全交互：结合加速度计、触摸传感器和 TinyML 模型，让 Flipper Zero 可以通过敲击或手势识别激活特定模式，例如长按振动三次后自动启动 BadUSB 攻击。
这些项目尚处于社区探索阶段，显示出设备与开发板的强大拓展性。
三、知识库：文档与资源汇总
以下列出值得参考的官方资料、社区文档和学术文章，形成一个便于查询的知识库：
资源/文档	内容概述	引用
Flipper Zero 官方文档	官方提供的硬件说明书、用户手册、固件编译指南和 microSD 设置教程；包含 iButton、RFID、Sub‑GHz、IR、GPIO 等子系统的使用方法。
mdpi.com
mdpi.com
SpartansSec 文章《Flipper Zero: Choosing the Best Firmware for Pentesting》	比较官方与社区固件，介绍 Unleashed/Momentum 的高级功能（滚动码支持、UI 定制、GPS SubDriving、BLE spam）及 pentest 注意事项。
spartanssec.com
spartanssec.com
Momentum 官方网站	详细列出 Momentum 固件的功能：资产包、FindMy/BadKB/BLE Spam、控制中心、JavaScript API 等。
momentum-fw.dev
HackMag《Alternative Firmware Options for Flipper Zero》	介绍 Unleashed、Xtreme、RogueMaster 等固件的差异和优势；指出官方固件无法记录汽车钥匙信号并限制暴力破解，而 Unleashed/Xtreme 解除限制，支持自动枚举所有门禁代码
hackmag.com
hackmag.com
。文章还强调 Xtreme 的双模式 BadUSB 与蓝牙键盘注入
hackmag.com
。
hackmag.com
hackmag.com
MDPI 论文《Exploring the Real Capabilities of the Flipper Zero》（2026）	对 IR、RFID/NFC、sub‑GHz、USB、BLE 功能进行实测；展示了 Nested Attack 破解 MIFARE Classic 1K、固定码系统暴力破解、JS HID 自动化窃取数据，以及 BLE Spam 导致的 iOS 可用性退化
mdpi.com
mdpi.com
。还提出未来研究应验证专用天线和 GPIO 扩展
mdpi.com
。
mdpi.com
mdpi.com
mdpi.com
ESP‑DL 用户指南与博客	说明 ESP32‑S3 的硬件需求、模型量化步骤、AI 加速及示例项目
docs.espressif.com
cnx-software.com
。
docs.espressif.com
cnx-software.com
Marauder CLI 文档	罗列 Wi‑Fi 扫描、嗅探与攻击命令，包括 scanap、scansta、sniffpmkid、attack 等，并解释各参数用途
github.com
github.com
。
github.com
github.com
Rabbit‑Labs ESP32‑C5 多功能板介绍	阐述扩展板集成双频 Wi‑Fi 6、CC1101 sub‑GHz 收发器、GPS、microSD，并运行 Marauder 固件用于 Wi‑Fi 与 RF 分析
cnx-software.com
cnx-software.com
。
cnx-software.com
cnx-software.com
HackMag 文章《Alternative Firmware Options》	评价 Xtreme、RogueMaster 等固件的亮点与不足，例如 RogueMaster 集成 iButton fuzzer 和 CLI 但稳定性较差
hackmag.com
。
hackmag.com

这些资源覆盖硬件特性、固件选择、攻击案例和 AI 开发指南，构成了探索 Flipper Zero 和 ESP32‑S3 的基础知识库。
结语
通过进一步挖掘可知，Flipper Zero 结合 ESP32‑S3 远不止是“遥控器复制器”：其多样的固件和物理扩展让它可以破解经典门禁卡、测试固定码系统的脆弱性、执行复杂的 BadUSB 攻击并利用 BLE Spam 干扰设备
mdpi.com
mdpi.com
。高级固件如 Unleashed 和 Xtreme 解锁了官方未开放的频段和协议，支持暴力破解滚动码、蓝牙键盘注入等功能
hackmag.com
hackmag.com
。与此同时，ESP‑DL 框架赋予 ESP32‑S3 在边缘端执行 AI 模型的能力
docs.espressif.com
cnx-software.com
，使我们能够构建基于物理世界感知的自动化流程。随着社区不断推出新硬件、固件和脚本，这款小设备仍有许多潜力等待被开发。

。
该报告包含：

现实案例与安全测试：分析了学术论文中的 MIFARE Classic 破解、Sub‑GHz 固定码暴力破解、BadUSB 自动窃取数据、BLE Spam 干扰等真实实验
mdpi.com
mdpi.com
。
高级固件功能：介绍了 Unleashed、Xtreme、RogueMaster 等固件解锁的高级攻击功能，如全频段捕捉、滚动码暴力破解、蓝牙键盘注入等
hackmag.com
hackmag.com
。
物理层改装：探讨了外接 CC1101 模块和专用天线、Rabbit‑Labs 多功能板、内部改装等扩展方案
cnx-software.com
。
未挖掘的潜能：展望利用 ESP‑DL 实现 AI + 信号联动、物联网网关、频谱分析等创新项目。
知识库：汇集官方文档、MDPI 学术论文、HackMag 固件评测、SpartansSec 指南、Momentum 网站、Marauder CLI 文档等资源，方便进一步查阅。
如需补充某一部分或对报告内容进行修改，请随时告诉我。

