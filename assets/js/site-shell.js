(function () {
    const body = document.body;
    if (!body) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const escapeHtml = (value) =>
        String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");

    const animateNumber = (node, value) => {
        const target = Number(value) || 0;
        if (prefersReducedMotion) {
            node.textContent = String(target);
            return;
        }

        const start = performance.now();
        const duration = 900;

        const tick = (now) => {
            const progress = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - progress, 3);
            node.textContent = String(Math.round(target * eased));
            if (progress < 1) {
                requestAnimationFrame(tick);
            }
        };

        requestAnimationFrame(tick);
    };

    const normalizePath = (value) =>
        (value || "/")
            .replace(/index\.html$/, "")
            .replace(/\/+$/, "") || "/";

    const shortPath = (value) => {
        const normalized = decodeURIComponent(value || "")
            .replace(/^\.?\/+/, "")
            .replace(/\/+/g, "/");
        if (!normalized) return "site-root";
        const parts = normalized.split("/");
        return parts.length > 2 ? parts.slice(-2).join("/") : normalized;
    };

    const currentUrl = new URL(window.location.href);
    const currentPath = normalizePath(currentUrl.pathname);
    const currentFile = currentUrl.searchParams.get("file") || "";
    const currentDocPath = body.dataset.repoPath || currentFile || "CN/FlipperZero-Master-CN.md";

    document.querySelectorAll(".site-nav a[href]").forEach((link) => {
        const target = new URL(link.getAttribute("href"), currentUrl.href);
        const targetPath = normalizePath(target.pathname);
        const targetFile = target.searchParams.get("file") || "";
        const targetHash = target.hash || "";

        const sameViewerFile = currentPath === targetPath && currentFile && targetFile && currentFile === targetFile;
        const samePath = currentPath === targetPath && !targetFile;
        const sameHash = targetHash && currentPath === targetPath && currentUrl.hash === targetHash;

        if (sameViewerFile || samePath || sameHash) {
            link.setAttribute("aria-current", "page");
        }
    });

    const guideManifest = Array.isArray(window.GUIDE_MANIFEST) ? window.GUIDE_MANIFEST : [];
    const searchIndex = Array.isArray(window.SITE_SEARCH_INDEX) ? window.SITE_SEARCH_INDEX : [];

    const guideCount = guideManifest.length;
    const guideMinutes = guideManifest.reduce((sum, item) => sum + (Number(item.minutes) || 0), 0) || guideCount * 8;
    const searchCount = searchIndex.length;

    document.querySelectorAll("[data-guide-count]").forEach((node) => {
        animateNumber(node, guideCount || 0);
    });

    document.querySelectorAll("[data-guide-minutes]").forEach((node) => {
        animateNumber(node, guideMinutes || 0);
    });

    document.querySelectorAll("[data-search-count]").forEach((node) => {
        animateNumber(node, searchCount || 0);
    });

    const pageKind = (() => {
        if (body.classList.contains("home-page")) return "home";
        if (body.classList.contains("guide-page")) return "guide";
        return "doc";
    })();

    const streamMap = {
        home: [
            { label: "boot", text: "mount runtime reader", tail: "ready" },
            { label: "sync", text: "mirror official qFlipper assets", tail: "ok" },
            { label: "index", text: `scan ${searchCount || "all"} fuzzy routes`, tail: "hot" },
            { label: "route", text: "bind guide / master / qFlipper", tail: "live" },
            { label: "pages", text: "publish static workflow build", tail: "built" },
            { label: "scan", text: "sweep portal frames in sequence", tail: "loop" },
            { label: "curate", text: "lock official and community picks", tail: "set" },
        ],
        guide: [
            { label: "path", text: `hydrate ${guideCount || 10} chapter cards`, tail: "ready" },
            { label: "shell", text: "link html shells to markdown", tail: "bound" },
            { label: "index", text: `mount ${searchCount || "all"} guide search entries`, tail: "ok" },
            { label: "flow", text: "keep ordered learning rail active", tail: "live" },
            { label: "nav", text: "route master / qFlipper / docs", tail: "linked" },
            { label: "loop", text: "cycle chapter frames and status bars", tail: "loop" },
        ],
        doc: [
            { label: "open", text: `mount ${shortPath(currentDocPath)}`, tail: "ready" },
            { label: "parse", text: "render markdown in browser shell", tail: "ok" },
            { label: "link", text: "rewrite md routes and raw URLs", tail: "bound" },
            { label: "toc", text: "track live heading focus", tail: "lock" },
            { label: "copy", text: "arm url and command copy actions", tail: "armed" },
            { label: "scan", text: "loop keyword and search highlights", tail: "hot" },
        ],
    };

    const panelTitleMap = {
        home: "Runtime Stream",
        guide: "Guide Stream",
        doc: "Render Stream",
    };

    const injectTopbarTelemetry = () => {
        document.querySelectorAll(".site-topbar").forEach((bar) => {
            if (bar.querySelector(".topbar-telemetry")) return;
            const node = document.createElement("div");
            node.className = "topbar-telemetry";
            node.setAttribute("aria-hidden", "true");
            node.innerHTML = `
                <span class="topbar-telemetry-label">${escapeHtml(pageKind)}</span>
                <span class="topbar-telemetry-bars"><i></i><i></i><i></i><i></i><i></i></span>
            `;
            bar.appendChild(node);
        });
    };

    const injectFooterTelemetry = () => {
        document.querySelectorAll(".site-footer-brand").forEach((brand) => {
            if (brand.querySelector(".footer-telemetry")) return;
            const node = document.createElement("div");
            node.className = "footer-telemetry";
            node.setAttribute("aria-hidden", "true");
            node.innerHTML = `
                <span class="footer-telemetry-label">runtime</span>
                <span class="footer-telemetry-bars"><i></i><i></i><i></i><i></i></span>
                <span class="footer-telemetry-tail">${escapeHtml(shortPath(currentDocPath))}</span>
            `;
            brand.appendChild(node);
        });
    };

    const renderTerminalPanel = (panel, items, title, visibleRows) => {
        let cursor = 0;

        const draw = () => {
            const rows = [];
            for (let index = 0; index < visibleRows; index += 1) {
                const item = items[(cursor + index) % items.length];
                rows.push(`
                    <div class="terminal-line${index === 0 ? " is-live" : ""}">
                        <span class="terminal-line-state"></span>
                        <span class="terminal-line-label">${escapeHtml(item.label)}</span>
                        <span class="terminal-line-text">${escapeHtml(item.text)}</span>
                        <span class="terminal-line-tail">${escapeHtml(item.tail)}</span>
                    </div>
                `);
            }

            panel.innerHTML = `
                <div class="terminal-panel-head">
                    <span class="terminal-panel-title">${escapeHtml(title)}</span>
                    <span class="terminal-panel-mode">Live</span>
                </div>
                <div class="terminal-log">${rows.join("")}</div>
            `;
        };

        draw();
    };

    const initTerminalPanels = () => {
        document.querySelectorAll("[data-terminal-stream]").forEach((panel) => {
            const streamName = panel.dataset.terminalStream || pageKind;
            const items = streamMap[streamName] || streamMap[pageKind] || streamMap.home;
            const title = panel.dataset.terminalTitle || panelTitleMap[streamName] || panelTitleMap[pageKind];
            const visibleRows = Math.max(3, Number(panel.dataset.terminalSize) || 4);
            renderTerminalPanel(panel, items, title, visibleRows);
        });
    };

    const initHeroSequence = () => {
        const nodes = Array.from(document.querySelectorAll("[data-hero-sequence] .hero-sequence-text"));
        if (!nodes.length) return;

        const frame = "mount /CN/Guide route";

        nodes.forEach((node) => {
            const wrapper = node.closest("[data-hero-sequence]");
            node.textContent = frame;
            wrapper?.classList.remove("is-refreshing");
        });
    };

    const initHeroSignals = () => {
        const notes = Array.from(document.querySelectorAll(".hero-status-notes span"));
        if (!notes.length) return;
        notes.forEach((node) => node.classList.remove("is-live"));
        notes[0].classList.add("is-live");
    };

    const initCardWave = () => {
        return;
    };

    const mountFrameCorners = () => {
        document.querySelectorAll(
            ".system-card, .portal-card, .guide-card, .resource-card, .feature-card, .feature-tile, .pager-card, .closing-band, .doc-panel, .doc-meta-card, .doc-hud-panel, .toc-panel, .terminal-panel",
        ).forEach((node) => {
            if (Array.from(node.children).some((child) => child.classList.contains("frame-corners"))) return;
            const frame = document.createElement("span");
            frame.className = "frame-corners";
            frame.setAttribute("aria-hidden", "true");
            frame.innerHTML = "<i></i><i></i><i></i><i></i>";
            node.prepend(frame);
        });
    };

    initTerminalPanels();
    initHeroSequence();
    initHeroSignals();
    initCardWave();
})();
