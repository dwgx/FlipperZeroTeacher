# 06. 系统编程

[返回中文教学导航](README.md) | [上一章：05. JavaScript](05-JavaScript.md) | [下一章：07. 文件格式](07-File-Formats.md)

## 本章作用

当你已经理解 App 开发、工具链和脚本路线之后，就会遇到一个关键问题：哪些需求仍然能留在应用层，哪些需求已经进入系统层。本章的目标，就是帮助你建立“系统编程边界感”，知道什么时候需要进入平台层、硬件抽象层、资源打包层和测试层。

本章不是鼓励一开始就深入系统内部，而是帮助你在真正需要时，能以正确顺序阅读官方系统资料。

## 本章建议先读的仓库内文档

- [03. App 开发](03-App-Development.md)：先确认应用层已经掌握。
- [04. 构建、调试与工具链](04-Build-Debug-Tools.md)：系统层问题高度依赖调试链。
- [07. 文件格式](07-File-Formats.md)：很多资源和数据问题最终会回到格式层。
- [中文主知识库](../FlipperZero-Master-CN.md)
- [官方文档中文精读总表](../Official-Docs-CN-Full.md)
- [官方文档覆盖表](../../Official-Docs-Coverage.md)

## 官方核心页面

- [System](https://developer.flipper.net/flipperzero/doxygen/system.html)
- [Unit Tests](https://developer.flipper.net/flipperzero/doxygen/unit_tests.html)
- [furi_check](https://developer.flipper.net/flipperzero/doxygen/furi_check.html)
- [Furi HAL Bus](https://developer.flipper.net/flipperzero/doxygen/furi_hal_bus.html)
- [Hardware Targets](https://developer.flipper.net/flipperzero/doxygen/hardware_targets.html)
- [Firmware Assets](https://developer.flipper.net/flipperzero/doxygen/firmware_assets.html)

## 本章要解决的核心问题

- 如何判断一个问题已经不是单纯的 App 问题。
- 单元测试、断言、崩溃检查、HAL 和 target 分别属于哪一层。
- 固件资源、目标平台和运行环境之间如何互相影响。

## 必须掌握的几个系统入口

### 1. 系统总览

[System](https://developer.flipper.net/flipperzero/doxygen/system.html) 是系统层入口页。它帮助你知道官方把哪些内容视为平台内部能力，而不是普通应用能力。

### 2. 单元测试

[Unit Tests](https://developer.flipper.net/flipperzero/doxygen/unit_tests.html) 能帮助你理解系统级代码如何验证。它的重要性在于：当你不再只是写一个界面或简单逻辑时，测试方式会开始影响你的工程质量。

### 3. 断言与崩溃检查

[furi_check](https://developer.flipper.net/flipperzero/doxygen/furi_check.html) 对理解断言、崩溃、强制停止和调试关系非常关键。很多系统层问题最终都要借助这里的机制定位。

### 4. 硬件抽象层

[Furi HAL Bus](https://developer.flipper.net/flipperzero/doxygen/furi_hal_bus.html) 是理解硬件抽象层边界的重要入口。读这类页面时，要始终问自己：我是在做平台能力扩展，还是只是在做某个应用功能。

### 5. 硬件目标与资源打包

[Hardware Targets](https://developer.flipper.net/flipperzero/doxygen/hardware_targets.html) 与 [Firmware Assets](https://developer.flipper.net/flipperzero/doxygen/firmware_assets.html) 说明了目标平台和资源打包的结构。它们对于理解不同目标、资源组织和最终运行环境都很重要。

## 建议阅读顺序

1. 先读 [System](https://developer.flipper.net/flipperzero/doxygen/system.html)，建立系统层地图。
2. 再读 [Unit Tests](https://developer.flipper.net/flipperzero/doxygen/unit_tests.html) 与 [furi_check](https://developer.flipper.net/flipperzero/doxygen/furi_check.html)，理解测试与调试。
3. 接着读 [Furi HAL Bus](https://developer.flipper.net/flipperzero/doxygen/furi_hal_bus.html)，进入硬件抽象层边界。
4. 最后读 [Hardware Targets](https://developer.flipper.net/flipperzero/doxygen/hardware_targets.html) 与 [Firmware Assets](https://developer.flipper.net/flipperzero/doxygen/firmware_assets.html)，补足目标平台与资源结构。

## 学完本章后应具备的能力

- 能判断一个问题是否已经进入系统层。
- 能知道系统级资料应该按什么顺序阅读。
- 能理解测试、断言、HAL、target、资源打包之间的大致关系。
- 能避免在应用层问题上过早进入系统层，也能避免在系统层问题上继续只看应用层文档。

## 继续阅读

- 下一章：[07. 文件格式](07-File-Formats.md)
- 回到上一章：[05. JavaScript](05-JavaScript.md)
- 回到 App 主线：[03. App 开发](03-App-Development.md)
- 查看官方精读：[官方文档中文精读总表](../Official-Docs-CN-Full.md)

[返回中文教学导航](README.md) | [上一章：05. JavaScript](05-JavaScript.md) | [下一章：07. 文件格式](07-File-Formats.md)
