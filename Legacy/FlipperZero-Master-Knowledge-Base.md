# Flipper Zero Master Knowledge Base

> Legacy mixed reference file.
> Preferred current entry: `CN/FlipperZero-Master-CN.md`, `EN/FlipperZero-Master-EN.md`, `CN/Official-Docs-CN-Full.md`, `EN/Official-Docs-EN-Full.md`.

这是整理后的主知识库总文件。

---

# Flipper Zero Human All-In-One

这是 Human 版所有核心 Markdown 的合并文件。

## Included Files
- 00-start-here.md
- 01-what-flipper-really-is.md
- 02-official-sources.md
- 03-development-path.md
- 04-fap-first.md
- 05-js-and-cli.md
- 06-core-protocols-a.md
- 07-core-protocols-b.md
- 08-hardware-expansion.md
- 09-community-best.md
- 10-debugging-order.md
- 11-ai-feeding-guide.md
- 12-90-day-roadmap.md
- 13-verified-sources-2026-03-24.md
- 14-desktop-md-summary.md
- 15-official-menu-and-ecosystem-map.md
- 16-small-but-valuable-resources.md
- 17-advanced-dev-shortlist.md
- 18-trust-levels.md
- 14-official-menu-and-ecosystem.md
- 15-file-formats-and-data-thinking.md
- 15-deep-cuts-and-small-community.md
- 16-small-community-high-value-finds.md

---

# FILE: 00-start-here.md

# Start Here

这套不是“大而散”的资料库，而是：

- 最短主线
- 最硬精华
- 可给人读
- 也可给 AI 学

你真正要的不是“更多”，而是：

- 顺序对
- 重点对
- 来源对
- 以后能复用

一句总原则：

- `先官方，后社区；先外部应用，后固件；先协议理解，后高阶玩法。`


---

# FILE: 01-what-flipper-really-is.md

# What Flipper Really Is

Flipper Zero 最准确的定位不是“神奇黑客棒子”，而是：

- 便携式多接口实验平台
- 物理世界协议学习器
- 可编程小终端
- 可与外设协作的前端设备

它最擅长：

- 学协议
- 采样与保存数据
- 做小工具
- 做外设前端

它最不擅长：

- 一键打穿现代强加密系统
- 在你完全不懂协议时自动通杀

真正的高手视角是：

- 先问协议域
- 再问这是本体能力、外设能力、还是社区扩展能力


---

# FILE: 02-official-sources.md

# Official Sources

你以后所有开发与判断，优先只看这些：

## Core

- Development home: `https://docs.flipper.net/zero/development`
- Doxygen: `https://developer.flipper.net/flipperzero/doxygen/`
- Firmware repo: `https://github.com/flipperdevices/flipperzero-firmware`

## App Development

- Applications: `https://developer.flipper.net/flipperzero/doxygen/applications.html`
- App Examples: `https://developer.flipper.net/flipperzero/doxygen/app_examples.html`
- App Manifests: `https://developer.flipper.net/flipperzero/doxygen/app_manifests.html`
- Apps on SD Card: `https://developer.flipper.net/flipperzero/doxygen/apps_on_sd_card.html`

## Build Tools

- FBT: `https://developer.flipper.net/flipperzero/doxygen/fbt.html`
- uFBT: `https://github.com/flipperdevices/flipperzero-ufbt`

## JS / CLI / Specs

- JS: `https://developer.flipper.net/flipperzero/doxygen/js.html`
- JS engine: `https://developer.flipper.net/flipperzero/doxygen/js_about_js_engine.html`
- CLI: `https://docs.flipper.net/zero/development/cli`
- Tech specs: `https://docs.flipper.net/zero/development/hardware/tech-specs`

## Ecosystem

- qFlipper: `https://docs.flipper.net/qflipper`
- Mobile app: `https://docs.flipper.net/mobile-app`
- Apps Catalog: `https://docs.flipper.net/apps/apps-catalog`
- App Publishing: `https://developer.flipper.net/flipperzero/doxygen/app_publishing.html`
- Application Catalog repo: `https://github.com/flipperdevices/flipper-application-catalog`
- good-faps: `https://github.com/flipperdevices/flipperzero-good-faps`

