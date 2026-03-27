(function () {
    const body = document.body;
    if (!body) return;

    const queryFile = new URLSearchParams(window.location.search).get("file");
    const siteRoot = body.dataset.siteRoot || "./";
    const repoPath = body.dataset.repoPath || (queryFile ? decodeURIComponent(queryFile) : "");
    const fetchPath = body.dataset.fetch || repoPath;
    const pageTitle = document.getElementById("docTitle");
    const pageLead = document.getElementById("docLead");
    const pageEyebrow = document.getElementById("docEyebrow");
    const pagePath = document.getElementById("docPath");
    const pageMode = document.getElementById("docMode");
    const sourceLink = document.getElementById("sourceLink");
    const content = document.getElementById("docContent");
    const toc = document.getElementById("docToc");
    const pager = document.getElementById("docPager");

    const manifest = Array.isArray(window.GUIDE_MANIFEST) ? window.GUIDE_MANIFEST : [];
    const manifestMap = new Map(manifest.map((item) => [item.path, item]));

    const navLinePattern = /^\s*(\[[^\]]+\]\([^)]+\)\s*(\|\s*\[[^\]]+\]\([^)]+\)\s*)+)\s*$/;

    function normalizePath(path) {
        const parts = [];
        path.split("/").forEach((part) => {
            if (!part || part === ".") return;
            if (part === "..") {
                parts.pop();
                return;
            }
            parts.push(part);
        });
        return parts.join("/");
    }

    function dirname(path) {
        const normalized = normalizePath(path);
        const index = normalized.lastIndexOf("/");
        return index === -1 ? "" : normalized.slice(0, index);
    }

    function resolvePath(baseDir, target) {
        if (!target) return normalizePath(baseDir);
        if (/^[a-z]+:/i.test(target) || target.startsWith("//")) return target;
        if (target.startsWith("/")) return target.replace(/^\/+/, "");
        return normalizePath([baseDir, target].filter(Boolean).join("/"));
    }

    function slugify(input) {
        return input
            .toString()
            .trim()
            .toLowerCase()
            .replace(/[【】()[\]{}：:、，,。.!?'"`]+/g, " ")
            .replace(/\s+/g, "-")
            .replace(/^-+|-+$/g, "");
    }

    function stripDecorativeNav(markdown) {
        const lines = markdown.split("\n");
        while (lines.length && navLinePattern.test(lines[0].trim())) {
            lines.shift();
            while (lines[0] === "") lines.shift();
        }
        while (lines.length && navLinePattern.test(lines[lines.length - 1].trim())) {
            lines.pop();
            while (lines[lines.length - 1] === "") lines.pop();
        }
        return lines.join("\n");
    }

    function extractLead(markdown, fallback) {
        if (fallback) return fallback;
        const lines = markdown.split("\n");
        let inCode = false;
        for (const rawLine of lines) {
            const line = rawLine.trim();
            if (line.startsWith("```")) {
                inCode = !inCode;
                continue;
            }
            if (inCode || !line) continue;
            if (line.startsWith("#") || line.startsWith(">") || line.startsWith("|")) continue;
            if (navLinePattern.test(line)) continue;
            if (line.startsWith("- ") || /^\d+\.\s/.test(line)) continue;
            return line;
        }
        return "这里展示的是 Markdown 单源文档，页面会在浏览器中实时渲染成阅读模式。";
    }

    function toViewerHref(path, hash) {
        return `${siteRoot}viewer.html?file=${encodeURIComponent(path)}${hash ? `#${slugify(decodeURIComponent(hash))}` : ""}`;
    }

    function toDocHref(path, hash) {
        if (path === "CN/Guide/README.md") {
            return `${siteRoot}CN/Guide/index.html${hash ? `#${slugify(decodeURIComponent(hash))}` : ""}`;
        }
        if (path.startsWith("CN/Guide/") && path.endsWith(".md")) {
            return `${siteRoot}${path.replace(/\.md$/i, ".html")}${hash ? `#${slugify(decodeURIComponent(hash))}` : ""}`;
        }
        if (path.toLowerCase().endsWith(".md")) {
            return toViewerHref(path, hash);
        }
        return `${siteRoot}${path}${hash ? `#${slugify(decodeURIComponent(hash))}` : ""}`;
    }

    function rewriteLinks(root, currentPath) {
        const baseDir = dirname(currentPath);
        root.querySelectorAll("a[href]").forEach((anchor) => {
            const rawHref = anchor.getAttribute("href");
            if (!rawHref) return;
            if (rawHref.startsWith("#")) {
                anchor.setAttribute("href", `#${slugify(rawHref.slice(1))}`);
                return;
            }
            if (/^[a-z]+:/i.test(rawHref) || rawHref.startsWith("//")) {
                anchor.setAttribute("target", "_blank");
                anchor.setAttribute("rel", "noreferrer");
                return;
            }
            const [relativePath, hash = ""] = rawHref.split("#");
            const resolved = resolvePath(baseDir, relativePath);
            anchor.setAttribute("href", toDocHref(resolved, hash));
        });
    }

    function installHeadingIds(root) {
        const seen = new Map();
        root.querySelectorAll("h1, h2, h3, h4").forEach((heading) => {
            const baseSlug = slugify(heading.textContent || "section") || "section";
            const count = seen.get(baseSlug) || 0;
            seen.set(baseSlug, count + 1);
            heading.id = count ? `${baseSlug}-${count + 1}` : baseSlug;
        });
    }

    function buildToc(root) {
        if (!toc) return;
        const headings = Array.from(root.querySelectorAll("h2, h3"));
        if (!headings.length) {
            toc.innerHTML = '<p class="empty-state">这页没有二级目录，适合直接顺着读。</p>';
            return;
        }
        toc.className = "toc-list";
        toc.innerHTML = headings
            .map((heading) => {
                const level = heading.tagName.toLowerCase();
                const padding = level === "h3" ? " style=\"padding-left:20px\"" : "";
                return `<a href="#${heading.id}"${padding}>${heading.textContent}</a>`;
            })
            .join("");
    }

    function activateTocOnScroll() {
        if (!toc) return;
        const links = Array.from(toc.querySelectorAll("a[href^='#']"));
        if (!links.length) return;
        const map = new Map(
            links.map((link) => {
                const heading = document.getElementById(link.getAttribute("href").slice(1));
                return [heading, link];
            }),
        );
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const link = map.get(entry.target);
                    if (!link) return;
                    if (entry.isIntersecting) {
                        links.forEach((item) => item.classList.remove("is-active"));
                        link.classList.add("is-active");
                    }
                });
            },
            { rootMargin: "-25% 0px -65% 0px", threshold: 0.1 },
        );
        map.forEach((link, heading) => {
            if (heading) observer.observe(heading);
        });
    }

    function renderPager(currentPath) {
        if (!pager) return;
        const current = manifestMap.get(currentPath);
        if (!current) {
            pager.innerHTML = [
                `<a class="pager-card" href="${siteRoot}index.html"><div class="pager-card-label">Home</div><div class="pager-card-title">返回站点首页</div><div class="pager-card-summary">继续从中文课程、主知识库、qFlipper 专题或官方镜像入口进入。</div></a>`,
                `<a class="pager-card" href="${siteRoot}CN/Guide/index.html"><div class="pager-card-label">Guide</div><div class="pager-card-title">进入中文教学导航</div><div class="pager-card-summary">如果你想按顺序学习，最稳的入口仍然是课程目录页。</div></a>`,
            ].join("");
            return;
        }
        const previous = manifest[current.order - 1];
        const next = manifest[current.order + 1];
        pager.innerHTML = [
            previous
                ? `<a class="pager-card" href="${siteRoot}${previous.html}"><div class="pager-card-label">上一章</div><div class="pager-card-title">${previous.title}</div><div class="pager-card-summary">${previous.summary}</div></a>`
                : `<div class="pager-card pager-card--empty"><div class="pager-card-label">上一章</div><div class="pager-card-title">已经是课程起点</div><div class="pager-card-summary">建议从这里开始建立整体阅读边界。</div></div>`,
            next
                ? `<a class="pager-card" href="${siteRoot}${next.html}"><div class="pager-card-label">下一章</div><div class="pager-card-title">${next.title}</div><div class="pager-card-summary">${next.summary}</div></a>`
                : `<div class="pager-card pager-card--empty"><div class="pager-card-label">下一章</div><div class="pager-card-title">已经到课程末尾</div><div class="pager-card-summary">接下来可以回主知识库或进入 qFlipper / 官方镜像继续查阅。</div></div>`,
        ].join("");
    }

    function renderError(message) {
        if (!content) return;
        content.innerHTML = `<div class="doc-error"><strong>页面没渲染出来。</strong><p>${message}</p><a class="ghost-button" href="${siteRoot}index.html">回首页</a></div>`;
        if (toc) toc.innerHTML = '<p class="empty-state">当前没有目录。</p>';
        if (pager) renderPager("");
    }

    async function run() {
        if (!fetchPath || !repoPath) {
            renderError("缺少文档路径。你可以从首页或课程导航重新进入。");
            return;
        }

        if (pagePath) pagePath.textContent = repoPath;
        if (pageMode) pageMode.textContent = body.dataset.modeLabel || "Markdown · Runtime Render";
        if (pageEyebrow) {
            pageEyebrow.textContent = body.dataset.kicker || (manifestMap.has(repoPath) ? "CN Guide" : "Markdown Viewer");
        }
        if (sourceLink) {
            sourceLink.href = `${siteRoot}${repoPath}`;
            sourceLink.textContent = "查看源 Markdown";
        }

        try {
            const response = await fetch(fetchPath);
            if (!response.ok) {
                throw new Error(`无法读取 ${fetchPath}（HTTP ${response.status}）`);
            }
            const rawMarkdown = await response.text();
            const cleanedMarkdown = stripDecorativeNav(rawMarkdown);
            const manifestDoc = manifestMap.get(repoPath);
            const explicitTitle = body.dataset.title || (manifestDoc && manifestDoc.title);
            const explicitLead = body.dataset.description || (manifestDoc && manifestDoc.summary);
            const displayTitle =
                explicitTitle ||
                (cleanedMarkdown.match(/^#\s+(.+)$/m) || [null, repoPath.split("/").pop().replace(/\.md$/i, "")])[1];
            const displayLead = extractLead(cleanedMarkdown, explicitLead);

            document.title = `${displayTitle} - Flipper Zero Teacher`;
            if (pageTitle) pageTitle.textContent = displayTitle;
            if (pageLead) pageLead.textContent = displayLead;

            if (window.marked && typeof window.marked.parse === "function") {
                window.marked.setOptions({
                    gfm: true,
                    breaks: false,
                    headerIds: false,
                    mangle: false,
                });
            }

            content.innerHTML =
                window.marked && typeof window.marked.parse === "function"
                    ? window.marked.parse(cleanedMarkdown)
                    : `<pre>${cleanedMarkdown}</pre>`;

            const firstHeading = content.querySelector("h1");
            if (firstHeading) firstHeading.remove();

            installHeadingIds(content);
            rewriteLinks(content, repoPath);
            buildToc(content);
            activateTocOnScroll();
            renderPager(repoPath);

            if (window.location.hash) {
                const id = slugify(decodeURIComponent(window.location.hash.slice(1)));
                const target = document.getElementById(id);
                if (target) {
                    setTimeout(() => target.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
                }
            }
        } catch (error) {
            renderError(error.message || "读取 Markdown 时发生错误。");
        }
    }

    run();
})();
