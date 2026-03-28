(function () {
    const mount = document.getElementById("guideGrid");
    if (!mount) return;

    const manifest = Array.isArray(window.GUIDE_MANIFEST) ? window.GUIDE_MANIFEST : [];

    mount.innerHTML = manifest
        .map(
            (item) => `
                <a class="guide-card" href="./${item.stem}.html">
                    <div class="guide-card-label">Chapter / ${item.number}</div>
                    <div class="guide-card-header">
                        <div class="guide-card-number">${item.number}</div>
                        <div class="guide-card-signal" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
                        <div class="guide-card-ghost">${item.number}</div>
                    </div>
                    <div>
                        <h2 class="guide-card-title">${item.title}</h2>
                        <p class="guide-card-summary">${item.summary}</p>
                    </div>
                    <div class="guide-card-footer">
                        <span>${item.sections || 0} 个小节</span>
                        <span>约 ${item.minutes || 1} 分钟</span>
                        <span>进入章节 →</span>
                    </div>
                </a>
            `,
        )
        .join("");
})();