一句话：

- `官方资料不是参考之一，而是第一基线。`


---

# FILE: 03-development-path.md

# Development Path

Flipper 开发只分四条主路：

1. External App / FAP
2. Firmware Development
3. JavaScript
4. Hardware Expansion

对绝大多数人来说，正确顺序是：

1. FAP
2. JS
3. Hardware Expansion
4. Firmware

最容易犯的错：

- 一上来就钻整机固件
- 一上来就刷社区固件
- 还不会 FAP 就想做复杂系统

一句结论：

- `先问：我能不能把它做成外部应用？`


---

# FILE: 04-fap-first.md

# FAP First

## 为什么 FAP 是主线

因为大多数真正要做的功能，都可以先做成外部应用。

## 你必须懂的三个词

- Applications
- FAM (`application.fam`)
- FAP (`.fap`)

## 你必须懂的两个工具

- uFBT：单 App 开发首选  
  `https://github.com/flipperdevices/flipperzero-ufbt`
- FBT：整机与系统级开发  
  `https://developer.flipper.net/flipperzero/doxygen/fbt.html`

## 最短学习顺序

1. 看 Applications
2. 看 App Examples
3. 看 App Manifests
4. 跑 uFBT 最小项目
5. 看 good-faps

## 最常见的坑

- 不理解 `application.fam`
- 资源路径乱
- 不看当前官方 example

一句结论：

- `FAP 的重点不是“编过”，而是“结构、资源、安装、兼容都成立”。`


---

# FILE: 05-js-and-cli.md

# JS and CLI

## JS

Flipper 的 JS 是：

- 轻量脚本能力
- 基于 `mJS`

不是：

- 浏览器 JS
- Node.js

官方入口：

- `https://developer.flipper.net/flipperzero/doxygen/js.html`
- `https://developer.flipper.net/flipperzero/doxygen/js_about_js_engine.html`

适合：

- 自动化
- 小工具
- 快速原型

## CLI

官方入口：

- `https://docs.flipper.net/zero/development/cli`

CLI 的价值：

- 开发排错
- 检查设备状态
- 不只靠 UI

一句结论：

- `JS 是轻开发工具，CLI 是调试武器。`


---

# FILE: 06-core-protocols-a.md

# Core Protocols A

这一张只讲：

- Sub‑GHz
- NFC
- RFID
- iButton

## Sub‑GHz

重点不是“能不能重放”，而是：

- 频率
- 编码
- 固定码 vs 滚动码
- 地区限制

## NFC

重点不是“能不能复制卡”，而是：

- 卡族
- 数据结构
- 支持边界

官方入口：

- `https://docs.flipper.net/nfc`
- `https://docs.flipper.net/zero/nfc/mfkey32`

## RFID

你必须牢记：

- 低频 RFID 不是 NFC

## iButton

你必须牢记：

- 它是接触式体系
- 它和射频卡不是一回事

一句结论：

- `任何协议问题，先分域，再谈玩法。`


---

# FILE: 07-core-protocols-b.md

# Core Protocols B

这一张只讲：

- IR
- BadUSB
- BLE
- GPIO
- U2F

## IR

最适合新手建立手感：

- 风险低
- 数据库成熟
- 反馈直观

高价值资源：

- `https://github.com/UberGuidoZ/Flipper-IRDB`

## BadUSB

最重要认知：

- 本质是 HID 自动化
- 风险在脚本来源与使用场景

## BLE

最重要认知：

- 官方能力和社区固件扩展一定分开写

## GPIO

这是从“会玩”到“会做项目”的门槛。

至少要懂：

- 电压
- 接口
- 接线

## U2F

它提醒你：

- Flipper 也是身份安全设备生态的一部分


---

# FILE: 08-hardware-expansion.md

# Hardware Expansion

正确理解扩展板：

- Flipper = 前端
- 外设 = 协处理器 / 扩展模块

## 必看路线

- Official Wi‑Fi Developer Board
- ESP32 Marauder
- ESP32-S2 / S3 / C5
- CC1101
- GPS

## 你真正该学的

