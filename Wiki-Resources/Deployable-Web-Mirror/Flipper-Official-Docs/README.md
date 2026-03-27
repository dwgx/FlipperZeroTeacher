# Flipper Official Docs Deployable Mirror

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
