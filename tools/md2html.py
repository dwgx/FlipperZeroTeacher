#!/usr/bin/env python3
"""为 CN/Guide 生成章节壳页和课程清单。

壳页本身不保存 Markdown 转换结果，只负责加载同目录下的 .md，
然后交给浏览器里的共享阅读器动态渲染。
"""

from __future__ import annotations

import html
import json
import re
from pathlib import Path
from urllib.parse import quote


ROOT = Path(__file__).resolve().parent.parent
GUIDE_DIR = ROOT / "CN" / "Guide"
MANIFEST_PATH = ROOT / "assets" / "js" / "guide-manifest.js"
SEARCH_INDEX_PATH = ROOT / "assets" / "js" / "search-index.js"
SEARCH_EXCLUDE = {
    "All-Markdown-Manifest.md",
    "Official-Docs-Coverage.md",
    "CN/qFlipper-RAG-索引.md",
}


PAGE_TEMPLATE = """<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#0b0d10">
    <title>{title} - Flipper Zero Teacher</title>
    <link rel="stylesheet" href="../../assets/css/site.css">
</head>
<body class="reader-page" data-site-root="../../" data-fetch="{fetch_path}" data-repo-path="{repo_path}" data-title="{title_attr}" data-description="{summary_attr}" data-kicker="CN Guide" data-mode-label="Guide Shell · Markdown Runtime Render">
    <a class="skip-link" href="#main-content">跳到正文</a>
    <div class="reader-shell">
        <header class="site-topbar">
            <a class="site-brand" href="../../index.html">
                <span class="site-brand-mark site-brand-mark--image">
                    <img src="../../assets/official/brand/flipper-device.svg" alt="Flipper Zero" width="360" height="156">
                </span>
                <span class="site-brand-text">
                    <strong>{title}</strong>
                    <span>章节阅读器 · 内容来自同目录 Markdown</span>
                </span>
            </a>
            <nav class="site-nav" aria-label="主导航">
                <a href="../../index.html">首页</a>
                <a href="../../CN/Guide/index.html">课程导航</a>
                <a href="../../viewer.html?file=CN/FlipperZero-Master-CN.md">主知识库</a>
                <a href="../../viewer.html?file=CN/qFlipper-全网融合总文档.md">qFlipper</a>
            </nav>
        </header>

        <main class="reader-main" id="main-content">
            <section class="doc-hero pixel-motion-host" data-pixel-motion="doc">
                <div>
                    <nav class="doc-breadcrumb" aria-label="面包屑">
                        <a href="../../index.html">首页</a>
                        <span>/</span>
                        <a id="docBreadcrumbParent" href="../../CN/Guide/index.html">中文课程</a>
                        <span>/</span>
                        <span id="docBreadcrumbCurrent">{title}</span>
                    </nav>
                    <p class="eyebrow" id="docEyebrow">CN Guide</p>
                    <h1 class="doc-title" id="docTitle">{title}</h1>
                    <p class="doc-lead" id="docLead">{summary}</p>
                    <div class="terminal-panel terminal-panel--doc" data-terminal-stream="doc" aria-label="文档渲染日志"></div>
                    <div class="doc-status-strip" aria-label="文档状态">
                        <span id="docStatusKind">课程章节</span>
                        <span id="docStatusRoute">Guide Shell</span>
                        <span id="docStatusSource">{repo_path}</span>
                    </div>
                </div>
                <div class="doc-meta">
                    <div class="doc-meta-card">
                        <dl>
                            <div>
                                <dt>Source</dt>
                                <dd id="docPath">{repo_path}</dd>
                            </div>
                            <div>
                                <dt>Mode</dt>
                                <dd id="docMode">Guide Shell · Markdown Runtime Render</dd>
                            </div>
                        </dl>
                        <a class="source-link" id="sourceLink" href="../../{repo_path}">查看源 Markdown</a>
                    </div>
                    <div class="doc-hud-panel" aria-label="阅读状态">
                        <div class="doc-hud-row">
                            <span class="doc-hud-label">active</span>
                            <strong class="doc-hud-value" id="docHudHeading">awaiting toc lock</strong>
                        </div>
                        <div class="doc-hud-row">
                            <span class="doc-hud-label">progress</span>
                            <strong class="doc-hud-value" id="docHudProgress">0%</strong>
                        </div>
                        <div class="doc-hud-row">
                            <span class="doc-hud-label">search</span>
                            <strong class="doc-hud-value" id="docHudSearch">idle</strong>
                        </div>
                    </div>
                </div>
            </section>

            <section class="doc-toolbar">
                <div class="toolbar-search">
                    <label class="toolbar-label" for="docSearch">模糊搜索</label>
                    <input class="toolbar-input" id="docSearch" type="search" placeholder="搜索标题、术语、命令、正文" autocomplete="off" spellcheck="false" enterkeyhint="search">
                    <span class="toolbar-cursor" aria-hidden="true"></span>
                    <span class="toolbar-grid" aria-hidden="true"></span>
                    <span class="toolbar-status" id="docSearchStatus">未搜索</span>
                </div>
                <div class="toolbar-actions">
                    <button class="toolbar-button" id="docSearchClear" type="button">清空搜索</button>
                    <button class="toolbar-button toolbar-button--accent" id="copyPageUrl" type="button">复制当前链接</button>
                </div>
            </section>

            <section class="search-results" id="searchResults" hidden>
                <div class="search-results-loom" aria-hidden="true"></div>
                <div class="search-results-header">
                    <strong>搜索结果</strong>
                    <span id="searchResultsMeta">输入关键词后显示结果</span>
                </div>
                <div class="search-results-list" id="searchResultsList"></div>
            </section>

            <div class="keyword-bar" id="keywordBar"></div>

            <div class="reader-grid tui-viewport pixel-motion-host" data-pixel-motion="reader">
                <article class="doc-panel markdown-body" id="docContent">
                    <div class="scanline-overlay" aria-hidden="true"></div>
                    <p class="empty-state">正在读取 Markdown 内容…</p>
                </article>

                <aside class="toc-panel">
                    <div class="toc-hud" aria-label="目录追踪">
                        <div class="toc-progress-rail" aria-hidden="true"><i id="tocProgressFill"></i></div>
                        <div class="toc-hud-row">
                            <span class="toc-hud-label">active</span>
                            <strong class="toc-hud-value" id="tocHudHeading">awaiting toc lock</strong>
                        </div>
                        <div class="toc-hud-row">
                            <span class="toc-hud-label">track</span>
                            <strong class="toc-hud-value" id="tocHudMeta">0 / 0 · 0%</strong>
                        </div>
                    </div>
                    <h2 class="toc-title">本页目录</h2>
                    <nav id="docToc">
                        <p class="empty-state">文档渲染后会在这里生成章节目录。</p>
                    </nav>
                </aside>
            </div>

            <nav class="pager" id="docPager"></nav>
        </main>

        <footer class="site-footer">
            <div class="site-footer-brand">
                <strong>{title}</strong>
                <p>章节正文仍然来自同目录 Markdown，页面只是阅读器壳页。</p>
            </div>
            <div class="site-footer-links">
                <a href="../../index.html">首页</a>
                <a href="../../CN/Guide/index.html">课程导航</a>
                <a href="../../viewer.html?file=CN/FlipperZero-Master-CN.md">主知识库</a>
                <a href="../../viewer.html?file=CN/qFlipper-全网融合总文档.md">qFlipper</a>
                <a href="https://github.com/dwgx/FlipperZeroTeacher" target="_blank" rel="noreferrer">GitHub</a>
            </div>
        </footer>
    </div>

    <script src="../../assets/js/guide-manifest.js"></script>
    <script src="../../assets/js/search-index.js"></script>
    <script src="../../assets/js/site-shell.js"></script>
    <script src="../../assets/vendor/marked.min.js"></script>
    <script src="../../assets/js/reader.js"></script>
    <script src="../../assets/js/site-search.js"></script>
    <script src="../../assets/js/pixel-motion.js"></script>
</body>
</html>
"""