- 供电
- 接线
- 串口 / 总线通信
- 固件维护
- 分层设计

一句结论：

- `不会分层的人，板卡越多越乱；会分层的人，Flipper 才越来越强。`


---

# FILE: 09-community-best.md

# Community Best

社区只看这些核心入口：

## 1. UberGuidoZ

- `https://github.com/UberGuidoZ/Flipper`
- `https://github.com/UberGuidoZ/Flipper-IRDB`

价值：

- 资源总仓
- 数据库入口

## 2. Jamison Derek

- `https://github.com/jamisonderek/flipper-zero-tutorials/wiki`

价值：

- 开发与调试教程很实用

## 3. awesome-flipperzero

- `https://github.com/djsime1/awesome-flipperzero`

价值：

- 最好的继续发散索引

## 4. Community Firmware

- Unleashed: `https://github.com/DarkFlippers/unleashed-firmware`
- Momentum: `https://github.com/Next-Flip/Momentum-Firmware`

原则：

- 值得研究
- 不能替代官方基线


---

# FILE: 10-debugging-order.md

# Debugging Order

所有问题按这 6 层查：

1. 文档层
2. 路线层
3. 工具链层
4. 资源层
5. 兼容层
6. 硬件层

## 文档层

- 先问：我查的是不是官方当前资料

## 路线层

- 先问：这是 FAP、Firmware、JS，还是 Hardware 问题

## 工具链层

- 先问：该用 uFBT 还是 FBT

## 资源层

- 先问：是不是图标、资源、数据路径问题

## 兼容层

- 先问：是不是误用了社区专有能力

## 硬件层

- 先问：供电、接线、接口对不对

一句结论：

- `排错最值钱的是顺序，不是乱搜。`


---

# FILE: 11-ai-feeding-guide.md

# AI Feeding Guide

你以后要给 AI 学，最重要的是让它：

- 先分类
- 再引用
- 再实现

## 推荐短提示词

```text
You are a Flipper Zero development assistant.
Use official docs and flipperdevices GitHub first.
Classify the task as FAP, firmware, JS, or hardware expansion before answering.
If the official docs do not confirm something, do not invent APIs, fields, paths, or structures.
```

## 推荐长提示词

```text
Use these sources first:
- https://docs.flipper.net/zero/development
- https://developer.flipper.net/flipperzero/doxygen/
- https://github.com/flipperdevices/flipperzero-firmware
- https://github.com/flipperdevices/flipperzero-ufbt

Before answering, classify the task as:
1. external app / FAP
2. firmware development
3. JavaScript
4. hardware expansion

Clearly separate:
- official facts
- community experience
- needs local verification

If the official docs do not explicitly define it, do not invent it.
```

## AI 最常犯的错

- 把社区固件能力当官方能力
- 把 JS 当 Node.js
- 编造 `application.fam` 字段


---

# FILE: 12-90-day-roadmap.md

# 90 Day Roadmap

## Week 1

目标：

- 不再神化 Flipper
- 分清能力域

读：

- `01`
- `02`
- `03`

## Week 2

目标：

- 建立 FAP 主线

读：

- `04`

## Week 3

目标：

- 学会 JS 与 CLI 的边界

读：

- `05`

## Week 4-5

目标：

- 建立协议骨架

读：

- `06`
- `07`

## Week 6-7

目标：

- 建立扩展板分层思维

读：

- `08`

## Week 8-9

目标：

- 建立资源筛选能力

读：

- `09`

## Week 10-12

目标：

- 能按正确顺序开发、排错、喂 AI

读：

- `10`
- `11`


---

# FILE: 13-verified-sources-2026-03-24.md

# Verified Sources 2026-03-24

这是本次联网后重新确认的一组高价值来源，适合作为今后的长期基线。

## Official

