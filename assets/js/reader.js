(function () {
    const body = document.body;
    if (!body) return;

    const queryFile = new URLSearchParams(window.location.search).get("file");
    const initialQuery = new URLSearchParams(window.location.search).get("q") || "";
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
    const searchInput = document.getElementById("docSearch");
    const clearSearchButton = document.getElementById("docSearchClear");
    const copyPageUrlButton = document.getElementById("copyPageUrl");
    const searchStatus = document.getElementById("docSearchStatus");
    const keywordBar = document.getElementById("keywordBar");

    const manifest = Array.isArray(window.GUIDE_MANIFEST) ? window.GUIDE_MANIFEST : [];
    const manifestMap = new Map(manifest.map((item) => [item.path, item]));

    const navLinePattern = /^\s*(\[[^\]]+\]\([^)]+\)\s*(\|\s*\[[^\]]+\]\([^)]+\)\s*)+)\s*$/;
    const commandPattern = /^(sudo\s+)?(git|python\d*|pip\d*|npm|pnpm|yarn|uv|cargo|go|docker|gh|curl|wget|brew|qFlipper-cli|fbt|ufbt|cmake|make|adb|ssh|scp|lsusb|mkdir|cp|mv|rm|find|rg|cd|ls)\b/i;
    const fallbackCommandPattern = /(^\.\/)|(--[a-z0-9-]+)/i;
    const bareUrlPattern = /https?:\/\/[^\s<>"']+[^\s<>"'.,;:!?)]/gi;
    const keywordCandidates = [
        "Flipper Zero",
        "qFlipper",
        "CLI",
        "Sub-GHz",
        "NFC",
        "RFID",
        "Infrared",
        "iButton",
        "U2F",
        "BadUSB",
        "BLE",
        "GPIO",
        "application.fam",
        ".fap",
        "Firmware",
        "Archive",
        "Mobile App",
    ];

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

    function escapeRegExp(input) {
        return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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

    function isUrlText(text) {
        return /^https?:\/\/[^\s]+$/i.test(text.trim());
    }

    function looksLikeCommand(text) {
        const value = text.trim();
        if (!value || value.length > 220 || isUrlText(value)) return false;
        return commandPattern.test(value) || fallbackCommandPattern.test(value);
    }

    function copyText(text, button, okText) {
        const applyLabel = (label) => {
            if (!button) return;
            const original = button.dataset.originalLabel || button.textContent;
            button.dataset.originalLabel = original;
            button.textContent = label;
            window.clearTimeout(button.__copyTimer);
            button.__copyTimer = window.setTimeout(() => {
                button.textContent = original;
            }, 1400);
        };

        const fallbackCopy = () => {
            const textarea = document.createElement("textarea");
            textarea.value = text;
            textarea.setAttribute("readonly", "");
            textarea.style.position = "absolute";
            textarea.style.left = "-9999px";
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
            applyLabel(okText || "已复制");
        };

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(
                () => applyLabel(okText || "已复制"),
                () => fallbackCopy(),
            );
            return;
        }
        fallbackCopy();
    }

    function collectTextNodes(root, allowNode) {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        const nodes = [];
        while (walker.nextNode()) {
            const node = walker.currentNode;
            const parent = node.parentElement;
            if (!parent) continue;
            if (parent.closest("a, pre, code, button, mark, script, style, textarea, input, svg")) continue;
            if (allowNode && !allowNode(node)) continue;
            nodes.push(node);
        }
        return nodes;
    }

    function replaceMatchesInTextNode(node, regex, createNode) {
        const text = node.nodeValue;
        regex.lastIndex = 0;
        let match;
        let lastIndex = 0;
        let replaced = false;
        const fragment = document.createDocumentFragment();

        while ((match = regex.exec(text)) !== null) {
            replaced = true;
            if (match.index > lastIndex) {
                fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
            }
            fragment.appendChild(createNode(match[0]));
            lastIndex = regex.lastIndex;
        }

        if (!replaced) return 0;
        if (lastIndex < text.length) {
            fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
        }
        node.replaceWith(fragment);
        return 1;
    }

    function linkifyBareUrls(root) {
        const nodes = collectTextNodes(root, (node) => bareUrlPattern.test(node.nodeValue));
        nodes.forEach((node) => {
            replaceMatchesInTextNode(node, new RegExp(bareUrlPattern), (value) => {
                const anchor = document.createElement("a");
                anchor.href = value;
                anchor.target = "_blank";
                anchor.rel = "noreferrer";
                anchor.textContent = value;
                anchor.className = "auto-link";
                return anchor;
            });
        });
    }

    function clearHighlights(root, className) {
        root.querySelectorAll(`mark.${className}`).forEach((mark) => {
            const fragment = document.createDocumentFragment();
            while (mark.firstChild) {
                fragment.appendChild(mark.firstChild);
            }
            mark.replaceWith(fragment);
        });
    }

    function highlightText(root, regex, className) {
        let count = 0;
        const nodes = collectTextNodes(root, (node) => regex.test(node.nodeValue));
        nodes.forEach((node) => {
            const hit = replaceMatchesInTextNode(node, new RegExp(regex.source, regex.flags), (value) => {
                count += 1;
                const mark = document.createElement("mark");
                mark.className = className;
                mark.textContent = value;
                return mark;
            });
            if (hit) count += 0;
        });
        return count;
    }

    function collectPresentKeywords(markdown) {
        const lower = markdown.toLowerCase();
        return keywordCandidates.filter((term) => lower.includes(term.toLowerCase()));
    }

    function applyDefaultKeywordHighlights(keywords) {
        clearHighlights(content, "term-highlight");
        if (!keywords.length) return;
        const pattern = keywords
            .slice()
            .sort((left, right) => right.length - left.length)
            .map((term) => escapeRegExp(term))
            .join("|");
        if (!pattern) return;
        highlightText(content, new RegExp(pattern, "gi"), "term-highlight");
    }

    function renderKeywordBar(keywords) {
        if (!keywordBar) return;
        const visibleKeywords = keywords.slice(0, 10);
        if (!visibleKeywords.length) {
            keywordBar.innerHTML = "";
            return;
        }
        keywordBar.innerHTML = visibleKeywords
            .map(
                (term) =>
                    `<button type="button" class="keyword-chip" data-term="${term.replace(/"/g, "&quot;")}">${term}</button>`,
            )
            .join("");

        keywordBar.querySelectorAll(".keyword-chip").forEach((button) => {
            button.addEventListener("click", () => {
                if (searchInput) searchInput.value = button.dataset.term || "";
                applySearchHighlight(button.dataset.term || "", true);
            });
        });
    }

    function applySearchHighlight(query, shouldScroll) {
        if (!content) return;
        clearHighlights(content, "search-highlight");
        const trimmed = query.trim();
        if (!trimmed) {
            if (searchStatus) searchStatus.textContent = "未高亮";
            return;
        }
        const count = highlightText(content, new RegExp(escapeRegExp(trimmed), "gi"), "search-highlight");
        if (searchStatus) {
            searchStatus.textContent = count ? `命中 ${count} 处` : "未命中";
        }
        if (shouldScroll) {
            const first = content.querySelector("mark.search-highlight");
            if (first) {
                first.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
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

    function guessLanguage(codeNode, text) {
        const className = (codeNode && codeNode.className) || "";
        const explicit = className.match(/language-([a-z0-9_+-]+)/i);
        if (explicit) return explicit[1];
        return looksLikeCommand(text) ? "bash" : "text";
    }

    function enhanceCodeBlocks(root) {
        root.querySelectorAll("pre").forEach((pre) => {
            if (pre.parentElement && pre.parentElement.classList.contains("code-block-wrap")) return;
            const code = pre.querySelector("code");
            const text = ((code || pre).textContent || "").trim();
            const wrapper = document.createElement("div");
            wrapper.className = "code-block-wrap";

            const toolbar = document.createElement("div");
            toolbar.className = "code-block-toolbar";

            const label = document.createElement("span");
            label.className = "code-block-lang";
            label.textContent = guessLanguage(code, text);

            const button = document.createElement("button");
            button.type = "button";
            button.className = "copy-code-button";
            button.textContent = looksLikeCommand(text) ? "复制命令" : "复制代码";
            button.addEventListener("click", () => copyText(text, button, "已复制"));

            toolbar.append(label, button);
            pre.replaceWith(wrapper);
            wrapper.append(toolbar, pre);
        });
    }

    function enhanceInlineCode(root) {
        root.querySelectorAll("code").forEach((code) => {
            if (code.closest("pre")) return;
            if (code.dataset.enhanced === "1") return;
            const text = (code.textContent || "").trim();
            if (!text) return;

            if (isUrlText(text)) {
                const anchor = document.createElement("a");
                anchor.href = text;
                anchor.target = "_blank";
                anchor.rel = "noreferrer";
                anchor.className = "inline-code-link";
                code.dataset.enhanced = "1";
                anchor.appendChild(code.cloneNode(true));
                code.replaceWith(anchor);
                return;
            }

            if (!looksLikeCommand(text)) {
                code.dataset.enhanced = "1";
                return;
            }

            const wrapper = document.createElement("span");
            wrapper.className = "inline-command-wrap";

            const nextCode = code.cloneNode(true);
            nextCode.className = `${nextCode.className} inline-command-code`.trim();
            nextCode.dataset.enhanced = "1";

            const button = document.createElement("button");
            button.type = "button";
            button.className = "inline-command-copy";
            button.textContent = "复制";
            button.addEventListener("click", () => copyText(text, button, "已复制"));

            wrapper.append(nextCode, button);
            code.replaceWith(wrapper);
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

    function bindToolbar() {
        if (copyPageUrlButton) {
            copyPageUrlButton.addEventListener("click", () => copyText(window.location.href, copyPageUrlButton, "链接已复制"));
        }
        if (clearSearchButton) {
            clearSearchButton.addEventListener("click", () => {
                if (searchInput) searchInput.value = "";
                applySearchHighlight("", false);
            });
        }
        if (searchInput) {
            searchInput.addEventListener("input", () => applySearchHighlight(searchInput.value, false));
            searchInput.addEventListener("keydown", (event) => {
                if (event.key === "Enter") {
                    applySearchHighlight(searchInput.value, true);
                }
            });
        }
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

        bindToolbar();

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
            linkifyBareUrls(content);
            enhanceInlineCode(content);
            enhanceCodeBlocks(content);

            const presentKeywords = collectPresentKeywords(cleanedMarkdown);
            applyDefaultKeywordHighlights(presentKeywords.slice(0, 8));
            renderKeywordBar(presentKeywords);
            buildToc(content);
            activateTocOnScroll();
            renderPager(repoPath);

            if (searchInput && initialQuery) {
                searchInput.value = initialQuery;
                applySearchHighlight(initialQuery, true);
            }

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