def extract_title(markdown_text: str) -> str:
    for line in markdown_text.splitlines():
        if line.startswith("# "):
            return line[2:].strip()
    return "Untitled"


def extract_summary(markdown_text: str) -> str:
    lines = markdown_text.splitlines()
    in_code = False
    for raw_line in lines:
        line = raw_line.strip()
        if line.startswith("```"):
            in_code = not in_code
            continue
        if in_code or not line:
            continue
        if line.startswith("#") or line.startswith(">") or line.startswith("|"):
            continue
        if line.startswith("- ") or line.startswith("* ") or line[:2].isdigit() and ". " in line[:4]:
            continue
        if line.startswith("[") and "](" in line and "|" in line:
            continue
        return line
    return "章节正文会从同目录 Markdown 实时渲染到阅读页。"


def estimate_read_metrics(markdown_text: str) -> tuple[int, int, int]:
    cleaned = strip_decorative_nav(markdown_text)
    plain = cleaned
    plain = re.sub(r"```[^\n]*", " ", plain)
    plain = plain.replace("```", " ")
    plain = re.sub(r"`([^`]+)`", r"\1", plain)
    plain = re.sub(r"!\[([^\]]*)\]\([^)]+\)", r"\1", plain)
    plain = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r"\1 \2", plain)
    plain = re.sub(r"^\s{0,3}#{1,6}\s*", "", plain, flags=re.M)
    plain = re.sub(r"^\s*[-*+]\s+", "", plain, flags=re.M)
    plain = re.sub(r"^\s*\d+\.\s+", "", plain, flags=re.M)
    plain = re.sub(r"^\s*\|\s*", " ", plain, flags=re.M)
    plain = plain.replace("|", " ")
    plain = re.sub(r"\s+", " ", plain).strip()

    cjk_units = len(re.findall(r"[\u4e00-\u9fff]", plain))
    latin_units = len(re.findall(r"[A-Za-z0-9_+-]+", plain))
    units = cjk_units + latin_units
    minutes = max(1, (units + 419) // 420)
    sections = len(re.findall(r"^\s*#{2,3}\s+", cleaned, flags=re.M))
    return units, minutes, sections


def build_manifest() -> list[dict[str, str]]:
    docs = []
    md_files = sorted(path for path in GUIDE_DIR.glob("*.md") if path.name != "README.md")
    for order, md_file in enumerate(md_files):
        markdown_text = md_file.read_text(encoding="utf-8")
        title = extract_title(markdown_text)
        summary = extract_summary(markdown_text)
        units, minutes, sections = estimate_read_metrics(markdown_text)
        number = md_file.stem.split("-", 1)[0]
        docs.append(
            {
                "order": order,
                "number": number,
                "title": title,
                "summary": summary,
                "path": f"CN/Guide/{md_file.name}",
                "html": f"CN/Guide/{md_file.stem}.html",
                "filename": md_file.name,
                "stem": md_file.stem,
                "units": units,
                "minutes": minutes,
                "sections": sections,
            }
        )
    return docs


def write_manifest(docs: list[dict[str, str]]) -> None:
    payload = json.dumps(docs, ensure_ascii=False, indent=2)
    MANIFEST_PATH.write_text(f"window.GUIDE_MANIFEST = {payload};\n", encoding="utf-8")


def write_shells(docs: list[dict[str, str]]) -> None:
    for doc in docs:
        html_path = GUIDE_DIR / f"{doc['stem']}.html"
        html_path.write_text(
            PAGE_TEMPLATE.format(
                title=html.escape(doc["title"]),
                title_attr=html.escape(doc["title"], quote=True),
                summary=html.escape(doc["summary"]),
                summary_attr=html.escape(doc["summary"], quote=True),
                fetch_path=html.escape(doc["filename"], quote=True),
                repo_path=html.escape(doc["path"], quote=True),
            ),
            encoding="utf-8",
        )


def slugify(value: str) -> str:
    slug = value.strip().lower()
    slug = re.sub(r"[【】()[\]{}：:、，,。.!?\"'`]+", " ", slug)
    slug = re.sub(r"\s+", "-", slug)
    slug = slug.strip("-")
    return slug or "section"


def strip_decorative_nav(markdown_text: str) -> str:
    nav_line_pattern = re.compile(r"^\s*(\[[^\]]+\]\([^)]+\)\s*(\|\s*\[[^\]]+\]\([^)]+\)\s*)+)\s*$")
    lines = markdown_text.splitlines()
    while lines and nav_line_pattern.match(lines[0].strip()):
        lines.pop(0)
        while lines and lines[0] == "":
            lines.pop(0)
    while lines and nav_line_pattern.match(lines[-1].strip()):
        lines.pop()
        while lines and lines[-1] == "":
            lines.pop()
    return "\n".join(lines)


def markdown_to_text(markdown_text: str, limit: int = 360) -> str:
    text = strip_decorative_nav(markdown_text)
    text = re.sub(r"```[^\n]*", " ", text)
    text = text.replace("```", " ")
    text = re.sub(r"`([^`]+)`", r"\1", text)
    text = re.sub(r"!\[([^\]]*)\]\([^)]+\)", r"\1", text)
    text = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r"\1 \2", text)
    text = re.sub(r"^\s{0,3}#{1,6}\s*", "", text, flags=re.M)
    text = re.sub(r"^\s*[-*+]\s+", "", text, flags=re.M)
    text = re.sub(r"^\s*\d+\.\s+", "", text, flags=re.M)
    text = re.sub(r"^\s*\|\s*", " ", text, flags=re.M)
    text = text.replace("|", " ")
    text = re.sub(r"\s+", " ", text).strip()
    return text[:limit]