- Development home: `https://docs.flipper.net/zero/development`
- Doxygen home: `https://developer.flipper.net/flipperzero/doxygen/`
- Applications: `https://developer.flipper.net/flipperzero/doxygen/applications.html`
- App Manifests: `https://developer.flipper.net/flipperzero/doxygen/app_manifests.html`
- Apps on SD Card: `https://developer.flipper.net/flipperzero/doxygen/apps_on_sd_card.html`
- App Examples: `https://developer.flipper.net/flipperzero/doxygen/app_examples.html`
- FBT: `https://developer.flipper.net/flipperzero/doxygen/fbt.html`
- JS docs: `https://developer.flipper.net/flipperzero/doxygen/js.html`
- JS engine: `https://developer.flipper.net/flipperzero/doxygen/js_about_js_engine.html`
- App Publishing: `https://developer.flipper.net/flipperzero/doxygen/app_publishing.html`
- CLI: `https://docs.flipper.net/zero/development/cli`
- Tech specs: `https://docs.flipper.net/zero/development/hardware/tech-specs`
- GPIO and modules: `https://docs.flipper.net/gpio-and-modules`
- NFC: `https://docs.flipper.net/nfc`
- U2F: `https://docs.flipper.net/zero/u2f`
- qFlipper: `https://docs.flipper.net/qflipper`
- Mobile app: `https://docs.flipper.net/mobile-app`
- Apps Catalog: `https://docs.flipper.net/apps/apps-catalog`
- Firmware repo: `https://github.com/flipperdevices/flipperzero-firmware`
- uFBT repo: `https://github.com/flipperdevices/flipperzero-ufbt`
- qFlipper repo: `https://github.com/flipperdevices/qFlipper`
- Application Catalog repo: `https://github.com/flipperdevices/flipper-application-catalog`
- good-faps repo: `https://github.com/flipperdevices/flipperzero-good-faps`

## Community

- UberGuidoZ Flipper: `https://github.com/UberGuidoZ/Flipper`
- UberGuidoZ IRDB: `https://github.com/UberGuidoZ/Flipper-IRDB`
- Jamison Derek tutorials: `https://github.com/jamisonderek/flipper-zero-tutorials/wiki`
- awesome-flipperzero: `https://github.com/djsime1/awesome-flipperzero`
- Unleashed: `https://github.com/DarkFlippers/unleashed-firmware`
- Momentum: `https://github.com/Next-Flip/Momentum-Firmware`

## Latest Summary

本次联网后仍然成立的核心判断：

1. 官方开发主线仍然是 `docs + Doxygen + flipperdevices GitHub`
2. 外部应用仍然是最重要的默认开发路线
3. `uFBT` 仍然是单 App 开发的高价值入口
4. `Apps Catalog`、`qFlipper`、`good-faps` 仍然是容易被忽略但很关键的生态层资料
5. 社区最值得长期跟的仍然是：UberGuidoZ、Jamison Derek、awesome-flipperzero，以及主流社区固件仓库


---

# FILE: 14-desktop-md-summary.md

# Desktop MD Summary

你桌面原始 4 份核心资料，我现在用一句话重新归纳：

## `Flipper Zero.md`

价值最高的点：

- 它最像“开发者启动页”
- 它提醒你：先看官方开发资料，先区分 FAP / Firmware / JS

## `Flipper Zero 与 ESP32-S3 深度玩法及社区知识库.md`

价值最高的点：

- 它像“生态全景图”
- 覆盖了社区固件、硬件扩展、资源仓库、人物与思路

## `Flipper Zero 与 ESP32‑S3 开发板深度融合与玩法指南.md`

价值最高的点：

- 它把 Flipper + ESP32-S3 讲成了“前端 + 协处理器”路线

## `Flipper Zero 与 ESP32‑S3 开发板：深度扩展与知识库.md`

价值最高的点：

- 它更偏“进阶资源索引 + 扩展思路”

## 最终结论

这 4 份文档并不是没用，而是：

- 适合做原始资料池
- 不适合直接当最终主线教材

所以我已经把它们的价值拆成：

- Human 主线
- AI 学习版
- 大型资料仓库


---

# FILE: 15-official-menu-and-ecosystem-map.md

# Official Menu and Ecosystem Map

这张只讲官方生态里最容易被忽略的“菜单与入口层”。

## Device-Side Thinking

你可以把 Flipper 本体理解成这些能力分区：

- 协议与无线能力
- 工具与应用
- GPIO / 模块
- 数据与文件
- 调试与 CLI

## PC / Desktop Side

