# Flipper Zero AI Training Pack

> Legacy mixed reference file.
> Preferred current entry: `CN/FlipperZero-AI-Pack-CN.md`, `EN/FlipperZero-AI-Pack-EN.md`.

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
