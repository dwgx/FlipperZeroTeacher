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
