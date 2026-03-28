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
    const docHudHeading = document.getElementById("docHudHeading");
    const docHudProgress = document.getElementById("docHudProgress");
    const docHudSearch = document.getElementById("docHudSearch");
    const breadcrumbParent = document.getElementById("docBreadcrumbParent");
    const breadcrumbCurrent = document.getElementById("docBreadcrumbCurrent");
    const docStatusKind = document.getElementById("docStatusKind");
    const docStatusRoute = document.getElementById("docStatusRoute");
    const docStatusSource = document.getElementById("docStatusSource");
    const content = document.getElementById("docContent");
    const toc = document.getElementById("docToc");
    const pager = document.getElementById("docPager");
    const searchInput = document.getElementById("docSearch");
    const clearSearchButton = document.getElementById("docSearchClear");
    const copyPageUrlButton = document.getElementById("copyPageUrl");
    const searchStatus = document.getElementById("docSearchStatus");
    const searchResults = document.getElementById("searchResults");
    const searchResultsMeta = document.getElementById("searchResultsMeta");
    const searchResultsList = document.getElementById("searchResultsList");
    const keywordBar = document.getElementById("keywordBar");
    const tocHudHeading = document.getElementById("tocHudHeading");
    const tocHudMeta = document.getElementById("tocHudMeta");
    const tocProgressFill = document.getElementById("tocProgressFill");
    const readerActivityMode = document.getElementById("readerActivityMode");
    const readerActivityPercent = document.getElementById("readerActivityPercent");
    let searchIndex = [];
    let currentSearchMatches = [];
    let activeSearchResult = -1;
    let searchInputTimer = null;
    let tocHeadings = [];
    let sourceLabel = repoPath.split("/").pop() || repoPath;
    let progressFrame = 0;

    const hudState = {
        activeHeading: "awaiting toc lock",
        level: "--",
        activeIndex: 0,
        total: 0,
        progress: 0,
        search: "idle",
    };

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

    function renderHudState() {
        if (docHudHeading) docHudHeading.textContent = hudState.activeHeading;
        if (docHudProgress) docHudProgress.textContent = `${hudState.progress}%`;
        if (docHudSearch) docHudSearch.textContent = hudState.search;
        if (tocHudHeading) tocHudHeading.textContent = hudState.activeHeading;
        if (tocHudMeta) {
            const total = hudState.total || 0;
            const active = hudState.activeIndex || 0;
            tocHudMeta.textContent = total ? `${hudState.level} · ${active}/${total} · ${hudState.progress}%` : `${hudState.progress}%`;
        }
        if (tocProgressFill) {
            const ratio = Math.max(0.06, Math.min(1, hudState.progress / 100 || 0.06));
            tocProgressFill.style.transform = window.matchMedia("(max-width: 820px)").matches ? `scaleX(${ratio})` : `scaleY(${ratio})`;
        }
        if (readerActivityPercent) {
            readerActivityPercent.textContent = `${hudState.progress}%`;
        }
        if (readerActivityMode) {
            const mode = hudState.search !== "idle"
                ? (hudState.search === "no hits" ? "miss" : "search")
                : hudState.total && hudState.activeIndex
                    ? "lock"
                    : hudState.progress > 0
                        ? "scroll"
                        : "scan";
            readerActivityMode.textContent = mode;
            const rail = readerActivityMode.closest(".reader-activity-rail");
            if (rail) rail.dataset.mode = mode;
        }
        if (docStatusRoute) {
            docStatusRoute.textContent = `${body.dataset.modeLabel || "Runtime Render"} · ${hudState.progress}%`;
        }
        if (docStatusSource) {
            if (hudState.total && hudState.level !== "--") {
                docStatusSource.textContent = `${sourceLabel} :: ${hudState.level} ${hudState.activeIndex}/${hudState.total}`;
            } else {
                docStatusSource.textContent = sourceLabel;
            }
        }
    }

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

    function escapeHtml(input) {
        return input
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    function normalizeSearchText(input) {
        return input
            .toString()
            .normalize("NFKC")
            .toLowerCase()
            .replace(/[【】()[\]{}：:、，,。.!?'"`]+/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    function normalizeDenseSearchText(input) {
        return normalizeSearchText(input).replace(/[\s\-_/|.]+/g, "");
    }

    function regexMatches(regex, value) {
        regex.lastIndex = 0;
        return regex.test(value);
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
        const nodes = collectTextNodes(root, (node) => regexMatches(bareUrlPattern, node.nodeValue));
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
        const nodes = collectTextNodes(root, (node) => regexMatches(regex, node.nodeValue));
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
                runSmartSearch(button.dataset.term || "", true);
            });
        });
    }

    function applySearchHighlight(query, shouldScroll) {
        if (!content) return;
        clearHighlights(content, "search-highlight");
        const trimmed = query.trim();
        if (!trimmed) {
            return 0;
        }
        const count = highlightText(content, new RegExp(escapeRegExp(trimmed), "gi"), "search-highlight");
        if (shouldScroll) {
            const first = content.querySelector("mark.search-highlight");
            if (first) {
                first.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
        return count;
    }

    function createBigrams(value) {
        const dense = normalizeDenseSearchText(value);
        if (!dense) return [];
        if (dense.length === 1) return [dense];
        const bigrams = [];
        for (let index = 0; index < dense.length - 1; index += 1) {
            bigrams.push(dense.slice(index, index + 2));
        }
        return bigrams;
    }

    function diceCoefficient(left, right) {
        const leftBigrams = createBigrams(left);
        const rightBigrams = createBigrams(right);
        if (!leftBigrams.length || !rightBigrams.length) return 0;

        const counts = new Map();
        leftBigrams.forEach((item) => counts.set(item, (counts.get(item) || 0) + 1));

        let overlap = 0;
        rightBigrams.forEach((item) => {
            const current = counts.get(item) || 0;
            if (!current) return;
            overlap += 1;
            counts.set(item, current - 1);
        });

        return (2 * overlap) / (leftBigrams.length + rightBigrams.length);
    }

    function subsequenceScore(query, target) {
        const left = normalizeDenseSearchText(query);
        const right = normalizeDenseSearchText(target);
        if (!left || !right) return 0;

        let leftIndex = 0;
        let rightIndex = 0;
        let firstHit = -1;
        let lastHit = -1;

        while (leftIndex < left.length && rightIndex < right.length) {
            if (left[leftIndex] === right[rightIndex]) {
                if (firstHit === -1) firstHit = rightIndex;
                lastHit = rightIndex;
                leftIndex += 1;
            }
            rightIndex += 1;
        }

        if (leftIndex !== left.length) return 0;
        const span = Math.max(1, lastHit - firstHit + 1);
        const coverage = left.length / Math.max(right.length, left.length);
        const compactness = left.length / span;
        return coverage * 0.42 + compactness * 0.58;
    }

    function tokenizeSearchQuery(query) {
        return normalizeSearchText(query).split(" ").filter(Boolean);
    }

    function getEntryKindLabel(kind) {
        if (kind === "heading") return "标题";
        if (kind === "code") return "命令 / 代码";
        if (kind === "list") return "列表";
        if (kind === "table") return "表格";
        if (kind === "quote") return "引用";
        return "正文";
    }

    function buildSearchIndex(root) {
        const entries = [];
        let currentHeading = pageTitle && pageTitle.textContent ? pageTitle.textContent.trim() : "正文";
        let order = 0;

        root.querySelectorAll("h2, h3, h4, p, li, blockquote, pre, td, th").forEach((element) => {
            const tagName = element.tagName.toLowerCase();
            const text = (element.textContent || "").replace(/\s+/g, " ").trim();
            if (!text) return;

            const kind =
                /^h[2-4]$/.test(tagName)
                    ? "heading"
                    : tagName === "pre"
                      ? "code"
                      : tagName === "li"
                        ? "list"
                        : tagName === "blockquote"
                          ? "quote"
                          : tagName === "td" || tagName === "th"
                            ? "table"
                            : "body";

            if (kind === "heading") {
                currentHeading = text;
            }

            if (kind !== "heading" && kind !== "code" && text.length < 8) return;

            if (!element.id) {
                element.id = `${slugify(currentHeading || "section")}-${kind}-${order + 1}`;
            }

            const searchSource = `${currentHeading} ${text}`.trim();
            entries.push({
                id: element.id,
                element,
                kind,
                order,
                text,
                heading: currentHeading,
                normalizedText: normalizeSearchText(searchSource),
                denseText: normalizeDenseSearchText(searchSource),
            });
            order += 1;
        });

        return entries;
    }

    function scoreSearchEntry(query, entry) {
        const normalizedQuery = normalizeSearchText(query);
        const denseQuery = normalizeDenseSearchText(query);
        if (!normalizedQuery) return 0;

        const tokens = tokenizeSearchQuery(query);
        const exactIndex = entry.normalizedText.indexOf(normalizedQuery);
        const denseIndex = denseQuery ? entry.denseText.indexOf(denseQuery) : -1;
        let score = 0;

        if (normalizedQuery.length === 1) {
            return exactIndex !== -1 ? 3 : 0;
        }

        if (exactIndex !== -1) {
            score += 3.1 - Math.min(exactIndex / 240, 0.42);
        }

        if (denseIndex !== -1) {
            score += 1.7 - Math.min(denseIndex / 220, 0.32);
        }

        if (entry.heading && normalizeSearchText(entry.heading).includes(normalizedQuery)) {
            score += 0.84;
        }

        tokens.forEach((token) => {
            if (entry.normalizedText.includes(token)) {
                score += 0.52;
            } else {
                score += diceCoefficient(token, entry.normalizedText) * 0.22;
            }
        });

        score += diceCoefficient(denseQuery, entry.denseText) * 1.18;
        score += subsequenceScore(denseQuery, entry.denseText) * 1.08;

        if (entry.kind === "heading") score += 0.24;
        if (entry.kind === "code" && looksLikeCommand(entry.text)) score += 0.2;
        if (entry.text.length <= 120) score += 0.08;

        return Number(score.toFixed(4));
    }

    function clipSearchSnippet(text, query) {
        const normalizedText = normalizeSearchText(text);
        const normalizedQuery = normalizeSearchText(query);
        if (!normalizedQuery) return text.length > 160 ? `${text.slice(0, 160)}…` : text;

        const hitIndex = normalizedText.indexOf(normalizedQuery);
        if (hitIndex === -1 || text.length <= 180) {
            return text.length > 180 ? `${text.slice(0, 180)}…` : text;
        }

        const start = Math.max(0, hitIndex - 40);
        const end = Math.min(text.length, hitIndex + normalizedQuery.length + 88);
        const prefix = start > 0 ? "…" : "";
        const suffix = end < text.length ? "…" : "";
        return `${prefix}${text.slice(start, end)}${suffix}`;
    }

    function highlightSearchSnippet(text, query) {
        let output = escapeHtml(text);
        const candidates = Array.from(
            new Set([normalizeSearchText(query), ...tokenizeSearchQuery(query)].filter((token) => token.length >= 2)),
        ).sort((left, right) => right.length - left.length);

        candidates.forEach((token) => {
            const pattern = new RegExp(escapeRegExp(token).replace(/\s+/g, "\\s+"), "gi");
            output = output.replace(pattern, (value) => `<mark>${value}</mark>`);
        });

        return output;
    }

    function setSearchHudState(label) {
        hudState.search = label || "idle";
        renderHudState();
    }

    function markHeadingLive(heading) {
        if (!heading) return;
        heading.classList.remove("heading-live");
        void heading.offsetWidth;
        heading.classList.add("heading-live");
        window.clearTimeout(heading.__liveTimer);
        heading.__liveTimer = window.setTimeout(() => {
            heading.classList.remove("heading-live");
        }, 1200);
    }

    function updateReadingProgress() {
        if (!content) return;
        const rect = content.getBoundingClientRect();
        const viewport = window.innerHeight || document.documentElement.clientHeight || 1;
        const total = Math.max(1, content.scrollHeight - viewport * 0.55);
        const travelled = Math.max(0, -rect.top + viewport * 0.18);
        hudState.progress = Math.max(0, Math.min(100, Math.round((travelled / total) * 100)));
        renderHudState();
    }

    function queueProgressUpdate() {
        if (progressFrame) return;
        progressFrame = window.requestAnimationFrame(() => {
            progressFrame = 0;
            updateReadingProgress();
        });
    }

    function clearSearchResults() {
        if (searchResults) searchResults.hidden = true;
        if (searchResultsMeta) searchResultsMeta.textContent = "输入关键词后显示结果";
        if (searchResultsList) searchResultsList.innerHTML = "";
        currentSearchMatches = [];
        activeSearchResult = -1;
        setSearchHudState("idle");
    }

    function setActiveSearchResult(index) {
        activeSearchResult = index;
        if (!searchResultsList) return;
        searchResultsList.querySelectorAll(".search-result-item").forEach((button, buttonIndex) => {
            button.classList.toggle("is-active", buttonIndex === index);
        });
        const current = currentSearchMatches[index];
        if (current && current.entry && current.entry.element) {
            flashSearchTarget(current.entry.element);
        }
    }

    function flashSearchTarget(element) {
        if (!element) return;
        element.classList.remove("search-target-focus");
        void element.offsetWidth;
        element.classList.add("search-target-focus");
        window.clearTimeout(element.__focusTimer);
        element.__focusTimer = window.setTimeout(() => {
            element.classList.remove("search-target-focus");
        }, 1800);
    }

    function focusSearchEntry(entry, query, shouldScroll) {
        if (!entry || !entry.element) return;
        const exactCount = applySearchHighlight(query, false);
        if (shouldScroll) {
            entry.element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        if (!exactCount) {
            flashSearchTarget(entry.element);
        }
    }

    function renderSearchResults(results, query) {
        if (!searchResults || !searchResultsList || !searchResultsMeta) return;

        if (!query.trim()) {
            clearSearchResults();
            return;
        }

        currentSearchMatches = results;
        activeSearchResult = results.length ? 0 : -1;
        searchResults.hidden = false;
        searchResultsMeta.textContent = results.length ? `候选 ${results.length} 项 · ↑↓ 切换` : "没有接近结果";

        if (!results.length) {
            searchResultsList.innerHTML = '<p class="search-results-empty">没有找到接近的段落，试试更短的关键词或点击下面的关键词芯片。</p>';
            return;
        }

        searchResultsList.innerHTML = results
            .map(({ entry, score }, index) => {
                const snippet = highlightSearchSnippet(clipSearchSnippet(entry.text, query), query);
                return `
                    <button class="search-result-item${index === 0 ? " is-active" : ""}" type="button" data-index="${index}">
                        <span class="search-result-kind">${getEntryKindLabel(entry.kind)}</span>
                        <strong class="search-result-heading">${escapeHtml(entry.heading || entry.text)}</strong>
                        <span class="search-result-snippet">${snippet}</span>
                        <span class="search-result-score">匹配度 ${Math.round(Math.min(score, 3) / 3 * 100)}%</span>
                    </button>
                `;
            })
            .join("");

        searchResultsList.querySelectorAll(".search-result-item").forEach((button) => {
            button.addEventListener("mouseenter", () => setActiveSearchResult(Number(button.dataset.index)));
            button.addEventListener("click", () => {
                const match = results[Number(button.dataset.index)];
                setActiveSearchResult(Number(button.dataset.index));
                focusSearchEntry(match && match.entry, query, true);
            });
        });
    }

    function runSmartSearch(query, shouldScroll) {
        const trimmed = query.trim();
        const exactCount = applySearchHighlight(trimmed, false);

        if (!trimmed) {
            if (searchStatus) searchStatus.textContent = "未搜索";
            clearSearchResults();
            return;
        }

        const results = searchIndex
            .map((entry) => ({ entry, score: scoreSearchEntry(trimmed, entry) }))
            .filter(({ score }) => {
                const threshold = trimmed.length <= 2 ? 0.92 : trimmed.length <= 4 ? 0.66 : trimmed.length <= 8 ? 0.44 : 0.36;
                return score >= threshold;
            })
            .sort((left, right) => right.score - left.score || left.entry.order - right.entry.order)
            .slice(0, 8);

        renderSearchResults(results, trimmed);

        if (searchStatus) {
            if (exactCount && results.length) {
                searchStatus.textContent = `精确 ${exactCount} · 候选 ${results.length}`;
            } else if (exactCount) {
                searchStatus.textContent = `精确 ${exactCount}`;
            } else if (results.length) {
                searchStatus.textContent = `模糊 ${results.length}`;
            } else {
                searchStatus.textContent = "无结果";
            }
        }

        if (exactCount && results.length) {
            setSearchHudState(`${trimmed} · ${Math.max(exactCount, results.length)} hits`);
        } else if (exactCount) {
            setSearchHudState(`${trimmed} · exact ${exactCount}`);
        } else if (results.length) {
            setSearchHudState(`${trimmed} · fuzzy ${results.length}`);
        } else {
            setSearchHudState("no hits");
        }

        if (shouldScroll) {
            if (exactCount) {
                const first = content.querySelector("mark.search-highlight");
                if (first) {
                    first.scrollIntoView({ behavior: "smooth", block: "center" });
                    return;
                }
            }
            if (results[0]) {
                focusSearchEntry(results[0].entry, trimmed, true);
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

    function rewriteMediaSources(root, currentPath) {
        const baseDir = dirname(currentPath);
        root.querySelectorAll("img[src]").forEach((image) => {
            const rawSrc = image.getAttribute("src");
            if (!rawSrc) return;

            if (!/^(?:[a-z]+:)?\/\//i.test(rawSrc) && !rawSrc.startsWith("data:")) {
                const resolved = resolvePath(baseDir, rawSrc);
                image.setAttribute("src", `${siteRoot}${resolved}`);
            }

            image.loading = image.loading || "lazy";
            image.decoding = "async";
            image.addEventListener("error", () => {
                if (image.dataset.errorHandled === "1") return;
                image.dataset.errorHandled = "1";
                image.classList.add("is-broken");

                const fallback = document.createElement("p");
                fallback.className = "image-fallback";
                fallback.textContent = image.alt
                    ? `图片未载入：${image.alt}`
                    : "图片未载入，原始地址可能已经失效。";
                image.insertAdjacentElement("afterend", fallback);
            });
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
        tocHeadings = headings;
        hudState.total = headings.length;
        if (!headings.length) {
            toc.innerHTML = '<p class="empty-state">这页没有二级目录，适合直接顺着读。</p>';
            hudState.activeHeading = "direct read mode";
            hudState.level = "--";
            hudState.activeIndex = 0;
            renderHudState();
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
        hudState.activeHeading = headings[0].textContent || "awaiting toc lock";
        hudState.level = headings[0].tagName.toUpperCase();
        hudState.activeIndex = 1;
        renderHudState();
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
                        const headingIndex = tocHeadings.indexOf(entry.target);
                        hudState.activeHeading = entry.target.textContent || "section lock";
                        hudState.level = entry.target.tagName.toUpperCase();
                        hudState.activeIndex = headingIndex >= 0 ? headingIndex + 1 : 0;
                        renderHudState();
                        markHeadingLive(entry.target);
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

    function applyDocumentMeta(displayTitle) {
        const repoSegments = repoPath.split("/");
        const fileLabel = repoSegments[repoSegments.length - 1] || repoPath;
        sourceLabel = fileLabel;
        let parentLabel = "知识库";
        let parentHref = `${siteRoot}index.html`;
        let kindLabel = "Markdown 文档";

        if (repoPath.startsWith("CN/Guide/")) {
            parentLabel = "中文课程";
            parentHref = `${siteRoot}CN/Guide/index.html`;
            kindLabel = "课程章节";
        } else if (repoPath.startsWith("CN/")) {
            parentLabel = "中文文档";
            parentHref = `${siteRoot}viewer.html?file=${encodeURIComponent("CN/FlipperZero-Master-CN.md")}`;
            kindLabel = "中文文档";
        } else if (repoPath.startsWith("FlipperZero_资源库/")) {
            parentLabel = "资源库";
            parentHref = `${siteRoot}viewer.html?file=${encodeURIComponent("FlipperZero_资源库/FlipperZero_完整技术资源指南.md")}`;
            kindLabel = "资源库条目";
        }

        if (breadcrumbParent) {
            breadcrumbParent.textContent = parentLabel;
            breadcrumbParent.href = parentHref;
        }
        if (breadcrumbCurrent) breadcrumbCurrent.textContent = displayTitle;
        if (docStatusKind) docStatusKind.textContent = kindLabel;
        renderHudState();
    }

    function renderError(message) {
        if (!content) return;
        content.innerHTML = `<div class="doc-error"><strong>页面没渲染出来。</strong><p>${message}</p><a class="ghost-button" href="${siteRoot}index.html">回首页</a></div>`;
        if (toc) toc.innerHTML = '<p class="empty-state">当前没有目录。</p>';
        if (pager) renderPager("");
    }

    function bindToolbar() {
        if (searchInput) {
            searchInput.placeholder = "搜索标题、术语、命令、正文，支持模糊匹配";
            searchInput.autocomplete = "off";
            searchInput.spellcheck = false;
        }
        if (copyPageUrlButton) {
            copyPageUrlButton.addEventListener("click", () => copyText(window.location.href, copyPageUrlButton, "链接已复制"));
        }
        if (clearSearchButton) {
            clearSearchButton.addEventListener("click", () => {
                if (searchInput) searchInput.value = "";
                runSmartSearch("", false);
            });
        }
        if (searchInput) {
            searchInput.addEventListener("input", () => {
                window.clearTimeout(searchInputTimer);
                searchInputTimer = window.setTimeout(() => runSmartSearch(searchInput.value, false), 140);
            });
            searchInput.addEventListener("keydown", (event) => {
                if (event.key === "ArrowDown" && currentSearchMatches.length) {
                    event.preventDefault();
                    const nextIndex = Math.min(activeSearchResult + 1, currentSearchMatches.length - 1);
                    setActiveSearchResult(nextIndex);
                    return;
                }
                if (event.key === "ArrowUp" && currentSearchMatches.length) {
                    event.preventDefault();
                    const nextIndex = Math.max(activeSearchResult - 1, 0);
                    setActiveSearchResult(nextIndex);
                    return;
                }
                if (event.key === "Enter") {
                    event.preventDefault();
                    if (currentSearchMatches.length && currentSearchMatches[Math.max(activeSearchResult, 0)]) {
                        const match = currentSearchMatches[Math.max(activeSearchResult, 0)];
                        focusSearchEntry(match.entry, searchInput.value, true);
                        return;
                    }
                    runSmartSearch(searchInput.value, true);
                }
                if (event.key === "Escape") {
                    searchInput.value = "";
                    runSmartSearch("", false);
                }
            });
        }
    }

    async function run() {
        if (!fetchPath || !repoPath) {
            renderError("缺少文档路径。你可以从首页或课程导航重新进入。");
            return;
        }

        renderHudState();

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
            applyDocumentMeta(displayTitle);

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
            rewriteMediaSources(content, repoPath);
            linkifyBareUrls(content);
            enhanceInlineCode(content);
            enhanceCodeBlocks(content);

            const presentKeywords = collectPresentKeywords(cleanedMarkdown);
            applyDefaultKeywordHighlights(presentKeywords.slice(0, 8));
            renderKeywordBar(presentKeywords);
            buildToc(content);
            activateTocOnScroll();
            renderPager(repoPath);
            searchIndex = buildSearchIndex(content);
            updateReadingProgress();
            window.addEventListener("scroll", queueProgressUpdate, { passive: true });
            window.addEventListener("resize", queueProgressUpdate, { passive: true });

            if (searchInput && initialQuery) {
                searchInput.value = initialQuery;
                runSmartSearch(initialQuery, true);
            } else {
                clearSearchResults();
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
