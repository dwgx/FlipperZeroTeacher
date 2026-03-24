# FlipperZero 教学知识库

这是一个以中文为默认入口的 Flipper Zero 双语教学型知识库。它的目标不是简单罗列资料，而是提供一套适合 GitHub 阅读、适合长期维护、适合人类学习、也适合 AI 检索的结构化体系。

英文入口见：[EN/README.md](EN/README.md)

## 1. 这个仓库适合谁

- 想从零开始系统学习 Flipper Zero 的读者
- 已经会基本使用设备、准备进入开发阶段的读者
- 需要整理官方资料、社区资料和工程实践的人
- 希望把内容直接用于 AI 检索、RAG 或模型训练的人

## 2. 推荐起点

如果你只看一个入口，请先点这里：

- [中文教学导航](CN/Guide/README.md)
  作用：按顺序进入课程式结构

如果你想先看总览：

- [中文主知识库](CN/FlipperZero-Master-CN.md)
  作用：快速了解全局框架

如果你想以官方资料为主线：

- [官方文档中文精读总表](CN/Official-Docs-CN-Full.md)
  作用：按官方资料骨架深入学习

如果你要给 AI 使用：

- [中文 AI 规则包](CN/FlipperZero-AI-Pack-CN.md)
  作用：作为检索与回答规则的稳定基线

如果你想了解当前整理到了什么程度：

- [官方文档覆盖表](Official-Docs-Coverage.md)
  作用：查看已覆盖内容与未完成部分

## 3. 中文默认学习路线

建议按下面顺序阅读：

1. [00. 学习总图](CN/Guide/00-Study-Map.md)
   目标：建立整体顺序和学习边界

2. [01. 设备与生态](CN/Guide/01-Device-Ecosystem.md)
   目标：先理解设备界面、桌面端、移动端、CLI 和 Apps

3. [02. 协议域](CN/Guide/02-Protocol-Domains.md)
   目标：学会按能力域组织知识，而不是按零散场景组织

4. [03. App 开发](CN/Guide/03-App-Development.md)
   目标：掌握默认开发主线：`FAP / FAM / App Examples / Publishing`

5. [04. 构建、调试与工具链](CN/Guide/04-Build-Debug-Tools.md)
   目标：理解 `FBT`、`uFBT`、VS Code、Dev Board、OTA

6. [05. JavaScript](CN/Guide/05-JavaScript.md)
   目标：理解 Flipper Zero 的脚本开发路线及其边界

7. [06. 系统编程](CN/Guide/06-System-Programming.md)
   目标：从应用层进入平台层和系统层

8. [07. 文件格式](CN/Guide/07-File-Formats.md)
   目标：把文件格式视为平台能力的一部分

9. [08. 社区参考](CN/Guide/08-Community-Reference.md)
   目标：在不偏离官方基线的前提下使用高信号社区资料

## 4. 核心文件说明

- [CN/README.md](CN/README.md)
  中文目录入口

- [CN/Guide/README.md](CN/Guide/README.md)
  中文章节树入口

- [CN/FlipperZero-Master-CN.md](CN/FlipperZero-Master-CN.md)
  中文主线知识库，适合先建立全局认识

- [CN/Official-Docs-CN-Full.md](CN/Official-Docs-CN-Full.md)
  官方资料中文深度整理，适合作为长期参考底稿

- [CN/FlipperZero-AI-Pack-CN.md](CN/FlipperZero-AI-Pack-CN.md)
  中文 AI 规则包，适合检索、RAG 和回答约束

- [EN/README.md](EN/README.md)
  英文入口

- [Official-Docs-Coverage.md](Official-Docs-Coverage.md)
  官方资料覆盖情况说明

## 5. 仓库结构

```text
FlipperZero-Final/
├── README.md
├── Official-Docs-Coverage.md
├── All-Markdown-Manifest.md
├── CN/
│   ├── README.md
│   ├── Guide/
│   ├── FlipperZero-Master-CN.md
│   ├── Official-Docs-CN-Full.md
│   └── FlipperZero-AI-Pack-CN.md
├── EN/
│   ├── README.md
│   ├── Guide/
│   ├── FlipperZero-Master-EN.md
│   ├── Official-Docs-EN-Full.md
│   └── FlipperZero-AI-Pack-EN.md
├── Original-Notes/
└── Legacy/
```

## 6. 使用原则

- 默认优先阅读中文主线
- 默认优先采用官方资料作为基线
- 社区资料只用于补充，不替代官方定义
- `Guide/` 用于顺序学习
- `Master` 用于总览
- `Official Docs Full` 用于深入整理
- `AI Pack` 用于 AI 检索与规则控制

## 7. 英文入口

如果你需要英文版本，请从以下页面进入：

- [English entry](EN/README.md)
- [English learning tree](EN/Guide/README.md)
- [English master guide](EN/FlipperZero-Master-EN.md)
- [English official docs guide](EN/Official-Docs-EN-Full.md)
- [English AI pack](EN/FlipperZero-AI-Pack-EN.md)
