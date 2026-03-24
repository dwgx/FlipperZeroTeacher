# Flipper Zero AI All-In-One

> Legacy mixed reference file.
> Preferred current entry: `CN/FlipperZero-AI-Pack-CN.md`, `EN/FlipperZero-AI-Pack-EN.md`.

这是 AI 版所有核心 Markdown 的合并文件。

## Included Files
- 00-how-to-use.md
- 01-source-priority.md
- 02-route-classifier.md
- 03-core-facts.md
- 04-safe-answering-rules.md
- 05-human-readable-output-rules.md
- 06-retrieval-links.md
- 07-verified-refresh-2026-03-24.md
- 08-desktop-md-summary.md
- 09-community-core.md
- 10-small-valuable-links.md
- 11-human-and-ai-compatible-writing.md
- 12-latest-high-value-summary.md
- 08-official-menu-map.md
- 09-file-formats.md
- 09-deep-cuts-and-niche-useful.md
- 10-niche-high-value-links.md
- 99-training-pack.md

---

# FILE: 00-how-to-use.md

# How to Use

这套给 AI 的版本，不是为了花哨，而是为了稳定。

使用原则：

- 先读 `01-source-priority.md`
- 再读 `02-route-classifier.md`
- 再读 `03-core-facts.md`
- 只有在这些不够时，再去 `06-retrieval-links.md`


---

# FILE: 01-source-priority.md

# Source Priority

## Tier 1

- `docs.flipper.net`
- `developer.flipper.net`
- `github.com/flipperdevices/*`

## Tier 2

- UberGuidoZ
- Jamison Derek
- awesome-flipperzero

## Tier 3

- Community firmware repos
- Blogs
- Media articles

Rule:

- Tier 3 不能覆盖 Tier 1


---

# FILE: 02-route-classifier.md

# Route Classifier

所有任务先分到以下四类之一：

1. External App / FAP
2. Firmware Development
3. JavaScript
4. Hardware Expansion

默认优先级：

- 默认先按 FAP 设计
- 只有明确需要系统层改动时再进入 Firmware
- 自动化与轻量任务优先考虑 JS
- Wi‑Fi / 传感器 / AI / 板卡协同时才进入 Hardware Expansion


---

# FILE: 03-core-facts.md

# Core Facts

1. 官方开发主线是 `docs + Doxygen + flipperdevices GitHub`
2. External App / FAP 是多数开发任务的默认主线
3. `uFBT` 适合单 App，`FBT` 适合整机开发
4. JS 是轻量脚本，不是完整现代 JS 平台
5. 协议必须分域理解：Sub‑GHz、NFC、RFID、iButton、IR、BadUSB、BLE、GPIO、U2F
6. 社区固件值得研究，但不是官方 API 基线
7. qFlipper、Apps Catalog、good-faps 是很关键的生态层资料


---

# FILE: 04-safe-answering-rules.md

# Safe Answering Rules

回答 Flipper Zero 任务时，必须遵守：

1. 如果官方未明确说明，不要编造 API、函数、字段、路径、目录结构
2. 必须区分：
   - 官方事实
   - 社区经验
   - 待验证信息
3. 不要把社区固件能力写成官方能力
4. 不要把 JS 写成 Node.js / 浏览器生态
5. 不要输出未授权攻击步骤


---

# FILE: 05-human-readable-output-rules.md

# Human Readable Output Rules

为了兼顾以后的人类阅读，AI 输出时应：

- 先给结论
- 再给来源
- 再给风险与边界
- 语言要直白
- 不要堆太多行话
- 不要只报链接，不解释它们为什么重要


---

# FILE: 06-retrieval-links.md

# Retrieval Links

## Official Core

- `https://docs.flipper.net/zero/development`
- `https://developer.flipper.net/flipperzero/doxygen/`
- `https://github.com/flipperdevices/flipperzero-firmware`
- `https://github.com/flipperdevices/flipperzero-ufbt`

## Official App Flow

- `https://developer.flipper.net/flipperzero/doxygen/applications.html`
- `https://developer.flipper.net/flipperzero/doxygen/app_examples.html`
- `https://developer.flipper.net/flipperzero/doxygen/app_manifests.html`
- `https://developer.flipper.net/flipperzero/doxygen/apps_on_sd_card.html`

## Official Ecosystem

- `https://developer.flipper.net/flipperzero/doxygen/app_publishing.html`
- `https://github.com/flipperdevices/flipper-application-catalog`
- `https://github.com/flipperdevices/flipperzero-good-faps`
- `https://docs.flipper.net/qflipper`
- `https://docs.flipper.net/apps/apps-catalog`

## Community Core

- `https://github.com/UberGuidoZ/Flipper`
- `https://github.com/UberGuidoZ/Flipper-IRDB`
- `https://github.com/jamisonderek/flipper-zero-tutorials/wiki`
- `https://github.com/djsime1/awesome-flipperzero`


---

# FILE: 07-verified-refresh-2026-03-24.md

# Verified Refresh 2026-03-24

这次联网后，适合作为长期 AI 基线的结论：

## Official Baseline

- 仍以 `docs.flipper.net` 和 `developer.flipper.net` 为第一文档基线
- 仍以 `flipperdevices` 官方 GitHub 为源码与工具链基线

## Development Baseline

- 仍优先建议按 External App / FAP 路线思考
- `uFBT` 仍是单 App 开发的重要入口
- `FBT` 仍主要对应整机与系统级开发

## Ecosystem Baseline

- `qFlipper`、`Apps Catalog`、`good-faps` 仍是重要但常被忽略的生态层资料

## Community Baseline

