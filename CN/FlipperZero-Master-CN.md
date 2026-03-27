# FlipperZero 主知识库（中文）

这是中文主线版，目标是让人类先读明白，也方便后续给 AI 学。

## 1. Flipper Zero 最准确的定位

它不应被理解为夸张化的“万能设备”，更准确的定位是：

- 便携式多接口实验平台
- 物理世界协议学习器
- 可编程小终端
- 可与外设和桌面工具协作的前端设备

## 2. 最推荐的主学习顺序

1. 先理解桌面、菜单、Archive、状态栏
2. 再理解硬件能力边界和 GPIO 现实限制
3. 再会用 `qFlipper`、Mobile App、CLI、Apps
4. 再按 `NFC / Sub-GHz / iButton / U2F` 分域理解能力
5. 再进 `FAP / FAM / App Examples / Publishing`
6. 再补 `FBT / uFBT / VS Code / Dev Board`
7. 再学 `JavaScript / File Formats / System Programming`
8. 最后再回头看源码、社区精华和高级硬件资料

## 3. 这套最终文件夹里最该先读什么

先读这几份：

- `CN/Official-Docs-CN-Full.md`
- `CN/FlipperZero-AI-Pack-CN.md`
- `Official-Docs-Coverage.md`
- `Original-Notes/FlipperZero-Original-Desktop-Notes-All-In-One.md`

再按需要看英文版：

- `EN/Official-Docs-EN-Full.md`
- `EN/FlipperZero-AI-Pack-EN.md`

## 4. 官方主线基线

最重要的官方来源：

- `https://docs.flipper.net/zero/development`
- `https://developer.flipper.net/flipperzero/doxygen/`
- `https://github.com/flipperdevices/flipperzero-firmware`
- `https://github.com/flipperdevices/flipperzero-ufbt`
- `https://github.com/flipperdevices/flipper-application-catalog`

默认开发路线：

- 对绝大多数人，先 `FAP`
- 再 `uFBT` 或 `FBT`
- 再 `JS`
- 再 `File Formats`
- 再 `System Programming`
- 最后才决定是否需要深改固件

## 5. 最核心的协议域

主域：

- Sub-GHz
- NFC
- RFID
- iButton
- Infrared
- BadUSB
- BLE
- GPIO
- U2F

构建知识库时，最好不要按零散案例划分，而应按这些协议域和系统层划分。

## 6. 官方生态层别漏掉

很多人只盯着设备本体，但真正长期使用一定会用到：

- `qFlipper`
- `Flipper Mobile App`
- `Apps`
- `Flipper Lab`
- `Archive`
- `CLI`
- `File Formats`

这几层决定你是否具备管理、调试、传输、发布和排障的完整工作流能力。

## 7. 资源补充库

除了上述核心入口，还有两个补充资源：

- `FlipperZero_资源库/`
  本地整理的完整技术资源，包含频率数据库、BLE详解、NFC/RFID技术、固件指南等。适合作为快速查阅的补充资料。

- `Wiki-Resources/`
  官方资源存档，包含网页快照、官方源码仓库（qFlipper、docs、flipper-application-catalog等）。详见 [Wiki-Resources/README.md](../Wiki-Resources/README.md)

- `CN/qFlipper-全网融合总文档.md`
  qFlipper 桌面端完整使用指南，包含CLI命令、故障排除、更新通道等。

## 8. 社区精华只保留这些

### 8.1 生态总地图

- `UberGuidoZ/Flipper`
  URL：`https://github.com/UberGuidoZ/Flipper`
  为什么保留：最好用的社区导航仓库之一，覆盖资源、硬件、排障、工具和资料索引

- `awesome-flipperzero`
  URL：`https://github.com/djsime1/awesome-flipperzero`
  为什么保留：最适合做“发现层”和筛选入口

### 7.2 开发者学习

- `jamisonderek/flipper-zero-tutorials`
  URL：`https://github.com/jamisonderek/flipper-zero-tutorials`
  Wiki：`https://github.com/jamisonderek/flipper-zero-tutorials/wiki`
  为什么保留：是官方文档和实际开发之间最好的桥梁之一，尤其是 Debugging、UI、GPIO、JS 这些主题

- `DroomOne/Flipper-Plugin-Tutorial`
  URL：`https://github.com/DroomOne/Flipper-Plugin-Tutorial`
  为什么保留：适合看最小可运行插件思路，但要和当前官方 docs 交叉核对

### 7.3 真实项目与工具链

- `flipperzero-esp-flasher`
  URL：`https://github.com/0xchocolate/flipperzero-esp-flasher`
  为什么保留：很能代表“Flipper 作为现场工具”的价值

- `FlipperHTTP`
  URL：`https://github.com/jblanked/FlipperHTTP`
  为什么保留：适合学习 Flipper 加协处理器的架构模式

- `flipwire`
  URL：`https://github.com/liamhays/flipwire`
  为什么保留：适合学习主机侧自动化和蓝牙控制工作流

- `flipperzero-gps`
  URL：`https://github.com/ezod/flipperzero-gps`
  为什么保留：适合学习 UART 外设、NMEA、官方固件兼容性纪律

- `flipperzero-qrcode`
  URL：`https://github.com/bmatcuk/flipperzero-qrcode`
  为什么保留：小而干净，适合看一个规整的外部 App 仓库长什么样

### 7.4 数据与资料库

- `Flipper-IRDB`
  URL：`https://github.com/UberGuidoZ/Flipper-IRDB`
  为什么保留：红外资料库的事实标准之一

## 9. 不建议一开始就走的路

下面这些不是不能看，而是不该作为主线起点：

- 上来就刷第三方固件
- 上来就改整机固件
- 只追社区案例，不先读官方 docs
- 只看零散仓库，不建立自己的目录体系

## 10. 一句总原则

- `先官方，后社区；先外部应用，后固件；先理解协议，再进入具体应用场景。`
