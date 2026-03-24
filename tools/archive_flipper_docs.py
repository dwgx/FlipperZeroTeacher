#!/usr/bin/env python3
from __future__ import annotations

import collections
import html
import json
import posixpath
import re
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path
from html.parser import HTMLParser

UA = (
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) '
    'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36'
)

RESOURCE_ATTRS = {
    'a': ('href',),
    'link': ('href',),
    'script': ('src',),
    'img': ('src', 'srcset'),
    'source': ('src', 'srcset'),
    'iframe': ('src',),
}

RESOURCE_EXTS = {
    '.css', '.js', '.mjs', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico',
    '.woff', '.woff2', '.ttf', '.eot', '.map', '.json', '.xml', '.txt', '.pdf', '.webm',
    '.mp4', '.avif', '.wasm'
}

SKIP_SCHEMES = ('mailto:', 'tel:', 'javascript:', 'data:')


class LinkCollector(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.links: list[str] = []

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        for attr in RESOURCE_ATTRS.get(tag, ()):
            value = attrs_dict.get(attr)
            if not value:
                continue
            if attr == 'srcset':
                for part in value.split(','):
                    src = part.strip().split(' ')[0]
                    if src:
                        self.links.append(html.unescape(src))
            else:
                self.links.append(html.unescape(value))


def normalize_url(base: str, raw: str) -> str | None:
    raw = raw.strip()
    if not raw or raw.startswith(SKIP_SCHEMES):
        return None
    url = urllib.parse.urljoin(base, raw)
    parsed = urllib.parse.urlsplit(url)
    if parsed.scheme not in ('http', 'https'):
        return None
    normalized = parsed._replace(fragment='').geturl()
    return normalized


def is_html_url(url: str) -> bool:
    parsed = urllib.parse.urlsplit(url)
    path = parsed.path or '/'
    if path.endswith('/'):
        return True
    suffix = Path(path).suffix.lower()
    return suffix in ('', '.html', '.htm')


def local_path_for_url(output_root: Path, url: str, content_type: str | None) -> Path:
    parsed = urllib.parse.urlsplit(url)
    host = parsed.netloc
    path = parsed.path or '/'
    if path.endswith('/') or path == '':
        path = path + 'index.html'
    else:
        suffix = Path(path).suffix.lower()
        if not suffix:
            if content_type and 'text/html' in content_type:
                path = path + '.html'
            else:
                path = path + '.bin'
    local = output_root / host / path.lstrip('/').replace('?', '_')
    return local


def should_recurse_page(url: str, page_prefixes: list[str]) -> bool:
    return any(url.startswith(prefix) for prefix in page_prefixes)


def should_fetch_resource(url: str, allowed_hosts: set[str]) -> bool:
    parsed = urllib.parse.urlsplit(url)
    return parsed.netloc in allowed_hosts


def crawl_site(name: str, seeds: list[str], page_prefixes: list[str], allowed_hosts: set[str], output_root: Path, max_pages: int = 5000, delay: float = 0.15) -> dict:
    opener = urllib.request.build_opener()
    opener.addheaders = [('User-Agent', UA)]

    queue = collections.deque(seeds)
    seen_pages: set[str] = set()
    seen_resources: set[str] = set()
    fetched: list[dict] = []
    pages = 0
    resources = 0
    failures: list[dict] = []

    while queue:
        url = queue.popleft()
        if url in seen_pages:
            continue
        if pages >= max_pages:
            break
        seen_pages.add(url)
        try:
            with opener.open(url, timeout=30) as resp:
                body = resp.read()
                content_type = resp.headers.get('Content-Type', '')
                local_path = local_path_for_url(output_root, url, content_type)
                local_path.parent.mkdir(parents=True, exist_ok=True)
                local_path.write_bytes(body)
                fetched.append({'url': url, 'path': str(local_path.relative_to(output_root)), 'content_type': content_type})
                pages += 1
                if 'text/html' not in content_type:
                    continue
                parser = LinkCollector()
                parser.feed(body.decode('utf-8', 'replace'))
                for raw in parser.links:
                    normalized = normalize_url(url, raw)
                    if not normalized:
                        continue
                    if is_html_url(normalized) and should_recurse_page(normalized, page_prefixes):
                        if normalized not in seen_pages:
                            queue.append(normalized)
                    else:
                        if should_fetch_resource(normalized, allowed_hosts) and normalized not in seen_resources:
                            seen_resources.add(normalized)
                time.sleep(delay)
        except Exception as exc:
            failures.append({'url': url, 'error': str(exc)})

    for url in sorted(seen_resources):
        try:
            with opener.open(url, timeout=30) as resp:
                body = resp.read()
                content_type = resp.headers.get('Content-Type', '')
                local_path = local_path_for_url(output_root, url, content_type)
                local_path.parent.mkdir(parents=True, exist_ok=True)
                local_path.write_bytes(body)
                fetched.append({'url': url, 'path': str(local_path.relative_to(output_root)), 'content_type': content_type})
                resources += 1
                time.sleep(delay)
        except Exception as exc:
            failures.append({'url': url, 'error': str(exc)})

    return {
        'name': name,
        'pages': pages,
        'resources': resources,
        'failures': failures,
        'fetched_count': len(fetched),
        'sample': fetched[:20],
    }


def main() -> int:
    date = time.strftime('%Y-%m-%d')
    root = Path('Wiki-Resources') / 'Official-Web-Snapshots' / f'Flipper-Official-Docs-Snapshot-{date}'
    root.mkdir(parents=True, exist_ok=True)

    docs_summary = crawl_site(
        name='docs.flipper.net',
        seeds=['https://docs.flipper.net/'],
        page_prefixes=['https://docs.flipper.net/'],
        allowed_hosts={'docs.flipper.net', 'static-2v.gitbook.com', 'static-1v.gitbook.com', 'images.ctfassets.net', 'cdn.jsdelivr.net'},
        output_root=root,
        max_pages=2500,
        delay=0.1,
    )

    dev_summary = crawl_site(
        name='developer.flipper.net/flipperzero/doxygen',
        seeds=['https://developer.flipper.net/flipperzero/doxygen/index.html'],
        page_prefixes=['https://developer.flipper.net/flipperzero/doxygen/'],
        allowed_hosts={'developer.flipper.net'},
        output_root=root,
        max_pages=5000,
        delay=0.05,
    )

    manifest = {
        'created_at': time.strftime('%Y-%m-%d %H:%M:%S'),
        'snapshot_root': str(root),
        'summaries': [docs_summary, dev_summary],
    }
    (root / 'snapshot-manifest.json').write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding='utf-8')

    readme = f'''# Flipper Zero Official Docs Snapshot\n\nThis folder stores a local snapshot of the official Flipper Zero documentation sites for long-term preservation.\n\n## Snapshot Date\n\n- {date}\n\n## Included Sites\n\n- `docs.flipper.net/`\n- `developer.flipper.net/flipperzero/doxygen/`\n\n## Notes\n\n- This snapshot is intended for preservation and reference.\n- Some dynamic behavior may not work exactly the same offline.\n- The source of truth remains the official sites when they are available.\n- See `snapshot-manifest.json` for crawl details and failures.\n'''
    (root / 'README.md').write_text(readme, encoding='utf-8')

    print(root)
    print(json.dumps(manifest, ensure_ascii=False, indent=2))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