- UberGuidoZ、Jamison Derek、awesome-flipperzero 仍是最值得长期跟踪的社区入口
- Unleashed 与 Momentum 仍应被视为“社区增强路线”，不应替代官方开发基线


---

# FILE: 08-desktop-md-summary.md

# Desktop MD Summary

桌面原始 4 份 Flipper Zero 文档应被理解为：

1. `Flipper Zero.md`：开发路线与官方文档入口
2. `Flipper Zero 与 ESP32-S3 深度玩法及社区知识库.md`：生态总览
3. `Flipper Zero 与 ESP32‑S3 开发板深度融合与玩法指南.md`：Flipper + ESP32-S3 协处理器路线
4. `Flipper Zero 与 ESP32‑S3 开发板：深度扩展与知识库.md`：进阶扩展与资源索引

Use:

- Treat them as raw source pool
- Do not treat them as final canonical structure


---

# FILE: 09-community-core.md

# Community Core

长期优先级最高的社区入口：

## High

- `https://github.com/UberGuidoZ/Flipper`
- `https://github.com/UberGuidoZ/Flipper-IRDB`
- `https://github.com/jamisonderek/flipper-zero-tutorials/wiki`
- `https://github.com/djsime1/awesome-flipperzero`

## Medium

- `https://github.com/DarkFlippers/unleashed-firmware`
- `https://github.com/Next-Flip/Momentum-Firmware`
- `https://github.com/0xchocolate/flipperzero-esp-flasher`
- `https://github.com/ezod/flipperzero-gps`

Rule:

- Community can extend the baseline, not replace it.


---

# FILE: 10-small-valuable-links.md

# Small Valuable Links

These are not always the most famous links, but they cover real knowledge gaps:

- `https://github.com/flipperdevices/flipperzero-ufbt-action`
- `https://github.com/0xchocolate/flipperzero-esp-flasher`
- `https://github.com/ezod/flipperzero-gps`
- `https://github.com/bmatcuk/flipperzero-qrcode`

Use them for:

- CI/CD
- ESP flashing workflow
- GPS / serial / NMEA route
- small but instructive app structure


---

# FILE: 11-human-and-ai-compatible-writing.md

# Human and AI Compatible Writing

When generating Flipper Zero knowledge materials, use this shape:

1. conclusion first
2. official source next
3. community supplement after that
4. explicit risk / boundary note

Avoid:

- only link dumping
- unexplained jargon
- mixing official and community features


---

# FILE: 12-latest-high-value-summary.md

# Latest High Value Summary

After refreshed web verification on 2026-03-24, the most stable long-term conclusions are:

1. Official docs + Doxygen + flipperdevices GitHub remain the only safe baseline
2. External App / FAP remains the default development route
3. uFBT remains the most practical single-app toolchain
4. qFlipper, Apps Catalog, App Publishing, and good-faps remain key ecosystem layers
5. UberGuidoZ, Jamison Derek, and awesome-flipperzero remain the best community entry points
6. Smaller but useful resources include ufbt-action, esp-flasher, and GPS-related FAPs


---

# FILE: 08-official-menu-map.md

# Official Menu Map

联网核对后，适合作为 AI 基线的菜单与生态事实：

1. 官方 `Desktop` 页面是设备交互地图：  
   `https://docs.flipper.net/basics/desktop`
2. 官方主菜单核心能力包括：Sub‑GHz、125 kHz RFID、NFC、Infrared、GPIO & Modules、iButton、Bad USB、U2F、Apps、Settings
3. Archive 是统一管理 tags、keys、remotes、payloads、apps 的官方入口
4. qFlipper、Mobile App、Apps Catalog 共同构成设备生态层
5. 回答“设备怎么用”“菜单怎么组织”“生态怎么协同”时，应优先引用这些官方页面


---

# FILE: 09-file-formats.md

# File Formats

AI 长期上下文里应明确：

1. Flipper Zero 官方开发文档有独立的 File Formats 章节  
   `https://developer.flipper.net/flipperzero/doxygen/file_formats.html`
2. 文件格式不是附属细节，而是平台能力的一部分
3. 至少应长期记住以下官方格式方向：
   - BadUSB
   - iButton
   - Infrared
   - LF RFID
   - NFC
   - SubGhz
4. 回答涉及数据存储、导出、导入、共享、文件路径时，应优先查看对应格式页


---

# FILE: 09-deep-cuts-and-niche-useful.md

# Deep Cuts and Niche Useful Findings

适合作为 AI 学习的补充知识：

## Official Deep Cuts

- Tech specs：硬件边界真基线  
  `https://docs.flipper.net/zero/development/hardware/tech-specs`
- Schematics：低层与模块开发资料  
  `https://docs.flipper.net/development/hardware/schematic`
- External modules blueprints：外设结构与几何资料  
  `https://docs.flipper.net/development/hardware/modules-blueprints`
- ST-Link V3 dev board：高级开发与调试板  
  `https://docs.flipper.net/development/hardware/devboard-stlinkv3`

## Niche but Useful Community Links

- DroomOne plugin tutorial  
  `https://github.com/DroomOne/Flipper-Plugin-Tutorial`
- ESP flasher app  
  `https://github.com/0xchocolate/flipperzero-esp-flasher`
- FlipperHTTP  
  `https://github.com/jblanked/FlipperHTTP`

## Rule

- 这些链接适合补“开发工作流、外设路线、模板思维”
- 不应覆盖官方主线


---

# FILE: 10-niche-high-value-links.md

# Niche High Value Links

下面这些适合放入 AI 的“补充检索层”：

## Higher Value Community / Niche

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

Rule:

- 这些不是官方基线
- 它们适合作为：
  - 模板线索
  - 文件格式线索
  - 外设路线线索
  - 生态层线索


---

# FILE: 99-training-pack.md

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

