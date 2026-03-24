# Flipper Zero 官方开发文档 + GitHub 社区经验整合教学文档（AI 投喂版）

> 适用目标：把这份文档直接投喂给 Codex、Claude、Cursor、OpenAI Codex CLI、ChatGPT Projects 等代码助手，让它们按 **Flipper Zero 官方规范** 帮你写 App / FAP / JS 脚本，而不是瞎编接口。
>
> 适用方向：
> - 原生 C / C++ 外部应用（FAP）
> - 基于 uFBT / FBT 的构建与调试
> - 资源文件、数据文件、图标、私有库
> - JavaScript 脚本（mJS）
> - 发布到 Apps Catalog 的准备工作
>
> 这份文档把资料分成两层：
> 1. **官方事实层**：只使用 Flipper 官方文档、官方源码仓库、官方工具仓库。
> 2. **社区经验层**：使用 GitHub 社区里被广泛引用的教程与示例仓库，提炼“真实踩坑经验”。

---

## 1. 先给 AI 的总说明：Flipper Zero 开发到底分几条路线

让 AI 先理解这个总图：

### 1.1 原生外部应用（最重要）
- Flipper 官方明确支持 **custom apps**，而且通常 **不需要修改固件本体**。
- 这类应用通常被打包成 `.fap`，也就是 **Flipper App Package**。
- 官方推荐使用 **uFBT** 做单应用开发；如果你要改整机固件，再用 **FBT**。  
  来源：
  - 官方 App Development 文档
  - 官方 FAP / FAM 文档
  - 官方 uFBT 仓库 README

### 1.2 固件内置应用 / 固件开发
- 如果你的功能必须改系统服务、系统菜单、底层模块，才进入固件仓库开发。
- 官方仓库也明确提醒：**很多点子都可以做成 external app，不一定要进 firmware**。

### 1.3 JavaScript 脚本
- Flipper 官方还支持基于 mJS 的 JavaScript 脚本。
- 这类脚本适合快速自动化、轻量逻辑、工具脚本，不适合重型 GUI / 复杂系统集成。

---

## 2. 官方资料的正确阅读顺序（这是喂 AI 最关键的顺序）

建议把下面顺序告诉 AI，要求它按这个顺序检索和引用：

1. **官方开发总入口**  
   https://docs.flipper.net/zero/development
2. **官方 Developer Docs（Doxygen）总入口**  
   https://developer.flipper.net/flipperzero/doxygen/
3. **App Development**  
   https://developer.flipper.net/flipperzero/doxygen/applications.html
4. **FAM（application.fam）**  
   https://developer.flipper.net/flipperzero/doxygen/app_manifests.html
5. **FAP（外部应用打包）**  
   https://developer.flipper.net/flipperzero/doxygen/apps_on_sd_card.html
6. **App Examples**  
   https://developer.flipper.net/flipperzero/doxygen/app_examples.html
7. **Flipper Build Tool（FBT）**  
   https://developer.flipper.net/flipperzero/doxygen/fbt.html
8. **uFBT 官方仓库**  
   https://github.com/flipperdevices/flipperzero-ufbt
9. **官方固件源码仓库**  
   https://github.com/flipperdevices/flipperzero-firmware
10. **JavaScript 文档入口**  
   https://developer.flipper.net/flipperzero/doxygen/js.html

### 为什么要按这个顺序
因为很多 AI 会犯两个错误：
- 只抓 GitHub 仓库里的旧教程，忽略了 **新版官方 Doxygen 文档**。
- 混淆 **内置 App** 与 **外部 FAP** 的 manifest 写法和构建方式。

所以你在提示词里要明确写：

```text
所有实现优先遵循 Flipper 官方 Developer Docs（developer.flipper.net）和 flipperdevices 官方 GitHub 仓库。只有在官方文档没有明确说明时，才参考社区仓库示例。
