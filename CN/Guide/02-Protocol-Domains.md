# 02. 协议域

[返回中文教学导航](README.md) | [上一章：01. 设备与生态](01-Device-Ecosystem.md) | [下一章：03. App 开发](03-App-Development.md)

## 本章作用

Flipper Zero 不是一个单一功能设备，而是多个能力域并存的平台。真正高效的学习方式，不是从“我要做某个场景”出发，而是先问：这个问题属于哪个协议域、哪个硬件边界、哪个文件格式、哪个开发层级。

本章的作用，就是帮助你建立协议域思维。只要这个思维建立起来，后面无论阅读官方文档、写 App、分析文件、整理社区项目，都会清楚很多。

## 本章建议先读的仓库内文档

- [01. 设备与生态](01-Device-Ecosystem.md)：先知道从哪里进入各项能力。
- [07. 文件格式](07-File-Formats.md)：稍后回头把协议域和文件格式对应起来。
- [中文主知识库](../FlipperZero-Master-CN.md)：回看各能力域在全局中的位置。
- [官方文档中文精读总表](../Official-Docs-CN-Full.md)：用于进一步核对术语与边界。

## 官方核心页面

- [NFC](https://docs.flipper.net/nfc)
- [Sub-GHz](https://docs.flipper.net/sub-ghz)
- [iButton](https://docs.flipper.net/ibutton)
- [U2F](https://docs.flipper.net/zero/u2f)
- [GPIO & Modules](https://docs.flipper.net/gpio-and-modules)

## 本章要解决的核心问题

- 为什么必须先区分不同能力域，再谈工具、脚本或项目。
- 为什么不同域之间不能随意混用术语、样例和文件。
- 为什么同一个“功能需求”可能同时跨越协议域、App 层和文件层。

## 必须分开的主域

### 1. NFC

[NFC](https://docs.flipper.net/nfc) 是独立能力域，有自己的读取流程、菜单入口、数据类型和文件组织方式。不要把它与 LF RFID、iButton 或 Sub-GHz 混为一谈。

### 2. Sub-GHz

[Sub-GHz](https://docs.flipper.net/sub-ghz) 涉及频段、协议、预设、RAW 与非 RAW 数据等概念。它既有较强的射频属性，也高度依赖文件格式和设备支持边界。

### 3. iButton

[iButton](https://docs.flipper.net/ibutton) 是单独的能力域。虽然它和访问控制场景常被一起提起，但不能因此把 iButton 与 RFID 或 NFC 合并理解。

### 4. RFID 与其他身份类域

LF RFID、NFC、iButton 看起来都可能出现在身份识别或门禁环境中，但它们是不同技术域。后面阅读 [07. 文件格式](07-File-Formats.md) 时要特别注意不同格式不能互相代替。

### 5. Infrared、BadUSB、GPIO、U2F

这些能力同样属于各自独立的域或子系统。尤其是 [GPIO & Modules](https://docs.flipper.net/gpio-and-modules) 与 [U2F](https://docs.flipper.net/zero/u2f)，它们在后续开发和外设扩展中经常出现，但不属于前面几类协议域的简单延伸。

## 理解协议域时要注意的三层分离

- 第一层是能力域本身：例如 NFC、Sub-GHz、iButton。
- 第二层是承载形式：例如设备菜单、App、CLI、脚本、文件格式。
- 第三层是工程实现：例如外部应用、系统 API、外设模块、社区项目。

这三层如果混在一起，就很容易出现“看起来都能做，但不知道实际在做哪一层”的问题。

## 建议阅读顺序

1. 先看 [NFC](https://docs.flipper.net/nfc)、[Sub-GHz](https://docs.flipper.net/sub-ghz)、[iButton](https://docs.flipper.net/ibutton)、[U2F](https://docs.flipper.net/zero/u2f) 的官方页面。
2. 再回到 [07. 文件格式](07-File-Formats.md)，把每个域对应的文件结构补上。
3. 然后阅读 [03. App 开发](03-App-Development.md)，理解一个 App 怎样围绕这些域工作。
4. 最后再结合 [08. 社区参考](08-Community-Reference.md)，吸收某些域的社区数据或样例仓库。

## 学完本章后应具备的能力

- 看到一个需求时，能先判断它属于哪个协议域。
- 能区分“能力域”“文件格式”“App 层”“系统层”这几个层次。
- 能知道后续查资料时该先去官方页面、格式文档还是开发文档。

## 继续阅读

- 下一章：[03. App 开发](03-App-Development.md)
- 回到上一章：[01. 设备与生态](01-Device-Ecosystem.md)
- 查看主线总览：[中文主知识库](../FlipperZero-Master-CN.md)
- 查看官方精读：[官方文档中文精读总表](../Official-Docs-CN-Full.md)

[返回中文教学导航](README.md) | [上一章：01. 设备与生态](01-Device-Ecosystem.md) | [下一章：03. App 开发](03-App-Development.md)