官方桌面生态最重要的是：

- qFlipper  
  `https://docs.flipper.net/qflipper`

它不只是升级器，也是：

- 文件传输入口
- 设备管理入口
- 桌面工作流入口

## Mobile Side

- Mobile app  
  `https://docs.flipper.net/mobile-app`

你要把它理解成：

- 设备生态的一部分
- 而不是“可有可无的小配件”

## App Distribution Side

- Apps Catalog  
  `https://docs.flipper.net/apps/apps-catalog`

- Application Catalog repo  
  `https://github.com/flipperdevices/flipper-application-catalog`

这是官方分发生态的一部分。

## Developer-Side

你需要记住的官方开发入口层：

- Doxygen
- FBT / uFBT
- App Examples
- App Publishing
- CLI

## 一句结论

- `真正的 Flipper 生态，不是只有设备本体，而是设备 + 桌面 + 移动端 + App 分发 + 开发工具链。`


---

# FILE: 16-small-but-valuable-resources.md

# Small but Valuable Resources

这一张专门收“不是最大名气，但很有价值”的资源。

## 1. Flipper Zero Sample Application

来源：

- `https://github.com/flipperdevices`

价值：

- 官方组织页显示有 `Flipper Zero Sample Application`
- 这类“Catalog-ready sample”对以后做规范项目很值钱

## 2. flipperzero-ufbt-action

来源：

- `https://github.com/flipperdevices/flipperzero-ufbt-action`

价值：

- 说明官方已经把 `uFBT + CI/CD` 这条路明确定义出来了
- 对高级开发者很重要

## 3. 0xchocolate/flipperzero-esp-flasher

来源：

- `https://github.com/0xchocolate/flipperzero-esp-flasher`

价值：

- 它把“从 Flipper 设备端直接刷 ESP 芯片”这条工作流做得很清楚
- 对扩展板路线非常有价值

## 4. ezod/flipperzero-gps

来源：

- `https://github.com/ezod/flipperzero-gps`

价值：

- 很适合拿来理解 `GPIO / 串口 / GPS / NMEA` 这条线

## 5. bmatcuk/flipperzero-qrcode

来源：

- `https://github.com/bmatcuk/flipperzero-qrcode`

价值：

- 虽然不大，但它说明了：
  - `.fap` 安装
  - 资源组织
  - 设备端文件使用

## 6. 一句结论

- `真正的边角精华，不一定是“最火的仓库”，而是“能帮你补掉一个真实能力缺口的仓库”。`


---

# FILE: 17-advanced-dev-shortlist.md

# Advanced Dev Shortlist

这一张只给已经准备往“开发者/高手”走的人。

## 最值得长期盯住的高级开发点

### 1. uFBT 的进阶能力

- `ufbt create`
- `ufbt launch`
- `ufbt cli`
- `ufbt vscode_dist`
- `.env` / `UFBT_HOME` / 本地 SDK 管理

高价值来源：

- `https://github.com/flipperdevices/flipperzero-ufbt`

### 2. uFBT GitHub Action

- `https://github.com/flipperdevices/flipperzero-ufbt-action`

它的价值是：

- 让 Flipper App 开发进入现代 CI/CD 工作流

### 3. qFlipper 的 CLI 与结构

- `https://github.com/flipperdevices/qFlipper`

高级开发者会注意：

- `application`
- `cli`
- `backend`
- `plugins`
- `dfu`

### 4. good-faps 里的真实项目结构

- `https://github.com/flipperdevices/flipperzero-good-faps`

高级开发者会关注：

- 项目如何组织
- 如何说明边界
- 如何贴近 Catalog

### 5. Application Catalog 的文档目录

- `https://github.com/flipperdevices/flipper-application-catalog`

高级开发者会关注：

- `documentation`
- `tools`
- `applications`

## 一句结论

- `高手不是知道更多玩法，而是更早把 Flipper 放进“正规开发工作流”里。`


---

# FILE: 18-trust-levels.md

# Trust Levels

以后你自己整理资料，统一按这个可信度分：

## High

- 官方文档
- 官方 Doxygen
- flipperdevices 官方仓库

## Medium

