# 03. App 开发

[返回中文教学导航](README.md) | [上一章：02. 协议域](02-Protocol-Domains.md) | [下一章：04. 构建、调试与工具链](04-Build-Debug-Tools.md)

## 本章作用

本章是整个开发主线的真正起点。对于大多数正式开发者来说，最合理的默认路线不是先改系统，也不是先研究第三方固件，而是先从 App 开发进入，理解官方的应用模型、目录结构、构建产物、示例模式和发布思路。

如果你把这一章读透，后面的工具链、JavaScript、系统编程与文件格式都能更自然地接上来。

## 本章建议先读的仓库内文档

- [02. 协议域](02-Protocol-Domains.md)：先知道你的 App 面向哪个能力域。
- [04. 构建、调试与工具链](04-Build-Debug-Tools.md)：补足构建与调试流程。
- [07. 文件格式](07-File-Formats.md)：很多 App 会直接读写平台文件。
- [中文主知识库](../FlipperZero-Master-CN.md)
- [官方文档中文精读总表](../Official-Docs-CN-Full.md)
- [中文 AI 规则包](../FlipperZero-AI-Pack-CN.md)

## 官方核心页面

- [Applications](https://developer.flipper.net/flipperzero/doxygen/applications.html)
- [App Manifests](https://developer.flipper.net/flipperzero/doxygen/app_manifests.html)
- [Apps on SD Card](https://developer.flipper.net/flipperzero/doxygen/apps_on_sd_card.html)
- [App Examples](https://developer.flipper.net/flipperzero/doxygen/app_examples.html)
- [App Publishing](https://developer.flipper.net/flipperzero/doxygen/app_publishing.html)

## 本章要解决的核心问题

- 外部应用与固件内建应用的边界是什么。
- `application.fam` 在整个应用架构里扮演什么角色。
- `.fap` 是什么，它与应用安装、分发和运行有什么关系。
- 如何正确使用官方示例，而不是把示例只当成“能运行的代码片段”。

## 必须掌握的概念

### 1. 外部应用优先

对于多数学习者和多数业务需求，外部应用是合理起点。它能帮助你在不破坏平台整体结构的情况下完成功能开发、测试和迭代。

### 2. `application.fam`

[App Manifests](https://developer.flipper.net/flipperzero/doxygen/app_manifests.html) 这一页非常关键。`application.fam` 不是可有可无的附属文件，而是应用元信息、构建参与方式和运行集成方式的重要描述层。

### 3. `.fap`

[Apps on SD Card](https://developer.flipper.net/flipperzero/doxygen/apps_on_sd_card.html) 对理解 `.fap` 很重要。你应当把 `.fap` 看成分发和运行层的重要对象，而不是单纯的“编译产物文件”。

### 4. 官方示例的模式价值

[App Examples](https://developer.flipper.net/flipperzero/doxygen/app_examples.html) 的价值不只是“拿来抄一段代码”，而是让你观察：

- 项目目录如何组织
- 应用生命周期如何安排
- 视图、事件、资源、数据如何连接
- 哪些写法是平台期望的模式

### 5. 发布视角

很多人只会写本地能跑的程序，但不会思考发布和分发。阅读 [App Publishing](https://developer.flipper.net/flipperzero/doxygen/app_publishing.html) 可以帮助你把项目从“个人实验代码”提升到“可交付应用”。

## 建议阅读顺序

1. 先读 [Applications](https://developer.flipper.net/flipperzero/doxygen/applications.html)，建立整体开发入口认识。
2. 再读 [App Manifests](https://developer.flipper.net/flipperzero/doxygen/app_manifests.html)，理解 `application.fam`。
3. 接着读 [Apps on SD Card](https://developer.flipper.net/flipperzero/doxygen/apps_on_sd_card.html)，理解 `.fap` 和运行位置。
4. 然后读 [App Examples](https://developer.flipper.net/flipperzero/doxygen/app_examples.html)，把示例当成模式库。
5. 最后读 [App Publishing](https://developer.flipper.net/flipperzero/doxygen/app_publishing.html)，补足交付视角。

## 与后续章节的关系

- [04. 构建、调试与工具链](04-Build-Debug-Tools.md) 会告诉你如何把这些应用真正构建出来并调试。
- [05. JavaScript](05-JavaScript.md) 会告诉你轻量脚本路线与 C/C++ 应用路线的边界。
- [06. 系统编程](06-System-Programming.md) 会告诉你何时需要越过应用层进入系统层。
- [07. 文件格式](07-File-Formats.md) 会告诉你应用与平台文件之间的接口边界。

## 学完本章后应具备的能力

- 理解 Flipper Zero 官方推荐的默认开发主线。
- 能解释 `application.fam`、`.fap`、示例和发布流程的关系。
- 能把官方示例当成结构模式库，而不是零散片段。
- 能判断一个需求是停留在 App 层，还是已经需要进入系统层。

## 继续阅读

- 下一章：[04. 构建、调试与工具链](04-Build-Debug-Tools.md)
- 回到上一章：[02. 协议域](02-Protocol-Domains.md)
- 查看官方精读：[官方文档中文精读总表](../Official-Docs-CN-Full.md)
- 查看 AI 约束层：[中文 AI 规则包](../FlipperZero-AI-Pack-CN.md)

[返回中文教学导航](README.md) | [上一章：02. 协议域](02-Protocol-Domains.md) | [下一章：04. 构建、调试与工具链](04-Build-Debug-Tools.md)
