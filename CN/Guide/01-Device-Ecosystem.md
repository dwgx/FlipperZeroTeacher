# 01. 设备与生态

[返回中文教学导航](README.md) | [上一章：00. 学习总图](00-Study-Map.md) | [下一章：02. 协议域](02-Protocol-Domains.md)

## 本章作用

本章负责建立 Flipper Zero 的“使用层总工作流”。很多人一上来就只关注某个协议、某个脚本或者某个插件，但真正的长期使用能力，首先来自对设备端、桌面端、移动端、应用商店与命令行入口的整体理解。

读完本章后，你应当能够把设备本身、`qFlipper`、Mobile App、Apps 生态和 CLI 视为同一个平台的不同入口，而不是互相独立的工具。

## 本章建议先读的仓库内文档

- [00. 学习总图](00-Study-Map.md)：确认本章在总路线中的位置。
- [中文主知识库](../FlipperZero-Master-CN.md)：建立设备与平台的整体认识。
- [官方文档中文精读总表](../Official-Docs-CN-Full.md)：在本章之外进一步追官方原始说明。
- [官方文档覆盖表](../../Official-Docs-Coverage.md)：查看桌面端、移动端与 CLI 的覆盖情况。

## 官方核心页面

- [Desktop 基础界面](https://docs.flipper.net/basics/desktop)
- [qFlipper](https://docs.flipper.net/qflipper)
- [Mobile App](https://docs.flipper.net/mobile-app)
- [Apps](https://docs.flipper.net/apps)
- [CLI](https://docs.flipper.net/zero/development/cli)

## 本章要解决的核心问题

- 设备主界面、菜单、Archive、文件管理与 Device Info 的关系是什么。
- 电脑端与手机端各适合做什么，不适合做什么。
- 安装应用、更新固件、备份设备、查看日志这些动作分别从哪里完成。
- 为什么命令行和日志入口对于后续开发十分重要。

## 你需要先建立的五个入口

### 1. 设备本体入口

设备本体是第一入口。你需要知道主菜单、Archive、Settings、Device Info、协议能力入口与 App 列表的关系。后续所有的导入、调试、运行和验证，最终都要回到设备本体确认结果。

### 2. 桌面端入口：qFlipper

[qFlipper](https://docs.flipper.net/qflipper) 是正式日常维护的重要入口。它主要适合以下任务：

- 固件更新
- 文件管理
- 备份与恢复
- 查看设备连接状态
- 在开发与测试过程中快速管理设备内容

如果你以后要长期做资料管理或样例整理，桌面端入口是必须熟悉的。

### 3. 移动端入口：Mobile App

[Mobile App](https://docs.flipper.net/mobile-app) 更适合移动场景、BLE 连接、同步、安装应用和部分更新流程。它不是桌面端的完全替代品，而是另一个日常入口。

### 4. 应用生态入口：Apps

[Apps](https://docs.flipper.net/apps) 与官方应用分发体系有关。你应当知道设备上的应用、外部应用、安装来源和后续开发之间的关系。到了 [03. App 开发](03-App-Development.md) 这一章，你会把它与 `.fap`、`application.fam` 和发布流程连接起来。

### 5. 开发入口：CLI

[CLI](https://docs.flipper.net/zero/development/cli) 是很多初学者容易忽略的入口，但它对日志、调试、系统信息和自动化操作非常关键。后续当你处理构建、运行、排错时，会频繁依赖命令行与日志输出。

## 建议阅读顺序

1. 先读 [Desktop 基础界面](https://docs.flipper.net/basics/desktop)，把设备菜单和常用界面记清楚。
2. 再读 [qFlipper](https://docs.flipper.net/qflipper)，理解电脑端维护入口。
3. 然后读 [Mobile App](https://docs.flipper.net/mobile-app)，理解移动端入口与同步方式。
4. 接着看 [Apps](https://docs.flipper.net/apps)，把应用分发与安装体系纳入整体认识。
5. 最后读 [CLI](https://docs.flipper.net/zero/development/cli)，为后面的开发章节做准备。

## 学完本章后应具备的能力

- 能正确管理设备文件、备份与恢复流程。
- 能区分桌面端与移动端各自的角色。
- 能找到 App 安装入口、日志入口和命令行入口。
- 能把“设备使用”与“开发前准备”连接起来理解。

## 继续阅读

- 下一章：[02. 协议域](02-Protocol-Domains.md)
- 回到课程入口：[中文教学导航](README.md)
- 回到主线总览：[中文主知识库](../FlipperZero-Master-CN.md)
- 回到官方精读：[官方文档中文精读总表](../Official-Docs-CN-Full.md)

[返回中文教学导航](README.md) | [上一章：00. 学习总图](00-Study-Map.md) | [下一章：02. 协议域](02-Protocol-Domains.md)