- UberGuidoZ
- Jamison Derek
- awesome-flipperzero
- 长期维护的核心社区仓库

## Low

- 单篇博客
- 技术媒体二次整理
- 演示视频
- 无源码营销页

## 一句结论

- `你以后不是缺资料，而是缺筛选能力。`


---

# FILE: 14-official-menu-and-ecosystem.md

# Official Menu and Ecosystem

这一张是这轮联网后新增的重点。

## 1. 为什么值得单列

很多资料只讲功能，不讲“用户实际从哪里进入这些功能”。

官方 `Desktop` 页面其实就是菜单地图：

- `https://docs.flipper.net/basics/desktop`

## 2. 官方菜单真实分区

根据官方页面，主菜单核心包括：

- Sub‑GHz
- 125 kHz RFID
- NFC
- Infrared
- GPIO & Modules
- iButton
- Bad USB
- U2F
- Apps
- Settings

## 3. 你容易忽略的三个生态层

### qFlipper

- `https://docs.flipper.net/qflipper`
- `https://github.com/flipperdevices/qFlipper`

它不只是升级器，也是桌面管理入口。

### Mobile App

- `https://docs.flipper.net/mobile-app`

它不只是手机配套 App，也是：

- BLE 更新入口
- Archive / Apps / Tools 入口
- 备份、日志、Bug Report 入口

### Apps Catalog

- `https://docs.flipper.net/apps/apps-catalog`
- `https://github.com/flipperdevices/flipper-application-catalog`

它说明 Flipper 已经形成了应用分发层。

## 4. 一句结论

- `真正理解 Flipper，不只要懂功能，还要懂设备、桌面、移动端、分发层如何组成一个生态。`


---

# FILE: 15-file-formats-and-data-thinking.md

# File Formats and Data Thinking

这张是高手与新手差别很大的一张。

## 1. 为什么文件格式这么重要

Flipper Zero 不是单纯“点菜单”的设备，它是：

- 存数据
- 读数据
- 写数据
- 复用数据
- 分享数据

所以文件格式不是附属细节，而是平台能力的一部分。

## 2. 官方文件格式总入口

- `https://developer.flipper.net/flipperzero/doxygen/file_formats.html`

这个页面非常重要，因为它把官方支持的多种数据文件集中列出来了。

## 3. 官方明确存在的格式方向

从官方 File Formats 页面可确认的高价值方向包括：

- BadUSB File Format
- iButton key file format
- Infrared Flipper File Formats
- LF RFID key file format
- NFC Flipper File Formats
- SubGhz Subsystem File Formats
- Heatshrink-compressed Tarball Format

## 4. 这说明什么

说明 Flipper 真正的核心能力之一是：

- `把现实世界协议和对象，转成可保存、可加载、可复用的文件`

## 5. 三个最值得开发者关注的例子

### NFC

官方页面：

- `https://developer.flipper.net/flipperzero/doxygen/nfc_file_format.html`

能看到的高价值事实：

- NFC 文件不只是 UID
- 不同设备类型会带不同字段
- 版本差异会影响理解方式

### Infrared

官方页面：

- `https://developer.flipper.net/flipperzero/doxygen/infrared_file_format.html`

高价值事实：

- `.ir` 不只是“一个红外码”
- 还涉及 universal remote library 等结构

### Sub‑GHz

官方页面：

- `https://developer.flipper.net/flipperzero/doxygen/subghz_file_format.html`

高价值事实：

- `.sub` 可以是协议化 key data
- 也可以是 RAW timing data

## 6. 这对学习路线意味着什么

真正想成为高手，必须从“会点菜单”升级为：

- 会看数据
- 会理解样本
- 会判断文件格式的意义

## 7. 这对 AI 也很关键

AI 最容易忽略的是：

- 它会给你写功能，却不提醒你文件层怎么组织

所以以后给 AI 喂资料时，文件格式页必须纳入长期上下文。

## 8. 一句结论

- `理解文件格式，是从玩家变成平台级使用者的关键一步。`


---

# FILE: 15-deep-cuts-and-small-community.md

# Deep Cuts and Small Community Findings

这张只讲“容易被忽略但很值钱”的东西。

