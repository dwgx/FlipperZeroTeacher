# FlipperZeroTeacher

**Bilingual Flipper Zero knowledge base — documentation, learning paths, and AI-ready reference packs.**

**双语 Flipper Zero 教学知识库 — 官方文档整理、结构化学习路径、AI/RAG 参考包。**

Live site / 在线阅读: https://dwgx.github.io/FlipperZeroTeacher/

---

## Overview / 概述

FlipperZeroTeacher is a bilingual (English / Chinese) knowledge base for the Flipper Zero multi-tool. It brings together official documentation, structured learning paths, curated community resources, and retrieval-friendly AI packs into a single navigable repository.

Targets: beginners building a mental model of the device, developers writing Flipper apps, and anyone assembling a RAG corpus of high-signal Flipper Zero material.

The repo is content only — Markdown guides plus archived HTML documentation. No application to compile; deployed as a static site via GitHub Pages.

---

FlipperZeroTeacher 是一个双语（中/英）Flipper Zero 知识库。把官方文档、学习路径、社区精选资源、AI/RAG 参考包全部整合到一个仓库里。

面向人群：刚入坑想搞懂设备的新手、写 Flipper 应用的开发者、以及需要高质量 Flipper Zero 语料做 RAG 检索的人。

仓库纯内容，Markdown + 静态 HTML，无需编译，通过 GitHub Pages 直接发布。

---

## Features / 功能

- **Bilingual coverage / 双语覆盖** — parallel `CN/` and `EN/` trees covering the same topics
- **Course-style learning path / 课程式学习路径** — numbered `Guide/` sequence (00–10): study map, device ecosystem, protocol domains, app development, build/debug tooling, JavaScript, system programming, file formats, community references, 2025 firmware reference
- **Protocol-domain topics / 协议专题** — SubGHz, NFC/RFID, IR database, BLE, troubleshooting, learning roadmap
- **AI/RAG reference packs / AI 参考包** — `FlipperZero-AI-Pack-CN/EN.md` with source trust hierarchy (official docs > official GitHub > curated community > ecosystem context), designed for retrieval-augmented prompting and system prompts
- **Local technical resource library / 本地技术资源库** (`FlipperZero_资源库/`) — SubGHz frequency database, NFC/RFID & BLE deep-dives, firmware flashing guide, helper shell script, example Flipper app source code
- **Offline documentation mirror / 离线文档镜像** (`Wiki-Resources/`) — archived copies of `docs.flipper.net` and developer doxygen output
- **HTML renderings / HTML 版本** — guide chapters ship both `.md` and `.html`; the repo deploys as a GitHub Pages static site

---

## Tech Stack / 技术栈

This is a documentation project, not a software package.

| Layer | Detail |
|-------|--------|
| Content | GitHub-Flavored Markdown + static HTML |
| Publishing | GitHub Pages via GitHub Actions (`.github/workflows/pages.yml`) |
| Example code | C sources + `application.fam` + `flipper_tools.sh` (illustrative) |

---

## Project Structure / 项目结构

```
FlipperZeroTeacher/
├── CN/                         # 中文知识库
│   ├── Guide/                  # 编号课程 (00–10), .md + .html
│   ├── Topics/                 # BLE, IR, roadmap, troubleshooting
│   ├── Apps/                   # 趣味App完全收录
│   ├── FlipperZero-Master-CN.md
│   ├── FlipperZero-AI-Pack-CN.md
│   └── Official-Docs-CN-Full.md
├── EN/                         # English mirror
│   ├── Guide/ Topics/ Apps/
│   ├── FlipperZero-Master-EN.md
│   ├── FlipperZero-AI-Pack-EN.md
│   └── Official-Docs-EN-Full.md
├── FlipperZero_资源库/          # 本地技术资源
│   ├── 频率数据库/              # SubGHz frequency database
│   ├── 固件刷机指南/            # Firmware flashing guide
│   ├── 工具脚本/                # flipper_tools.sh
│   └── 示例代码/                # application.fam + C examples
├── Wiki-Resources/             # Offline mirrors of official docs
│   ├── Deployable-Web-Mirror/
│   └── Markdown-Link-Archive/
├── Legacy/                     # Earlier all-in-one reference (archived)
├── Original-Notes/             # Original desktop notes
├── .github/workflows/pages.yml # GitHub Pages deploy
└── LICENSE                     # MIT
```

---

## Getting Started / 快速开始

No installation or build required. It's Markdown and HTML.

**Read online:** https://dwgx.github.io/FlipperZeroTeacher/ or browse directly on GitHub.

**Read locally:**

```bash
git clone https://github.com/dwgx/FlipperZeroTeacher.git
cd FlipperZeroTeacher
```

**Entry points / 入口:**

| Language | Start here |
|----------|-----------|
| 中文 | `CN/Guide/README.md` (学习路径) · `CN/FlipperZero-Master-CN.md` · `CN/FlipperZero-AI-Pack-CN.md` |
| English | `EN/README.md` · `EN/Guide/README.md` · `EN/FlipperZero-Master-EN.md` · `EN/FlipperZero-AI-Pack-EN.md` |

**Optional local preview:**

```bash
python -m http.server 8000
# open http://localhost:8000/
```

<!-- TODO: confirm intended local-preview workflow -->

---

## Usage / 使用方法

- **Learning / 学习** — follow the numbered `Guide/` chapters in order (00 → 10) in your preferred language.
- **Reference / 查阅** — jump to a protocol topic under `CN/Topics/` or `EN/Topics/`, or the frequency database under `FlipperZero_资源库/频率数据库/`.
- **AI / retrieval / AI 检索** — use the AI Pack files as system-prompt or RAG control rules. They define a source trust hierarchy: official docs first, then official Flipper GitHub repos, then curated community, with alternative-firmware repos as ecosystem context only.
- **Example app code / 示例代码** — C files and `application.fam` under `FlipperZero_资源库/示例代码/` are illustrative references for Flipper app development.

---

## Status / 状态

Active. Content carries 2026 update dates. `CN/` and `EN/` are the maintained structure; `Legacy/` and `Original-Notes/` are retained as historical material.

活跃维护中。内容标注 2026 更新日期。`CN/` 和 `EN/` 是当前主结构；`Legacy/` 和 `Original-Notes/` 作为历史存档保留。

---

## License / 许可证

[MIT](LICENSE) — Copyright (c) 2026 dwgx