def resolve_doc_href(repo_path: str, anchor: str = "") -> str:
    if repo_path == "CN/Guide/README.md":
        href = "CN/Guide/index.html"
    elif repo_path.startswith("CN/Guide/") and repo_path.endswith(".md"):
        href = repo_path[:-3] + ".html"
    else:
        href = f"viewer.html?file={quote(repo_path, safe='/')}"
    if anchor:
        href = f"{href}#{anchor}"
    return href


def classify_doc(repo_path: str) -> tuple[str, str]:
    if repo_path.startswith("CN/Guide/"):
        return "guide", "课程"
    if repo_path.startswith("FlipperZero_资源库/"):
        return "resource", "资源库"
    if repo_path.startswith("CN/"):
        return "doc", "中文文档"
    return "doc", "文档"


def collect_sections(markdown_text: str) -> list[dict[str, str]]:
    lines = strip_decorative_nav(markdown_text).splitlines()
    sections: list[dict[str, str]] = []
    current: dict[str, str] | None = None

    for line in lines:
        match = re.match(r"^(#{2,3})\s+(.+)$", line.strip())
        if match:
            if current:
                current["text"] = markdown_to_text(current["text"], limit=160)
                sections.append(current)
            current = {
                "title": match.group(2).strip(),
                "level": str(len(match.group(1))),
                "text": "",
                "anchor": slugify(match.group(2)),
            }
            continue
        if current is not None:
            current["text"] += f"{line}\n"

    if current:
        current["text"] = markdown_to_text(current["text"], limit=160)
        sections.append(current)

    return sections


