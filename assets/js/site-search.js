(function () {
    const body = document.body;
    const topbar = document.querySelector(".site-nav");

    if (!body || !topbar) return;

    const aliasMap = {
        flipperzero: ["flipper zero", "flipperzero", "fz"],
        qflipper: ["qflipper", "q flipper", "desktop app", "桌面端"],
        subghz: ["sub ghz", "sub-ghz", "subghz", "sub ghz frequency", "频率"],
        ibutton: ["i button", "ibutton"],
        badusb: ["bad usb", "badusb"],
        mobileapp: ["mobile app", "mobileapp"],
        ufbt: ["ufbt", "u f b t"],
        fbt: ["fbt", "f b t"],
        cli: ["cli", "command line", "命令行"],
        firmware: ["firmware", "固件", "刷机"],
        rfid: ["rfid", "射频卡"],
        nfc: ["nfc", "near field communication"],
        ble: ["ble", "bluetooth low energy", "蓝牙"],
        gpio: ["gpio", "引脚"],
    };

    const quickTerms = ["qFlipper", "Sub-GHz", "NFC", "RFID", "刷机", "CLI", "App 开发", "频率"];
    const searchScriptUrl = new URL("./search-index.js", document.currentScript?.src || window.location.href).href;

    let searchIndex = Array.isArray(window.SITE_SEARCH_INDEX) ? window.SITE_SEARCH_INDEX : null;
    let withCache = null;
    let loadPromise = null;
    let inputTimer = 0;
    let activeIndex = 0;
    let currentResults = [];
    let requestToken = 0;

    const normalize = (value) =>
        (value || "")
            .toLowerCase()
            .replace(/[_/\\|]+/g, " ")
            .replace(/([a-z])([0-9])/g, "$1 $2")
            .replace(/([0-9])([a-z])/g, "$1 $2")
            .replace(/[^a-z0-9\u4e00-\u9fa5\s-]+/g, " ")
            .replace(/\s+/g, " ")
            .trim();

    const compact = (value) => normalize(value).replace(/[\s-]+/g, "");

    const expandQuery = (query) => {
        const normalized = normalize(query);
        const collapsed = compact(query);
        const variants = new Set([normalized, collapsed]);

        Object.entries(aliasMap).forEach(([key, values]) => {
            const all = [key, ...values].map((item) => compact(item));
            if (all.includes(collapsed)) {
                values.forEach((item) => variants.add(normalize(item)));
            }
        });

        return Array.from(variants).filter(Boolean);
    };

    const bigrams = (value) => {
        const source = compact(value);
        if (source.length < 2) return new Set([source]);
        const grams = new Set();
        for (let index = 0; index < source.length - 1; index += 1) {
            grams.add(source.slice(index, index + 2));
        }
        return grams;
    };

    const diceScore = (left, right) => {
        const leftGrams = bigrams(left);
        const rightGrams = bigrams(right);
        if (!leftGrams.size || !rightGrams.size) return 0;
        let overlap = 0;
        leftGrams.forEach((gram) => {
            if (rightGrams.has(gram)) overlap += 1;
        });
        return (2 * overlap) / (leftGrams.size + rightGrams.size);
    };

    const isSubsequence = (query, target) => {
        if (!query || !target) return false;
        let pointer = 0;
        for (const char of target) {
            if (char === query[pointer]) pointer += 1;
            if (pointer >= query.length) return true;
        }
        return false;
    };

    const buildCache = (entries) =>
        entries.map((entry) => {
            const title = normalize(entry.title);
            const summary = normalize(entry.summary);
            const text = normalize(entry.text);
            const path = normalize(entry.path);
            const parent = normalize(entry.parent || "");

            return {
                ...entry,
                _title: title,
                _summary: summary,
                _text: text,
                _path: path,
                _parent: parent,
                _compactTitle: compact(entry.title),
                _compactSearch: compact(`${entry.title} ${entry.parent || ""} ${entry.summary} ${entry.text} ${entry.path}`),
            };
        });

    const updateSearchCount = () => {
        if (!Array.isArray(searchIndex)) return;
        document.querySelectorAll("[data-search-count]").forEach((node) => {
            node.textContent = String(searchIndex.length);
        });
    };

    const ensureSearchIndex = async () => {
        if (withCache) return withCache;

        if (Array.isArray(window.SITE_SEARCH_INDEX) && window.SITE_SEARCH_INDEX.length) {
            searchIndex = window.SITE_SEARCH_INDEX;
            withCache = buildCache(searchIndex);
            updateSearchCount();
            return withCache;
        }

        if (!loadPromise) {
            loadPromise = new Promise((resolve, reject) => {
                const script = document.createElement("script");
                script.src = searchScriptUrl;
                script.async = true;
                script.onload = () => resolve();
                script.onerror = () => reject(new Error("无法载入全站搜索索引。"));
                document.head.appendChild(script);
            });
        }

        await loadPromise;
        searchIndex = Array.isArray(window.SITE_SEARCH_INDEX) ? window.SITE_SEARCH_INDEX : [];
        withCache = buildCache(searchIndex);
        updateSearchCount();
        return withCache;
    };

    const scoreEntry = (entry, query) => {
        const variants = expandQuery(query);
        const rawCompact = compact(query);
        if (!rawCompact) return 0;

        let score = 0;

        variants.forEach((variant) => {
            const variantCompact = compact(variant);
            const tokens = normalize(variant).split(" ").filter(Boolean);

            if (entry._title.includes(variant)) score += 180;
            if (entry._parent && entry._parent.includes(variant)) score += 120;
            if (entry._summary.includes(variant)) score += 80;
            if (entry._text.includes(variant)) score += 52;
            if (entry._path.includes(variant)) score += 46;
            if (entry._compactTitle.includes(variantCompact)) score += 94;
            if (entry._compactSearch.includes(variantCompact)) score += 44;

            tokens.forEach((token) => {
                if (entry._title.includes(token)) score += 40;
                if (entry._parent.includes(token)) score += 28;
                if (entry._summary.includes(token)) score += 20;
                if (entry._text.includes(token)) score += 12;
                if (entry._path.includes(token)) score += 8;
            });
        });

        score += Math.round(diceScore(rawCompact, entry._compactTitle) * 160);
        score += Math.round(diceScore(rawCompact, entry._compactSearch) * 70);

        if (isSubsequence(rawCompact, entry._compactTitle)) score += 28;
        if (isSubsequence(rawCompact, entry._compactSearch)) score += 12;

        if (entry.kind === "doc") score += 14;
        if (entry.kind === "section") score += 6;
        if (entry.kind === "guide") score += 12;
        if (entry.kind === "resource") score += 4;

        return score;
    };

    const limitResults = (entries) => {
        const docPaths = new Set(entries.filter((entry) => entry.kind === "doc").map((entry) => entry.path));
        const pathCounts = new Map();
        const limited = [];

        for (const entry of entries) {
            const count = pathCounts.get(entry.path) || 0;
            const limit = entry.kind === "doc" ? 1 : docPaths.has(entry.path) ? 1 : 2;
            if (count >= limit) continue;
            pathCounts.set(entry.path, count + 1);
            limited.push(entry);
            if (limited.length >= 10) break;
        }

        return limited;
    };

    const searchEntries = (query) => {
        const trimmed = query.trim();
        if (!trimmed || !withCache) return [];

        const ranked = withCache
            .map((entry) => ({ ...entry, _score: scoreEntry(entry, trimmed) }))
            .filter((entry) => entry._score >= 38)
            .sort((left, right) => right._score - left._score);

        return limitResults(ranked);
    };

    const renderSnippet = (entry) => {
        const source = entry.summary || entry.text || entry.path;
        return source.length > 120 ? `${source.slice(0, 120)}…` : source;
    };

    const overlay = document.createElement("div");
    overlay.className = "site-search";
    overlay.setAttribute("hidden", "");
    overlay.innerHTML = `
        <div class="site-search-backdrop" data-search-close="true"></div>
        <section class="site-search-panel" role="dialog" aria-modal="true" aria-label="全站搜索">
            <div class="site-search-head">
                <div>
                    <p class="eyebrow">Global Search</p>
                    <h2 class="site-search-title">模糊搜索整个知识库</h2>
                </div>
                <button class="site-search-close" type="button" data-search-close="true" aria-label="关闭">×</button>
            </div>
            <div class="site-search-box">
                <input class="site-search-input" type="search" placeholder="搜索协议、工具、命令、文档、刷机、qFlipper…" autocomplete="off">
                <span class="site-search-shortcut">⌘K</span>
            </div>
            <div class="site-search-tags">
                ${quickTerms.map((term) => `<button type="button" class="site-search-tag" data-search-term="${term}">${term}</button>`).join("")}
            </div>
            <div class="site-search-status">支持中文、英文、缩写和常见别名。</div>
            <div class="site-search-results"></div>
        </section>
    `;
    body.appendChild(overlay);

    const searchButton = document.createElement("button");
    searchButton.type = "button";
    searchButton.className = "site-search-trigger";
    searchButton.innerHTML = "<span>搜索</span><kbd>⌘K</kbd>";
    topbar.appendChild(searchButton);

    const input = overlay.querySelector(".site-search-input");
    const results = overlay.querySelector(".site-search-results");
    const status = overlay.querySelector(".site-search-status");

    const renderEmpty = () => {
        results.innerHTML = `
            <div class="site-search-empty">
                <strong>直接搜你想要的词。</strong>
                <p>例如：qFlipper、SubGHz、RFID、刷机、CLI、App 开发、频率、GPIO。</p>
            </div>
        `;
    };

    const renderLoading = () => {
        results.innerHTML = `
            <div class="site-search-empty">
                <strong>正在载入搜索索引。</strong>
                <p>首次打开会按需加载，后续会直接复用。</p>
            </div>
        `;
    };

    const renderError = (message) => {
        results.innerHTML = `
            <div class="site-search-empty">
                <strong>搜索暂时不可用。</strong>
                <p>${message}</p>
            </div>
        `;
    };

    const syncActiveResult = () => {
        results.querySelectorAll(".site-search-result").forEach((element, index) => {
            element.classList.toggle("is-active", index === activeIndex);
        });
    };

    const renderResults = async (query) => {
        const requestId = requestToken + 1;
        requestToken = requestId;
        currentResults = [];
        activeIndex = 0;

        if (!query.trim()) {
            status.textContent = "支持中文、英文、缩写和常见别名。";
            renderEmpty();
            return;
        }

        status.textContent = "正在准备搜索索引…";
        renderLoading();

        try {
            await ensureSearchIndex();
        } catch (error) {
            if (requestToken !== requestId) return;
            status.textContent = "搜索索引加载失败。";
            renderError(error.message || "请稍后重试。");
            return;
        }

        if (requestToken !== requestId) return;

        currentResults = searchEntries(query);

        if (!currentResults.length) {
            status.textContent = "没有找到足够接近的结果。";
            results.innerHTML = `
                <div class="site-search-empty">
                    <strong>没有命中。</strong>
                    <p>试试更短的词，或换成别名：例如用 qFlipper / subghz / 刷机 / 频率 / CLI。</p>
                </div>
            `;
            return;
        }

        status.textContent = `找到 ${currentResults.length} 条最相关结果。`;
        results.innerHTML = currentResults
            .map(
                (entry, index) => `
                    <a class="site-search-result${index === activeIndex ? " is-active" : ""}" href="${entry.href}" data-result-index="${index}">
                        <div class="site-search-result-meta">
                            <span class="site-search-kind">${entry.group}</span>
                            <span class="site-search-path">${entry.path}</span>
                        </div>
                        <strong class="site-search-result-title">${entry.parent ? `${entry.parent} / ${entry.title}` : entry.title}</strong>
                        <p class="site-search-result-summary">${renderSnippet(entry)}</p>
                    </a>
                `,
            )
            .join("");
    };

    const scheduleRender = (query) => {
        window.clearTimeout(inputTimer);
        inputTimer = window.setTimeout(() => {
            void renderResults(query);
        }, 90);
    };

    const setOpen = (open, preset = "") => {
        if (open) {
            overlay.removeAttribute("hidden");
            body.classList.add("search-open");
            input.value = preset || input.value;
            void renderResults(input.value);
            window.setTimeout(() => input.focus(), 30);
            return;
        }

        overlay.setAttribute("hidden", "");
        body.classList.remove("search-open");
    };

    searchButton.addEventListener("click", () => setOpen(true));

    overlay.querySelectorAll("[data-search-close='true']").forEach((element) => {
        element.addEventListener("click", () => setOpen(false));
    });

    overlay.querySelectorAll("[data-search-term]").forEach((button) => {
        button.addEventListener("click", () => {
            const term = button.dataset.searchTerm || "";
            input.value = term;
            void renderResults(term);
            input.focus();
        });
    });

    input.addEventListener("input", () => scheduleRender(input.value));
    input.addEventListener("keydown", (event) => {
        if (!currentResults.length) return;

        if (event.key === "ArrowDown") {
            event.preventDefault();
            activeIndex = (activeIndex + 1) % currentResults.length;
            syncActiveResult();
        }

        if (event.key === "ArrowUp") {
            event.preventDefault();
            activeIndex = (activeIndex - 1 + currentResults.length) % currentResults.length;
            syncActiveResult();
        }

        if (event.key === "Enter") {
            const next = currentResults[activeIndex];
            if (next) window.location.href = next.href;
        }
    });

    document.addEventListener("keydown", (event) => {
        const openShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
        const slashShortcut = event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName || "");

        if (openShortcut || slashShortcut) {
            event.preventDefault();
            setOpen(true);
        }

        if (event.key === "Escape" && body.classList.contains("search-open")) {
            setOpen(false);
        }
    });

    if (Array.isArray(searchIndex) && searchIndex.length) {
        withCache = buildCache(searchIndex);
        updateSearchCount();
    }

    renderEmpty();
})();
