(function () {
    const animateNumber = (node, value) => {
        const target = Number(value) || 0;
        const start = performance.now();
        const duration = 900;
        const from = 0;

        const tick = (now) => {
            const progress = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - progress, 3);
            node.textContent = String(Math.round(from + (target - from) * eased));
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

    const currentUrl = new URL(window.location.href);
    const currentPath = normalizePath(currentUrl.pathname);
    const currentFile = currentUrl.searchParams.get("file") || "";

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
})();
