#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
import mimetypes
import os
import re
import shutil
import time
import urllib.parse
from pathlib import Path

import requests
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
SOURCE_ROOT = ROOT / 'Wiki-Resources' / 'Official-Web-Snapshots' / 'Flipper-Official-Docs-Snapshot-2026-03-24'
OUTPUT_ROOT = ROOT / 'Wiki-Resources' / 'Deployable-Web-Mirror' / 'Flipper-Official-Docs'
EXTERNAL_ROOT = OUTPUT_ROOT / '_external'
USER_AGENT = (
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) '
    'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36'
)

ASSET_TAG_ATTRS = {
    'img': ('src', 'srcset'),
    'source': ('src', 'srcset'),
    'video': ('poster',),
    'audio': ('src',),
    'link': ('href',),
}

REMOVE_LINK_RELS = {
    'preconnect',
    'dns-prefetch',
    'preload',
    'modulepreload',
    'prefetch',
}

REMOVE_SCRIPT_HOSTS = {
    'static.cloudflareinsights.com',
    'js.monitor.azure.com',
    'www.googletagmanager.com',
    'connect.facebook.net',
    'analytics.tiktok.com',
    'www.clarity.ms',
}

DROP_HOSTS_ENTIRELY = {
    'static.cloudflareinsights.com',
    'js.monitor.azure.com',
    'www.googletagmanager.com',
    'connect.facebook.net',
    'analytics.tiktok.com',
    'www.clarity.ms',
    'eastus-8.in.applicationinsights.azure.com',
    'api.archbee.com',
    'cdn-cgi',
}

CSS_URL_RE = re.compile(r'url\((?P<quote>["\']?)(?P<url>[^)"\']+)(?P=quote)\)')
CSS_IMPORT_RE = re.compile(r'@import\s+(?:url\()?\s*["\']?(?P<url>[^)"\';]+)["\']?\s*\)?')
ABS_URL_RE = re.compile(r'^https?://', re.IGNORECASE)
RAW_ASSET_ATTR_RE = re.compile(r'(?P<attr>href|src)="(?P<url>https://(?:fonts\.googleapis\.com|fonts\.gstatic\.com|cdnjs\.cloudflare\.com|unpkg\.com|cdn\.archbee\.com|cdn\.flipperzero\.one|cdn\.flipper\.net)[^"]+)"')


