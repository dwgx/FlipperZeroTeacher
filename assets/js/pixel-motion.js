(function () {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    const hosts = Array.from(document.querySelectorAll("[data-pixel-motion]"));
    if (!hosts.length) return;

    const CONFIG = {
        hero: { cell: 8, density: 0.018, sweepSpeed: 0.08, signalSpeed: 4.4, accentRatio: 0.16 },
        guide: { cell: 10, density: 0.014, sweepSpeed: 0.065, signalSpeed: 3.3, accentRatio: 0.12 },
        doc: { cell: 10, density: 0.012, sweepSpeed: 0.06, signalSpeed: 3.1, accentRatio: 0.1 },
        reader: { cell: 7, density: 0.022, sweepSpeed: 0.09, signalSpeed: 5.4, accentRatio: 0.08 },
    };

    class PixelField {
        constructor(host) {
            this.host = host;
            this.kind = host.dataset.pixelMotion || "hero";
            this.config = CONFIG[this.kind] || CONFIG.hero;
            this.layer = document.createElement("div");
            this.layer.className = "pixel-motion-layer";
            this.canvas = document.createElement("canvas");
            this.layer.appendChild(this.canvas);
            this.host.prepend(this.layer);

            this.ctx = this.canvas.getContext("2d", { alpha: true });
            this.dpr = Math.min(window.devicePixelRatio || 1, 2);
            this.width = 0;
            this.height = 0;
            this.cols = 0;
            this.rows = 0;
            this.signals = [];
            this.blips = [];
            this.lastFrame = 0;
            this.active = true;
            this.frameHandle = 0;

            this.onResize = this.resize.bind(this);
            this.loop = this.loop.bind(this);

            this.resize();
            this.installObservers();
            this.frameHandle = window.requestAnimationFrame(this.loop);
        }

        installObservers() {
            window.addEventListener("resize", this.onResize, { passive: true });

            if ("ResizeObserver" in window) {
                this.resizeObserver = new ResizeObserver(() => this.resize());
                this.resizeObserver.observe(this.host);
            }

            if ("IntersectionObserver" in window) {
                this.intersectionObserver = new IntersectionObserver(
                    ([entry]) => {
                        this.active = Boolean(entry && entry.isIntersecting);
                        if (this.active && !this.frameHandle) {
                            this.frameHandle = window.requestAnimationFrame(this.loop);
                        }
                    },
                    { threshold: 0.05 },
                );
                this.intersectionObserver.observe(this.host);
            }
        }

        resize() {
            const rect = this.host.getBoundingClientRect();
            this.width = Math.max(1, Math.floor(rect.width));
            this.height = Math.max(1, Math.floor(rect.height));
            this.canvas.width = Math.max(1, Math.floor(this.width * this.dpr));
            this.canvas.height = Math.max(1, Math.floor(this.height * this.dpr));
            this.canvas.style.width = `${this.width}px`;
            this.canvas.style.height = `${this.height}px`;
            this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

            this.cols = Math.max(1, Math.ceil(this.width / this.config.cell));
            this.rows = Math.max(1, Math.ceil(this.height / this.config.cell));
            this.seed();
        }

        seed() {
            const signalCount = Math.max(6, Math.round(this.cols * this.config.density * 4.8));
            const blinkCount = Math.max(10, Math.round(this.cols * this.rows * this.config.density * 0.24));

            this.signals = Array.from({ length: signalCount }, () => this.makeSignal(true));
            this.blips = Array.from({ length: blinkCount }, () => this.makeBlip());
        }

        makeSignal(randomizeOffset = false) {
            return {
                col: Math.floor(Math.random() * this.cols),
                length: 2 + Math.floor(Math.random() * 4),
                speed: this.config.signalSpeed * (0.7 + Math.random() * 0.8),
                offset: randomizeOffset ? Math.random() * this.rows : -Math.random() * 8,
                tint: Math.random() < this.config.accentRatio ? "accent" : (Math.random() < 0.18 ? "teal" : "neutral"),
            };
        }

        makeBlip() {
            return {
                col: Math.floor(Math.random() * this.cols),
                row: Math.floor(Math.random() * this.rows),
                phase: Math.random() * Math.PI * 2,
                speed: 0.9 + Math.random() * 1.7,
                tint: Math.random() < 0.12 ? "accent" : (Math.random() < 0.24 ? "teal" : "neutral"),
            };
        }

        color(tint, alpha) {
            if (tint === "accent") return `rgba(255, 122, 38, ${alpha})`;
            if (tint === "teal") return `rgba(93, 255, 219, ${alpha})`;
            return `rgba(210, 219, 229, ${alpha})`;
        }

        drawCell(col, row, alpha, tint, inset = 1) {
            if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) return;

            const size = Math.max(1, this.config.cell - inset * 2);
            const x = col * this.config.cell + inset;
            const y = row * this.config.cell + inset;

            this.ctx.fillStyle = this.color(tint, alpha);
            this.ctx.fillRect(x, y, size, size);
        }

        drawSignals(time) {
            for (const signal of this.signals) {
                const cursor = ((time * signal.speed + signal.offset) % (this.rows + signal.length + 8)) - signal.length;
                const head = Math.floor(cursor);

                for (let trail = 0; trail < signal.length; trail += 1) {
                    const row = head - trail;
                    const alpha = Math.max(0, 0.24 - trail * 0.05);
                    this.drawCell(signal.col, row, alpha, signal.tint, 1);
                }
            }
        }

        drawBlips(time) {
            for (const blip of this.blips) {
                const wave = (Math.sin(time * blip.speed + blip.phase) + 1) / 2;
                const alpha = wave * wave * 0.16;
                this.drawCell(blip.col, blip.row, alpha, blip.tint, 2);
            }
        }

        drawSweep(time) {
            const travel = (time * this.config.sweepSpeed * this.height) % (this.height + 120);
            const centerY = travel - 48;
            const gradient = this.ctx.createLinearGradient(0, centerY - 28, 0, centerY + 28);
            gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
            gradient.addColorStop(0.45, "rgba(255, 255, 255, 0.03)");
            gradient.addColorStop(0.5, "rgba(255, 122, 38, 0.045)");
            gradient.addColorStop(0.55, "rgba(255, 255, 255, 0.03)");
            gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, centerY - 28, this.width, 56);
        }

        render(timestamp) {
            const time = timestamp * 0.001;
            this.ctx.clearRect(0, 0, this.width, this.height);
            this.drawSignals(time);
            this.drawBlips(time);
            this.drawSweep(time);
        }

        loop(timestamp) {
            this.frameHandle = 0;
            if (!this.active) return;
            if (timestamp - this.lastFrame >= 1000 / 24) {
                this.lastFrame = timestamp;
                this.render(timestamp);
            }
            this.frameHandle = window.requestAnimationFrame(this.loop);
        }
    }

    const fields = hosts.map((host) => new PixelField(host));

    media.addEventListener?.("change", (event) => {
        if (!event.matches) return;
        for (const field of fields) {
            if (field.frameHandle) {
                window.cancelAnimationFrame(field.frameHandle);
            }
        }
    });
})();
