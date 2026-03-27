#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
import mimetypes
import re
import time
import urllib.parse
from collections import defaultdict
from pathlib import Path

import requests

ROOT = Path(__file__).resolve().parents[1]
ARCHIVE_ROOT = ROOT / 'Wiki-Resources' / 'Markdown-Link-Archive'
FILES_ROOT = ARCHIVE_ROOT / 'files'
MANIFEST_PATH = ARCHIVE_ROOT / 'manifest.json'
INDEX_PATH = ARCHIVE_ROOT / 'README.md'
USER_AGENT = (
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) '
    'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36'
)
URL_RE = re.compile(r'https?://[^)\]\s>"\']+')
SKIP_PREFIXES = ('http://localhost', 'https://localhost', 'http://127.0.0.1', 'https://127.0.0.1')


def extract_urls() -> dict[str, set[str]]:
    result: dict[str, set[str]] = defaultdict(set)
    for path in ROOT.rglob('*.md'):
        if '.git/' in str(path):
            continue
        text = path.read_text(encoding='utf-8', errors='ignore')
        for raw in URL_RE.findall(text):
            url = normalize_markdown_url(raw)
            if not url:
                continue
            result[url].add(str(path.relative_to(ROOT)))
    return result


def normalize_markdown_url(raw: str) -> str | None:
    value = raw.strip().rstrip('`').rstrip('.,;')
    if not value or value.startswith(SKIP_PREFIXES):
        return None
    if '${' in value:
        return None
    return value


def local_existing_resource(url: str) -> Path | None:
    parsed = urllib.parse.urlsplit(url)
    host = parsed.netloc.lower()
    deploy_root = ROOT / 'Wiki-Resources' / 'Deployable-Web-Mirror' / 'Flipper-Official-Docs'
    snapshot_root = ROOT / 'Wiki-Resources' / 'Official-Web-Snapshots' / 'Flipper-Official-Docs-Snapshot-2026-03-24'

    if host in {'docs.flipper.net', 'developer.flipper.net'}:
        for root in (deploy_root, snapshot_root):
            path = find_mirrored_page(root, url)
            if path is not None:
                return path
    return None


def find_mirrored_page(root: Path, url: str) -> Path | None:
    parsed = urllib.parse.urlsplit(url)
    host = parsed.netloc.lower()
    raw_path = parsed.path or '/'
    candidates: list[Path] = []
    if raw_path == '/':
        candidates.append(root / host / 'index.html')
    else:
        stripped = raw_path.lstrip('/')
        candidates.append(root / host / stripped)
        if raw_path.endswith('/'):
            candidates.append(root / host / stripped / 'index.html')
        else:
            candidates.append(root / host / f'{stripped}.html')
            candidates.append(root / host / stripped / 'index.html')
    for candidate in candidates:
        if candidate.exists() and candidate.is_file():
            return candidate
    return None


def download_url(session: requests.Session, url: str) -> tuple[Path | None, dict[str, str]]:
    existing = local_existing_resource(url)
    if existing is not None:
        return existing, {
            'mode': 'existing-local',
            'final_url': url,
            'content_type': mimetypes.guess_type(existing.name)[0] or '',
        }

    try:
        response = session.get(url, timeout=45, allow_redirects=True)
        response.raise_for_status()
    except Exception as exc:
        return None, {
            'mode': 'failed',
            'final_url': url,
            'content_type': '',
            'error': str(exc),
        }

    content_type = (response.headers.get('content-type') or '').split(';', 1)[0].strip().lower()
    final_url = response.url
    local_path = path_for_download(final_url, content_type)
    local_path.parent.mkdir(parents=True, exist_ok=True)
    local_path.write_bytes(response.content)
    return local_path, {
        'mode': 'downloaded',
        'final_url': final_url,
        'content_type': content_type,
    }