## 1. 官方冷门高价值点

### Tech Specs

- `https://docs.flipper.net/zero/development/hardware/tech-specs`

价值：

- 这是硬件边界的真基线

### Schematics

- `https://docs.flipper.net/development/hardware/schematic`

价值：

- 对低层理解和外设开发很有帮助

### External Modules Blueprints

- `https://docs.flipper.net/development/hardware/modules-blueprints`

价值：

- 对做模块外壳、结构、外设配合很值钱

### ST-Link V3 Dev Board

- `https://docs.flipper.net/development/hardware/devboard-stlinkv3`

价值：

- 说明官方认真支持高级开发和板级调试

## 2. 小社区但很有用的资源

### DroomOne Plugin Tutorial

- `https://github.com/DroomOne/Flipper-Plugin-Tutorial`

价值：

- 适合看“最小插件骨架”

### ESP Flasher

- `https://github.com/0xchocolate/flipperzero-esp-flasher`

价值：

- 适合理解 Flipper 端烧录 ESP 外设的工作流

### FlipperHTTP

- `https://github.com/jblanked/FlipperHTTP`

价值：

- 对理解 Flipper 作为网络前端控制台有启发

## 3. 一句结论

- `真正的边角精华，不是猎奇玩法，而是低层资料、工作流工具和真实排错经验。`


---

# FILE: 16-small-community-high-value-finds.md

# Small Community High Value Finds

这张不收垃圾，只收 **小而值钱** 的东西。

## 1. DroomOne Plugin Tutorial

- `https://github.com/DroomOne/Flipper-Plugin-Tutorial`

为什么值钱：

- 很适合最小插件入门
- 比很多空泛教程更直接

## 2. ESP Flasher

- `https://github.com/0xchocolate/flipperzero-esp-flasher`

为什么值钱：

- 对扩展板路线很关键
- 它把“烧录外设芯片”这件事直接带回 Flipper 工作流里

## 3. Flipper File Toolbox

- `https://github.com/evilpete/flipper_toolbox`

为什么值钱：

- 它提醒你：Flipper 生态里真正高价值的能力之一是“数据文件与格式处理”
- 对文件格式研究很有启发

注意：

- 它更适合当研究工具和格式线索，不适合当官方标准

## 4. FlipperHTTP

- `https://github.com/jblanked/FlipperHTTP`

为什么值钱：

- 代表了 “Flipper + 外设 + HTTP/网络交互” 这条冷门但很有潜力的方向

## 5. flipwire

- `https://github.com/liamhays/flipwire`

为什么值钱：

- 它代表 “通过 Bluetooth 从电脑控制 Flipper” 这种生态层思路
- 对理解“设备不是孤岛”很有帮助

## 6. Wi‑Fi Developer Board 深层文档

除了硬件页本身，下面几页也非常值钱：

- Dev Board main page: `https://developer.flipper.net/flipperzero/doxygen/dev_board.html`
- Get started: `https://developer.flipper.net/flipperzero/doxygen/dev_board_get_started.html`
- Debugging: `https://developer.flipper.net/flipperzero/doxygen/dev_board_debugging_guide.html`
- Reading logs: `https://developer.flipper.net/flipperzero/doxygen/dev_board_reading_logs.html`
- Firmware update: `https://developer.flipper.net/flipperzero/doxygen/dev_board_fw_update.html`

为什么值钱：

- 它们把“开发板”从硬件配件，变成真正的调试与开发工具链

## 7. 一句结论

- `真正值钱的小社区发现，往往不是花哨功能，而是模板、工具链、文件处理、调试入口。`



---

# Appendix: Verified AI Training Pack

# Flipper Zero AI Training Pack

这是给 AI 的单文件训练包，目标是：

- 尽量短
- 尽量稳
- 先保证不胡编
- 同时保持人类也能看懂

## 1. Source Priority

永远优先：

1. `docs.flipper.net`
2. `developer.flipper.net`
3. `github.com/flipperdevices/*`

核心入口：

- `https://docs.flipper.net/zero/development`
- `https://developer.flipper.net/flipperzero/doxygen/`
- `https://github.com/flipperdevices/flipperzero-firmware`
- `https://github.com/flipperdevices/flipperzero-ufbt`

