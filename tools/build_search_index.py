#!/usr/bin/env python3

from __future__ import annotations

import json
import re
from pathlib import Path
from urllib.parse import quote


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "assets/js/search-index.js"

TOP_LEVEL_FILES = [
    Path("README.md"),
    Path("All-Markdown-Manifest.md"),
    Path("Official-Docs-Coverage.md"),
]

DIRECTORIES = [
    Path("CN"),
    Path("EN"),
    Path("Legacy"),
    Path("Original-Notes"),
    Path("FlipperZero_资源库"),
]

EXPLICIT_FILES = [
    Path("Wiki-Resources/README.md"),
]


def slugify(value: str) -> str:
    text = str(value or "").strip().lower()
    text = re.sub(r"[【】()\[\]{}：:、，,。.!?'\"`]+", " ", text)
    text = re.sub(r"\s+", "-", text)
    text = text.strip("-")
    return text or "section"


def clean_markdown(markdown: str) -> str:
    text = markdown.replace("\r\n", "\n")
    text = re.sub(r"^---\n.*?\n---\n", "", text, flags=re.DOTALL)
    text = re.sub(r"<img\b[^>]*alt=['\"]?([^'\">]*)['\"]?[^>]*>", r" \1 ", text, flags=re.IGNORECASE)
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"!\[([^\]]*)\]\(([^)]+)\)", r" \1 ", text)
    text = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r" \1 ", text)
    text = re.sub(r"`{3,}.*?\n", "\n", text)
    text = re.sub(r"`([^`]+)`", r" \1 ", text)
    text = re.sub(r"^\s*>+\s?", "", text, flags=re.MULTILINE)
    text = re.sub(r"^\s*[-*+]\s+", "", text, flags=re.MULTILINE)
    text = re.sub(r"^\s*\d+\.\s+", "", text, flags=re.MULTILINE)
    text = re.sub(r"^\s*\|", "", text, flags=re.MULTILINE)
    text = re.sub(r"\|\s*$", "", text, flags=re.MULTILINE)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def split_sections(markdown: str) -> list[tuple[int, str, str]]:
    lines = markdown.replace("\r\n", "\n").split("\n")
    headings: list[tuple[int, str, int]] = []
    for index, line in enumerate(lines):
        match = re.match(r"^(#{2,3})\s+(.+?)\s*$", line)
        if not match:
            continue
        level = len(match.group(1))
        title = match.group(2).strip()
        headings.append((level, title, index))

    sections: list[tuple[int, str, str]] = []
    for current_index, (level, title, start) in enumerate(headings):
        end = len(lines)
        for next_level, _next_title, next_start in headings[current_index + 1 :]:
            if next_level <= level:
                end = next_start
                break
        snippet = clean_markdown("\n".join(lines[start + 1 : end]))
        if snippet:
            sections.append((level, title, snippet))
    return sections


def first_heading(markdown: str) -> str | None:
    match = re.search(r"^#\s+(.+?)\s*$", markdown, flags=re.MULTILINE)
    return match.group(1).strip() if match else None


def first_summary(markdown: str) -> str:
    lines = markdown.replace("\r\n", "\n").split("\n")
    in_code = False
    for raw_line in lines:
        stripped = raw_line.strip()
        if stripped.startswith("```"):
            in_code = not in_code
            continue
        if in_code or not stripped:
            continue
        if stripped.startswith("#"):
            continue
        text = clean_markdown(stripped)
        if text:
            return text
    return ""


def kind_for_path(path: str) -> str:
    if path.startswith("CN/Guide/") and path != "CN/Guide/README.md":
        return "guide"
    if path.startswith("EN/Guide/") and path != "EN/Guide/README.md":
        return "guide"
    return "doc"


def group_for_path(path: str) -> str:
    if path.startswith("CN/Guide/"):
        return "中文课程"
    if path.startswith("EN/Guide/"):
        return "English Guide"
    if path.startswith("CN/"):
        return "中文文档"
    if path.startswith("EN/"):
        return "English Docs"
    if path.startswith("Legacy/"):
        return "归档文档"
    if path.startswith("Original-Notes/"):
        return "原始笔记"
    if path.startswith("FlipperZero_资源库/"):
        return "资源库"
    if path.startswith("Wiki-Resources/"):
        return "资源索引"
    return "文档"


def href_for_path(path: str) -> str:
    if path == "CN/Guide/README.md":
        return "CN/Guide/index.html"
    if path.startswith("CN/Guide/") and path.endswith(".md"):
        return path[:-3] + ".html"
    return f"viewer.html?file={quote(path, safe='/')}"


def gather_files() -> list[Path]:
    results: list[Path] = []

    for relative in TOP_LEVEL_FILES + EXPLICIT_FILES:
        candidate = ROOT / relative
        if candidate.exists():
            results.append(candidate)

    for directory in DIRECTORIES:
        root = ROOT / directory
        if not root.exists():
            continue
        for candidate in sorted(root.rglob("*.md")):
            results.append(candidate)

    unique: list[Path] = []
    seen: set[Path] = set()
    for candidate in results:
        if candidate in seen:
            continue
        seen.add(candidate)
        unique.append(candidate)
    return unique


def build_entries() -> list[dict[str, str]]:
    entries: list[dict[str, str]] = []

    for file_path in gather_files():
        relative_path = file_path.relative_to(ROOT).as_posix()
        markdown = file_path.read_text(encoding="utf-8")
        title = first_heading(markdown) or file_path.stem.replace("-", " ")
        summary = first_summary(markdown)
        plain_text = clean_markdown(markdown)
        kind = kind_for_path(relative_path)
        group = group_for_path(relative_path)
        href = href_for_path(relative_path)

        entries.append(
            {
                "kind": kind,
                "group": group,
                "title": title,
                "summary": summary[:220],
                "text": plain_text[:1400],
                "path": relative_path,
                "href": href,
            }
        )

        for _level, section_title, section_text in split_sections(markdown):
            if not section_text:
                continue
            entries.append(
                {
                    "kind": "section",
                    "group": group,
                    "title": section_title,
                    "summary": section_text[:220],
                    "text": f"{title} {section_title} {section_text[:1100]}".strip(),
                    "path": relative_path,
                    "href": f"{href}#{slugify(section_title)}",
                    "parent": title,
                }
            )

    return entries


def main() -> None:
    entries = build_entries()
    payload = json.dumps(entries, ensure_ascii=False, indent=2)
    OUTPUT.write_text(f"window.SITE_SEARCH_INDEX = {payload};\n", encoding="utf-8")
    print(f"Wrote {len(entries)} search entries to {OUTPUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