class MirrorBuilder:
    def __init__(self) -> None:
        self.session = requests.Session()
        self.session.headers.update({'User-Agent': USER_AGENT})
        self.download_cache: dict[str, Path | None] = {}
        self.css_processed: set[Path] = set()
        self.asset_manifest: list[dict[str, str]] = []
        self.link_rewrites = 0
        self.asset_rewrites = 0

    def run(self) -> None:
        if OUTPUT_ROOT.exists():
            shutil.rmtree(OUTPUT_ROOT)
        shutil.copytree(SOURCE_ROOT, OUTPUT_ROOT)
        EXTERNAL_ROOT.mkdir(parents=True, exist_ok=True)

        for html_path in sorted(OUTPUT_ROOT.rglob('*.html')):
            self.process_html(html_path)

        for css_path in sorted(OUTPUT_ROOT.rglob('*.css')):
            self.process_css_file(css_path)

        self.write_support_files()

    def write_support_files(self) -> None:
        manifest = {
            'created_at': time.strftime('%Y-%m-%d %H:%M:%S'),
            'source_root': str(SOURCE_ROOT.relative_to(ROOT)),
            'output_root': str(OUTPUT_ROOT.relative_to(ROOT)),
            'asset_downloads': self.asset_manifest,
            'link_rewrites': self.link_rewrites,
            'asset_rewrites': self.asset_rewrites,
        }
        (OUTPUT_ROOT / 'deployable-mirror-manifest.json').write_text(
            json.dumps(manifest, ensure_ascii=False, indent=2),
            encoding='utf-8',
        )
        readme = '''# Flipper Official Docs Deployable Mirror

这个目录是面向静态托管的可部署版本，目标是：

- 不依赖原始站点的运行时脚本
- 尽量把渲染所需的样式、图片、字体等资源本地化
- 可以直接放到 GitHub Pages、Netlify、Vercel 或任意静态文件服务器

## 入口

- `docs.flipper.net/index.html`
- `developer.flipper.net/flipperzero/doxygen/index.html`

## 部署方式

任意静态服务器都可以，例如：

```bash
cd Wiki-Resources/Deployable-Web-Mirror/Flipper-Official-Docs
python3 -m http.server 8000
```

然后打开：

- `http://127.0.0.1:8000/docs.flipper.net/index.html`
- `http://127.0.0.1:8000/developer.flipper.net/flipperzero/doxygen/index.html`

## 说明

- 这是“可部署阅读镜像”，不是官方源站本身。
- 为了保证静态托管可用，已经移除了大量第三方脚本、统计脚本和动态运行时依赖。
- 内容页里的外部超链接仍然保留原始目标；它们不会阻止页面部署和阅读。
- 具体改写记录见 `deployable-mirror-manifest.json`。
'''
        (OUTPUT_ROOT / 'README.md').write_text(readme, encoding='utf-8')
        index_html = '''<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Flipper Official Docs Deployable Mirror</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; margin: 40px; line-height: 1.6; color: #111; }
    h1 { margin-bottom: 8px; }
    ul { padding-left: 20px; }
    a { color: #0b57d0; text-decoration: none; }
    a:hover { text-decoration: underline; }
    code { background: #f4f4f4; padding: 2px 6px; border-radius: 4px; }
  </style>
</head>
<body>
  <h1>Flipper Official Docs Deployable Mirror</h1>
  <p>这是适合静态部署的官方资料镜像入口。</p>
  <ul>
    <li><a href="docs.flipper.net/index.html">User Docs Mirror</a></li>
    <li><a href="developer.flipper.net/flipperzero/doxygen/index.html">Developer Docs Mirror</a></li>
    <li><a href="README.md">部署说明</a></li>
  </ul>
</body>
</html>
'''
        (OUTPUT_ROOT / 'index.html').write_text(index_html, encoding='utf-8')

    def process_html(self, path: Path) -> None:
        text = path.read_text(encoding='utf-8', errors='ignore')
        soup = BeautifulSoup(text, 'html.parser')
        domain = path.relative_to(OUTPUT_ROOT).parts[0]

        if domain == 'docs.flipper.net':
            for script in list(soup.find_all('script')):
                script.decompose()
            for link in list(soup.find_all('link')):
                rels = {part.lower() for part in (link.get('rel') or [])}
                if rels & REMOVE_LINK_RELS:
                    link.decompose()
            for tag in list(soup.find_all(['iframe', 'noscript'])):
                if tag.name == 'iframe':
                    tag.decompose()
            self.remove_inline_analytics(soup)
            for tag in soup.find_all(True):
                if tag.has_attr('style') and 'visibility:hidden' in tag['style'].replace(' ', '').lower():
                    cleaned = re.sub(r'visibility\s*:\s*hidden\s*;?', '', tag['style'], flags=re.IGNORECASE).strip()
                    if cleaned:
                        tag['style'] = cleaned
                    else:
                        del tag['style']

        for tag in soup.find_all(True):
            if tag.name == 'a' and tag.has_attr('href'):
                new_href = self.rewrite_page_link(tag['href'], path, domain)
                if new_href != tag['href']:
                    tag['href'] = new_href
                    self.link_rewrites += 1
                continue

            attrs = ASSET_TAG_ATTRS.get(tag.name, ())
            for attr in attrs:
                if not tag.has_attr(attr):
                    continue
                old_value = tag[attr]
                new_value = self.rewrite_asset_attr(tag, attr, old_value, path, domain)
                if new_value != old_value:
                    tag[attr] = new_value
                    self.asset_rewrites += 1

            if tag.has_attr('style'):
                old_style = tag['style']
                new_style = self.rewrite_css_text(old_style, path, domain)
                if new_style != old_style:
                    tag['style'] = new_style
                    self.asset_rewrites += 1

        for style in soup.find_all('style'):
            if style.string:
                new_css = self.rewrite_css_text(style.string, path, domain)
                if new_css != style.string:
                    style.string.replace_with(new_css)
                    self.asset_rewrites += 1

        html_text = str(soup)
        html_text = self.rewrite_remaining_asset_attrs(html_text, path, domain)
        path.write_text(html_text, encoding='utf-8')


    def rewrite_remaining_asset_attrs(self, html_text: str, current_path: Path, current_domain: str) -> str:
        def replace(match: re.Match[str]) -> str:
            url = match.group('url')
            new_url = self.rewrite_asset_url(url, current_path, current_domain, prefer_local_page=False)
            return f"{match.group('attr')}=\"{new_url}\""

        return RAW_ASSET_ATTR_RE.sub(replace, html_text)

    def process_css_file(self, path: Path) -> None:
        if path in self.css_processed:
            return
        self.css_processed.add(path)
        text = path.read_text(encoding='utf-8', errors='ignore')
        domain = path.relative_to(OUTPUT_ROOT).parts[0] if path.is_relative_to(OUTPUT_ROOT) else 'docs.flipper.net'
        new_text = self.rewrite_css_text(text, path, domain)
        if new_text != text:
            path.write_text(new_text, encoding='utf-8')

    def remove_inline_analytics(self, soup: BeautifulSoup) -> None:
        for tag in list(soup.find_all(['meta', 'link'])):
            for attr in ('content', 'href'):
                value = tag.get(attr)
                if not value:
                    continue
                if any(host in value for host in DROP_HOSTS_ENTIRELY):
                    tag.decompose()
                    break

    def rewrite_asset_attr(self, tag, attr: str, value: str, path: Path, domain: str) -> str:
        tag_name = tag.name
        if attr == 'srcset':
            parts = []
            changed = False
            for item in value.split(','):
                item = item.strip()
                if not item:
                    continue
                pieces = item.split()
                url = pieces[0]
                descriptor = ' '.join(pieces[1:])
                new_url = self.rewrite_asset_url(url, path, domain, prefer_local_page=False)
                if new_url != url:
                    changed = True
                parts.append(' '.join([new_url, descriptor]).strip())
            return ', '.join(parts) if changed else value
        if tag_name == 'link' and attr == 'href':
            rels = {part.lower() for part in (tag.get('rel') or [])}
            asset_rels = {'stylesheet', 'icon', 'apple-touch-icon', 'manifest', 'shortcut', 'alternate'}
            prefer_local = not bool(rels & asset_rels)
            return self.rewrite_asset_url(value, path, domain, prefer_local_page=prefer_local)
        return self.rewrite_asset_url(value, path, domain, prefer_local_page=False)

    def rewrite_asset_url(
        self,
        raw_url: str,
        current_path: Path,
        current_domain: str,
        *,
        prefer_local_page: bool,
        allow_external_content: bool = False,
    ) -> str:
        url = self.normalize_url(raw_url, current_domain)
        if not url:
            return raw_url
        parsed = urllib.parse.urlsplit(url)
        host = parsed.netloc.lower()

        if host in DROP_HOSTS_ENTIRELY:
            return ''

        if host in {'docs.flipper.net', 'developer.flipper.net'}:
            local_target = self.find_local_page(url)
            if local_target is not None:
                return self.relative_href(current_path, local_target)
            if allow_external_content:
                return raw_url

        if prefer_local_page and not self.is_probable_asset_url(url):
            local_target = self.find_local_page(url)
            if local_target is not None:
                return self.relative_href(current_path, local_target)
            return raw_url

        if not ABS_URL_RE.match(url):
            return raw_url

        local_asset = self.download_external_asset(url)
        if local_asset is None:
            return raw_url
        return self.relative_href(current_path, local_asset)

    def rewrite_page_link(self, raw_url: str, current_path: Path, current_domain: str) -> str:
        url = self.normalize_url(raw_url, current_domain)
        if not url:
            return raw_url
        parsed = urllib.parse.urlsplit(url)
        host = parsed.netloc.lower()
        if host in {'docs.flipper.net', 'developer.flipper.net'}:
            local_target = self.find_local_page(url)
            if local_target is not None:
                return self.relative_href(current_path, local_target)
        return raw_url

    def rewrite_css_text(self, text: str, current_path: Path, current_domain: str) -> str:
        def replace_import(match: re.Match[str]) -> str:
            url = match.group('url').strip()
            new_url = self.rewrite_asset_url(url, current_path, current_domain, prefer_local_page=False)
            return match.group(0).replace(url, new_url)

        def replace_url(match: re.Match[str]) -> str:
            url = match.group('url').strip()
            if url.startswith('data:') or url.startswith('blob:'):
                return match.group(0)
            new_url = self.rewrite_asset_url(url, current_path, current_domain, prefer_local_page=False)
            quote = match.group('quote') or ''
            return f'url({quote}{new_url}{quote})'

        text = CSS_IMPORT_RE.sub(replace_import, text)
        text = CSS_URL_RE.sub(replace_url, text)
        return text

    def download_external_asset(self, url: str) -> Path | None:
        if url in self.download_cache:
            return self.download_cache[url]
        parsed = urllib.parse.urlsplit(url)
        host = parsed.netloc.lower()
        if host in DROP_HOSTS_ENTIRELY:
            self.download_cache[url] = None
            return None
        try:
            response = self.session.get(url, timeout=45)
            response.raise_for_status()
        except Exception:
            self.download_cache[url] = None
            return None

        content_type = (response.headers.get('content-type') or '').split(';', 1)[0].strip().lower()
        local_path = self.external_path_for_url(url, content_type)
        local_path.parent.mkdir(parents=True, exist_ok=True)
        local_path.write_bytes(response.content)
        self.download_cache[url] = local_path
        self.asset_manifest.append({
            'url': url,
            'path': str(local_path.relative_to(OUTPUT_ROOT)),
            'content_type': content_type,
        })
        if local_path.suffix == '.css':
            self.process_css_file(local_path)
        return local_path

    def external_path_for_url(self, url: str, content_type: str) -> Path:
        parsed = urllib.parse.urlsplit(url)
        suffix = Path(parsed.path).suffix
        if not suffix:
            guessed = mimetypes.guess_extension(content_type or '') or ''
            if guessed == '.jpe':
                guessed = '.jpg'
            if not guessed and content_type == 'text/css':
                guessed = '.css'
            if not guessed and content_type == 'application/javascript':
                guessed = '.js'
            if not guessed and content_type.startswith('font/'):
                guessed = '.bin'
            suffix = guessed or '.bin'
        digest = hashlib.sha1(url.encode('utf-8')).hexdigest()
        name_part = Path(parsed.path).stem or 'resource'
        safe_name = re.sub(r'[^A-Za-z0-9._-]+', '-', name_part).strip('-')[:48] or 'resource'
        filename = f'{safe_name}__{digest[:16]}{suffix}'
        return EXTERNAL_ROOT / parsed.netloc / digest[:2] / filename

    def normalize_url(self, raw_url: str, current_domain: str) -> str | None:
        value = (raw_url or '').strip()
        if not value:
            return None
        if value.startswith(('data:', 'mailto:', 'tel:', 'javascript:', '#', 'blob:')):
            return None
        if value.startswith('//'):
            value = 'https:' + value
        if value.startswith('/'):
            value = urllib.parse.urljoin(f'https://{current_domain}/', value)
        return value

    def find_local_page(self, url: str) -> Path | None:
        parsed = urllib.parse.urlsplit(url)
        host = parsed.netloc.lower()
        rel_candidates: list[Path] = []
        raw_path = parsed.path or '/'
        if raw_path == '/':
            rel_candidates.append(Path(host) / 'index.html')
        else:
            stripped = raw_path.lstrip('/')
            rel_candidates.append(Path(host) / stripped)
            if raw_path.endswith('/'):
                rel_candidates.append(Path(host) / stripped / 'index.html')
            else:
                rel_candidates.append(Path(host) / (stripped + '.html'))
                rel_candidates.append(Path(host) / stripped / 'index.html')
        for candidate in rel_candidates:
            full = OUTPUT_ROOT / candidate
            if full.exists() and full.is_file():
                return full
        return None

    def relative_href(self, current_path: Path, target_path: Path) -> str:
        return os.path.relpath(target_path, start=current_path.parent).replace(os.sep, '/')

    def is_probable_asset_url(self, url: str) -> bool:
        parsed = urllib.parse.urlsplit(url)
        suffix = Path(parsed.path).suffix.lower()
        if suffix in {
            '.css', '.js', '.mjs', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico',
            '.woff', '.woff2', '.ttf', '.eot', '.map', '.json', '.xml', '.txt', '.pdf', '.mp4', '.webm',
        }:
            return True
        return any(part in parsed.path for part in ['_next/static', '/cdn/', '/assets/', '/fonts/'])


def main() -> int:
    builder = MirrorBuilder()
    builder.run()
    print(OUTPUT_ROOT)
    print(json.dumps({
        'asset_downloads': len(builder.asset_manifest),
        'link_rewrites': builder.link_rewrites,
        'asset_rewrites': builder.asset_rewrites,
    }, ensure_ascii=False, indent=2))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
