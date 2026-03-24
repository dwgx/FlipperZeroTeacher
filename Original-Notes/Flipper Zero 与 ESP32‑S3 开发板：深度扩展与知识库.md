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