def build_search_index() -> list[dict[str, str]]:
    search_paths: list[Path] = []
    search_paths.extend(sorted(path for path in ROOT.glob("*.md")))
    search_paths.extend(sorted(path for path in (ROOT / "CN").rglob("*.md")))
    search_paths.extend(sorted(path for path in (ROOT / "FlipperZero_资源库").rglob("*.md")))

    entries: list[dict[str, str]] = []

    for path in search_paths:
        repo_path = path.relative_to(ROOT).as_posix()
        if repo_path in SEARCH_EXCLUDE:
            continue
        markdown_text = path.read_text(encoding="utf-8")
        cleaned_markdown = strip_decorative_nav(markdown_text)
        title = extract_title(cleaned_markdown)
        summary = extract_summary(cleaned_markdown)
        search_text = markdown_to_text(cleaned_markdown, limit=480)
        kind, group = classify_doc(repo_path)

        entries.append(
            {
                "kind": kind,
                "group": group,
                "title": title,
                "summary": summary,
                "text": search_text,
                "path": repo_path,
                "href": resolve_doc_href(repo_path),
            }
        )

        for section in collect_sections(cleaned_markdown):
            entries.append(
                {
                    "kind": "section",
                    "group": group,
                    "title": section["title"],
                    "summary": section["text"] or summary,
                    "text": f"{title} {section['title']} {section['text']}".strip(),
                    "path": repo_path,
                    "href": resolve_doc_href(repo_path, section["anchor"]),
                    "parent": title,
                }
            )

    return entries


def write_search_index(entries: list[dict[str, str]]) -> None:
    payload = json.dumps(entries, ensure_ascii=False, indent=2)
    SEARCH_INDEX_PATH.write_text(f"window.SITE_SEARCH_INDEX = {payload};\n", encoding="utf-8")


def main() -> None:
    docs = build_manifest()
    write_manifest(docs)
    write_shells(docs)
    search_entries = build_search_index()
    write_search_index(search_entries)
    print(f"generated {len(docs)} guide shells, manifest, and {len(search_entries)} search entries")


if __name__ == "__main__":
    main()
