# 05. JavaScript

[返回中文教学导航](README.md) | [上一章：04. 构建、调试与工具链](04-Build-Debug-Tools.md) | [下一章：06. 系统编程](06-System-Programming.md)

## 本章作用

这一章的重点不是教你把 JavaScript 当成万能方案，而是帮助你准确理解它在 Flipper Zero 平台上的位置。很多误解来自把设备端 JavaScript 想象成浏览器 JavaScript 或 Node.js 运行时，这样会直接导致错误的 API 期待、错误的模块理解和错误的资源判断。

本章的任务，是把 JavaScript 路线明确为“轻量脚本与快速原型路线”，并且告诉你它和外部应用、系统编程之间的分界线。

## 本章建议先读的仓库内文档

- [03. App 开发](03-App-Development.md)：先知道标准 App 路线是什么。
- [04. 构建、调试与工具链](04-Build-Debug-Tools.md)：理解脚本运行也依赖整体开发环境。
- [06. 系统编程](06-System-Programming.md)：知道什么时候必须离开脚本层。
- [中文主知识库](../FlipperZero-Master-CN.md)
- [官方文档中文精读总表](../Official-Docs-CN-Full.md)
- [中文 AI 规则包](../FlipperZero-AI-Pack-CN.md)

## 官方核心页面

- [JavaScript 总览](https://developer.flipper.net/flipperzero/doxygen/js.html)
- [About JS Engine](https://developer.flipper.net/flipperzero/doxygen/js_about_js_engine.html)
- [Your First JS App](https://developer.flipper.net/flipperzero/doxygen/js_your_first_js_app.html)
- [Developing Apps Using JS SDK](https://developer.flipper.net/flipperzero/doxygen/js_developing_apps_using_js_sdk.html)
- [Using JS Modules](https://developer.flipper.net/flipperzero/doxygen/js_using_js_modules.html)

## 本章要解决的核心问题

- Flipper Zero 的 JavaScript 运行时到底是什么，不是什么。
- 什么任务适合走 JS 路线，什么任务不适合。
- JS SDK、模块、设备运行时和平台能力之间是什么关系。

## 必须掌握的边界

### 1. 它不是浏览器，也不是 Node.js

阅读 [About JS Engine](https://developer.flipper.net/flipperzero/doxygen/js_about_js_engine.html) 时，应优先建立这一点。不要把网页脚本、Node 包生态和设备脚本环境混在一起。

### 2. 它适合轻量功能与快速原型

如果你的目标是：

- 快速验证某个想法
- 编写轻量功能
- 处理较简单的交互或自动化
- 做演示、教学或原型

那么 JavaScript 路线通常更高效。

### 3. 它不适合替代所有系统级需求

如果你的目标涉及：

- 深层系统控制
- 更复杂的性能与资源管理
- 需要直接进入更底层的平台接口
- 与系统层、HAL、固件资源有更紧密耦合

那么你通常需要回到 [03. App 开发](03-App-Development.md) 或进入 [06. 系统编程](06-System-Programming.md)。

### 4. JS SDK 与模块化

[Developing Apps Using JS SDK](https://developer.flipper.net/flipperzero/doxygen/js_developing_apps_using_js_sdk.html) 与 [Using JS Modules](https://developer.flipper.net/flipperzero/doxygen/js_using_js_modules.html) 的重点在于：你要理解模块边界、加载方式、运行环境限制，以及“可用 API”并不是无穷无尽的。

## 建议阅读顺序

1. 先读 [JavaScript 总览](https://developer.flipper.net/flipperzero/doxygen/js.html)，确认整体路线。
2. 再读 [About JS Engine](https://developer.flipper.net/flipperzero/doxygen/js_about_js_engine.html)，先把边界想清楚。
3. 接着读 [Your First JS App](https://developer.flipper.net/flipperzero/doxygen/js_your_first_js_app.html)，理解最小可运行路径。
4. 然后读 [Developing Apps Using JS SDK](https://developer.flipper.net/flipperzero/doxygen/js_developing_apps_using_js_sdk.html)，补足开发模型。
5. 最后读 [Using JS Modules](https://developer.flipper.net/flipperzero/doxygen/js_using_js_modules.html)，理解模块化组织方式。

## 学完本章后应具备的能力

- 能判断一个需求是否适合走 JavaScript 路线。
- 能解释设备端 JavaScript 与浏览器/Node.js 的差异。
- 能区分脚本层能力、App 层能力和系统层能力。
- 能把 JavaScript 当作正式知识库中的一条独立开发路线，而不是零散技巧集合。

## 继续阅读

- 下一章：[06. 系统编程](06-System-Programming.md)
- 回到上一章：[04. 构建、调试与工具链](04-Build-Debug-Tools.md)
- 回到 App 主线：[03. App 开发](03-App-Development.md)
- 查看官方精读：[官方文档中文精读总表](../Official-Docs-CN-Full.md)

[返回中文教学导航](README.md) | [上一章：04. 构建、调试与工具链](04-Build-Debug-Tools.md) | [下一章：06. 系统编程](06-System-Programming.md)
