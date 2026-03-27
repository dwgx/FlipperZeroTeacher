#!/usr/bin/env python3
"""将 Markdown 文件转换为带样式的 HTML 页面"""

import os
import re
import glob

TEMPLATE = '''<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} - Flipper Zero 知识库</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        :root {{ --bg: #0d1117; --card: #161b22; --border: #30363d; --text: #e6edf3; --muted: #8b949e; --accent: #ff6b35; --accent2: #00d4aa; }}
        body {{ font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); padding: 40px 20px; line-height: 1.7; }}
        .container {{ max-width: 800px; margin: 0 auto; }}
        a {{ color: var(--accent); text-decoration: none; }}
        a:hover {{ text-decoration: underline; }}
        .back {{ display: inline-flex; align-items: center; gap: 8px; color: var(--muted); font-size: 14px; margin-bottom: 30px; }}
        .back:hover {{ color: var(--accent); }}
        h1 {{ font-size: 28px; margin-bottom: 8px; }}
        h1 span {{ color: var(--accent); }}
        .subtitle {{ color: var(--muted); margin-bottom: 30px; }}
        .nav {{ display: flex; gap: 12px; margin-top: 40px; padding-top: 20px; border-top: 1px solid var(--border); justify-content: space-between; }}
        .nav a {{ display: flex; align-items: center; gap: 6px; padding: 10px 16px; background: var(--card); border-radius: 8px; font-size: 14px; }}
        .nav a:hover {{ background: var(--border); }}
        .content {{ background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 30px; }}
        .content h2 {{ font-size: 20px; margin: 24px 0 12px; color: var(--accent); }}
        .content h3 {{ font-size: 16px; margin: 20px 0 10px; }}
        .content p {{ margin: 12px 0; color: var(--muted); }}
        .content ul, .content ol {{ margin: 12px 0; padding-left: 24px; }}
        .content li {{ margin: 8px 0; color: var(--muted); }}
        .content code {{ background: var(--bg); padding: 2px 6px; border-radius: 4px; font-size: 13px; }}
        .content pre {{ background: var(--bg); padding: 16px; border-radius: 8px; overflow-x: auto; margin: 12px 0; }}
        .content table {{ width: 100%; border-collapse: collapse; margin: 12px 0; }}
        .content th, .content td {{ padding: 10px; border: 1px solid var(--border); text-align: left; }}
        .content th {{ background: var(--bg); }}
        .content blockquote {{ border-left: 3px solid var(--accent); padding-left: 16px; margin: 12px 0; color: var(--muted); }}
    </style>
</head>
<body>
    <div class="container">
        <a href="index.html" class="back">← 返回课程导航</a>
        <h1>{header} <span>{title}</span></h1>
        <p class="subtitle">{description}</p>

        <div class="content">
{body}
        </div>

        <div class="nav">
            {prev_link}
            {next_link}
        </div>
    </div>
</body>
</html>'''

def extract_frontmatter(content):
    """提取标题和描述"""
    lines = content.split('\n')
    title = "内容"
    header = ""
    for i, line in enumerate(lines):
        if line.startswith('# '):
            title = line[2:].strip()
            header = title.split()[0] if title.split() else ""
            break
    return title, header

def convert_md_to_html(content):
    """简单 Markdown 转 HTML"""
    html = []

    for line in content.split('\n'):
        line = line.strip()
        if not line:
            html.append('')
            continue

        # 标题
        if line.startswith('#### '):
            html.append(f'<h4>{line[5:]}</h4>')
        elif line.startswith('### '):
            html.append(f'<h3>{line[4:]}</h3>')
        elif line.startswith('## '):
            html.append(f'<h2>{line[3:]}</h2>')
        elif line.startswith('# '):
            continue  # 主标题单独处理
        # 列表
        elif line.startswith('- ') or line.startswith('* '):
            html.append(f'<li>{line[2:]}</li>')
        elif re.match(r'^\d+\. ', line):
            html.append(f'<li>{line.split(". ", 1)[1]}</li>')
        # 引用
        elif line.startswith('> '):
            html.append(f'<blockquote>{line[2:]}</blockquote>')
        # 表格 - 简单处理
        elif '|' in line and '---' not in line:
            cells = [c.strip() for c in line.split('|') if c.strip()]
            if cells:
                html.append(f'<tr>{"".join(f"<td>{c}</td>" for c in cells)}</tr>')
        # 强调
        elif '**' in line:
            line = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', line)
            html.append(f'<p>{line}</p>')
        # 普通段落
        else:
            # 代码
            if line.startswith('```'):
                continue
            html.append(f'<p>{line}</p>')

    return '\n'.join(html)

def process_file(md_file, files_list, index):
    """处理单个文件"""
    with open(md_file, 'r', encoding='utf-8') as f:
        content = f.read()

    title, header = extract_frontmatter(content)

    # 提取描述 (第二段)
    desc_lines = [l.strip() for l in content.split('\n') if l.strip() and not l.startswith('#')]
    description = desc_lines[1] if len(desc_lines) > 1 else desc_lines[0] if desc_lines else ""

    body = convert_md_to_html(content)

    # 导航链接
    prev_link = f'<a href="{files_list[index-1].replace(".md", ".html")}">← 上一章</a>' if index > 0 else '<span></span>'
    next_link = f'<a href="{files_list[index+1].replace(".md", ".html")}">下一章 →</a>' if index < len(files_list)-1 else '<span></span>'

    html = TEMPLATE.format(
        title=title,
        header=header,
        description=description[:100] + "..." if len(description) > 100 else description,
        body=body,
        prev_link=prev_link,
        next_link=next_link
    )

    html_file = md_file.replace('.md', '.html')
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"✓ {html_file}")

# 主目录
guide_dir = "CN/Guide"
md_files = sorted([f for f in os.listdir(guide_dir) if f.endswith('.md') and f != 'README.md'])
print(f"转换 {len(md_files)} 个文件...")

for i, f in enumerate(md_files):
    process_file(os.path.join(guide_dir, f), md_files, i)

print("完成！")