def path_for_download(url: str, content_type: str) -> Path:
    parsed = urllib.parse.urlsplit(url)
    parts = [part for part in parsed.path.split('/') if part]
    filename = parts[-1] if parts else 'index'
    parent_parts = parts[:-1]
    suffix = Path(filename).suffix
    if not suffix:
        guessed = mimetypes.guess_extension(content_type or '') or ''
        if guessed == '.jpe':
            guessed = '.jpg'
        if not guessed and content_type == 'text/html':
            guessed = '.html'
        if not guessed and content_type == 'text/plain':
            guessed = '.txt'
        if not guessed and content_type == 'application/json':
            guessed = '.json'
        if not guessed:
            guessed = '.bin'
        filename = filename + guessed
    if parsed.query:
        digest = hashlib.sha1(parsed.query.encode('utf-8')).hexdigest()[:10]
        base = Path(filename).stem
        ext = Path(filename).suffix
        filename = f'{base}__{digest}{ext}'
    return FILES_ROOT.joinpath(parsed.netloc, *parent_parts, filename)


def build_index(manifest: dict) -> str:
    by_domain: dict[str, list[dict]] = defaultdict(list)
    for item in manifest['items']:
        by_domain[item['domain']].append(item)

    lines = [
        '# Markdown Link Archive',
        '',
        '这个目录保存仓库内 Markdown 文档引用到的外部网页、文件和资源快照。',
        '',
        '## 统计',
        '',
        f"- 唯一外链总数：{manifest['summary']['total_urls']}",
        f"- 已映射到仓库内现有资料：{manifest['summary']['existing_local']}",
        f"- 新下载快照：{manifest['summary']['downloaded']}",
        f"- 下载失败：{manifest['summary']['failed']}",
        '',
        '## 说明',
        '',
        '- `files/` 保存真实下载下来的网页或文件。',
        '- 官方 `docs.flipper.net` 与 `developer.flipper.net` 会优先指向仓库内已有镜像。',
        '- 完整元数据见 `manifest.json`。',
        '',
        '## 按域名索引',
        '',
    ]
    for domain in sorted(by_domain):
        lines.append(f'### {domain}')
        lines.append('')
        for item in sorted(by_domain[domain], key=lambda x: x['url']):
            path = item.get('archive_path') or '下载失败'
            lines.append(f"- 原始链接：`{item['url']}`")
            lines.append(f"  - 存档：`{path}`")
            lines.append(f"  - 模式：`{item['mode']}`")
            lines.append(f"  - 来源 Markdown：`{item['source_markdowns'][0]}`" + (f" 等 {len(item['source_markdowns'])} 个文件" if len(item['source_markdowns']) > 1 else ''))
        lines.append('')
    return '\n'.join(lines)


def main() -> int:
    ARCHIVE_ROOT.mkdir(parents=True, exist_ok=True)
    FILES_ROOT.mkdir(parents=True, exist_ok=True)
    urls = extract_urls()
    session = requests.Session()
    session.headers.update({'User-Agent': USER_AGENT})

    items = []
    summary = {'total_urls': len(urls), 'existing_local': 0, 'downloaded': 0, 'failed': 0}

    for url in sorted(urls):
        path, meta = download_url(session, url)
        if meta['mode'] == 'existing-local':
            summary['existing_local'] += 1
        elif meta['mode'] == 'downloaded':
            summary['downloaded'] += 1
        else:
            summary['failed'] += 1
        archive_path = str(path.relative_to(ROOT)) if path is not None and path.is_relative_to(ROOT) else None
        items.append({
            'url': url,
            'domain': urllib.parse.urlsplit(url).netloc.lower(),
            'archive_path': archive_path,
            'mode': meta['mode'],
            'content_type': meta.get('content_type', ''),
            'final_url': meta.get('final_url', url),
            'error': meta.get('error', ''),
            'source_markdowns': sorted(urls[url]),
        })

    manifest = {
        'created_at': time.strftime('%Y-%m-%d %H:%M:%S'),
        'summary': summary,
        'items': items,
    }
    MANIFEST_PATH.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')
    INDEX_PATH.write_text(build_index(manifest), encoding='utf-8')
    print(json.dumps(summary, ensure_ascii=False, indent=2))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