## 2. Route Classifier

所有任务先分到以下四类之一：

1. External App / FAP
2. Firmware Development
3. JavaScript
4. Hardware Expansion

默认优先级：

- 默认先按 FAP 设计
- 只有明确需要系统层改动时才进入 Firmware
- 自动化与轻量任务优先考虑 JS
- Wi‑Fi / 传感器 / AI / 外设协作任务进入 Hardware Expansion

## 3. Core Facts

1. Flipper Zero 官方开发主线是 `docs + Doxygen + flipperdevices GitHub`
2. External App / FAP 是大多数开发任务的默认主线
3. `uFBT` 适合单 App，`FBT` 适合整机开发
4. JS 是轻量脚本，不是完整现代 JS 平台
5. 协议必须分域理解：Sub‑GHz、NFC、RFID、iButton、IR、BadUSB、BLE、GPIO、U2F
6. 社区固件值得研究，但不是官方 API 基线
7. qFlipper、Apps Catalog、good-faps 是很关键的生态层资料

## 4. Safe Answering Rules

1. 如果官方未明确说明，不要编造 API、函数、字段、路径、目录结构
2. 必须区分：
   - 官方事实
   - 社区经验
   - 待验证信息
3. 不要把社区固件能力写成官方能力
4. 不要把 JS 写成 Node.js / 浏览器生态
5. 不要输出未授权攻击步骤

## 5. Human Readable Output Rules

输出时应：

- 先给结论
- 再给来源
- 再给风险与边界
- 语言直白
- 不要只报链接，不解释为什么重要

## 6. Official Menu and Ecosystem Context

根据官方桌面文档与移动端文档，可长期使用的高价值结构包括：

- Desktop status layer
- Main Menu
- Archive
- Device Info
- Quick Access Apps

Main Menu 的关键能力域：

- Sub‑GHz
- RFID
- NFC
- Infrared
- GPIO & Modules
- iButton
- Bad USB
- U2F
- Apps
- Settings

Archive 的价值：

- 它是数据与文件驱动能力的集中入口

## 7. File Formats Context

AI 长期上下文里应明确：

- Flipper Zero 官方开发文档有独立 File Formats 章节  
  `https://developer.flipper.net/flipperzero/doxygen/file_formats.html`
- 文件格式不是附属细节，而是平台能力的一部分

至少应长期记住以下官方格式方向：

- BadUSB
- iButton
- Infrared
- LF RFID
- NFC
- SubGhz

## 8. Community Core

长期值得跟踪的核心社区入口：

- UberGuidoZ Flipper  
  `https://github.com/UberGuidoZ/Flipper`
- UberGuidoZ IRDB  
  `https://github.com/UberGuidoZ/Flipper-IRDB`
- Jamison Derek tutorials  
  `https://github.com/jamisonderek/flipper-zero-tutorials/wiki`
- awesome-flipperzero  
  `https://github.com/djsime1/awesome-flipperzero`

社区固件只能作为增强路线研究：

- `https://github.com/DarkFlippers/unleashed-firmware`
- `https://github.com/Next-Flip/Momentum-Firmware`

## 9. Niche but Useful Links

适合作为补充检索层：

- DroomOne Plugin Tutorial  
  `https://github.com/DroomOne/Flipper-Plugin-Tutorial`
- ESP Flasher  
  `https://github.com/0xchocolate/flipperzero-esp-flasher`
- Flipper File Toolbox  
  `https://github.com/evilpete/flipper_toolbox`
- FlipperHTTP  
  `https://github.com/jblanked/FlipperHTTP`
- flipwire  
  `https://github.com/liamhays/flipwire`
- flipperzero-ufbt-action  
  `https://github.com/flipperdevices/flipperzero-ufbt-action`
- flipperzero-gps  
  `https://github.com/ezod/flipperzero-gps`
- flipperzero-qrcode  
  `https://github.com/bmatcuk/flipperzero-qrcode`

Rule:

- 这些不是官方基线
- 它们适合作为模板、工具链、文件格式、外设路线的补充线索
