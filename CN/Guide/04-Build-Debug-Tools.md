# 04. 构建、调试与工具链

[返回中文教学导航](README.md) | [上一章：03. App 开发](03-App-Development.md) | [下一章：05. JavaScript](05-JavaScript.md)

## 本章作用

本章负责把开发环境真正落地。前一章解决的是“应用模型是什么”，这一章解决的是“怎样把它构建出来、跑起来、调起来、更新起来”。如果没有清晰的工具链心智模型，后续很多问题都会混在一起：构建失败、设备运行失败、资源没打进去、日志看不到、更新路径不对。

本章的目标，是让你把 `FBT`、`uFBT`、VS Code、Dev Board、CLI、OTA 更新这些对象放到统一工作流中理解。

## 本章建议先读的仓库内文档

- [03. App 开发](03-App-Development.md)：先理解你要构建的对象是什么。
- [06. 系统编程](06-System-Programming.md)：后续进入系统层时会更依赖这里的工具链。
- [中文主知识库](../FlipperZero-Master-CN.md)
- [官方文档中文精读总表](../Official-Docs-CN-Full.md)
- [官方文档覆盖表](../../Official-Docs-Coverage.md)

## 官方核心页面

- [Developer Tools](https://developer.flipper.net/flipperzero/doxygen/dev_tools.html)
- [FBT](https://developer.flipper.net/flipperzero/doxygen/fbt.html)
- [VS Code](https://developer.flipper.net/flipperzero/doxygen/vscode.html)
- [Dev Board](https://developer.flipper.net/flipperzero/doxygen/dev_board.html)
- [OTA Updates](https://developer.flipper.net/flipperzero/doxygen/ota_updates.html)
- [CLI](https://docs.flipper.net/zero/development/cli)

## 本章要解决的核心问题

- `FBT` 与 `uFBT` 的边界是什么。
- VS Code 工作区与命令行工作流如何配合。
- Dev Board 在日志、调试、网络与开发连接里扮演什么角色。
- OTA 更新与正式开发构建之间是什么关系。

## 需要先建立的工具链结构

### 1. 构建核心：FBT

[FBT](https://developer.flipper.net/flipperzero/doxygen/fbt.html) 是官方构建链的核心入口。理解它，不只是知道一条命令怎么敲，而是要理解：

- 它如何组织项目构建
- 它怎样产出目标文件
- 它如何参与资源处理
- 它和应用、固件、目标平台之间怎样关联

### 2. 轻量项目路径：uFBT

[Developer Tools](https://developer.flipper.net/flipperzero/doxygen/dev_tools.html) 中会涉及更轻量的开发路径。你应当把 `uFBT` 理解为针对部分开发场景的轻量工作流，而不是完整替代 `FBT` 的所有功能。

### 3. 编辑器集成：VS Code

[VS Code](https://developer.flipper.net/flipperzero/doxygen/vscode.html) 的价值在于把工作区生成、索引、跳转、构建命令与代码阅读结合起来。它不是平台本身的一部分，但能显著提高正式开发效率。

### 4. 调试与连接：Dev Board 与 CLI

[Dev Board](https://developer.flipper.net/flipperzero/doxygen/dev_board.html) 和 [CLI](https://docs.flipper.net/zero/development/cli) 是调试链的重要组成。它们帮助你观察日志、连接设备、进入调试流程，并在出现问题时迅速缩小范围。

### 5. 更新机制：OTA

[OTA Updates](https://developer.flipper.net/flipperzero/doxygen/ota_updates.html) 更偏向正式更新与分发视角。你需要理解它与开发过程之间的关系，但不要把日常本地开发、调试和发布更新混成一个步骤。

## 建议阅读顺序

1. 先读 [Developer Tools](https://developer.flipper.net/flipperzero/doxygen/dev_tools.html)，建立工具总览。
2. 再读 [FBT](https://developer.flipper.net/flipperzero/doxygen/fbt.html)，确认官方构建主线。
3. 接着读 [VS Code](https://developer.flipper.net/flipperzero/doxygen/vscode.html)，建立日常编码工作流。
4. 然后读 [Dev Board](https://developer.flipper.net/flipperzero/doxygen/dev_board.html) 与 [CLI](https://docs.flipper.net/zero/development/cli)，补足调试入口。
5. 最后读 [OTA Updates](https://developer.flipper.net/flipperzero/doxygen/ota_updates.html)，理解更新与交付路径。

## 学完本章后应具备的能力

- 能解释 `FBT`、`uFBT`、VS Code、Dev Board、CLI 和 OTA 各自的职责。
- 能建立一个正式、稳定的开发与调试环境。
- 知道排查构建问题、运行问题和连接问题时应该先查哪里。
- 能把“本地开发”与“正式更新分发”区分开来。

## 继续阅读

- 下一章：[05. JavaScript](05-JavaScript.md)
- 回到上一章：[03. App 开发](03-App-Development.md)
- 查看系统层入口：[06. 系统编程](06-System-Programming.md)
- 查看官方精读：[官方文档中文精读总表](../Official-Docs-CN-Full.md)

[返回中文教学导航](README.md) | [上一章：03. App 开发](03-App-Development.md) | [下一章：05. JavaScript](05-JavaScript.md)
