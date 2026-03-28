(function () {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    const hosts = Array.from(document.querySelectorAll("[data-pixel-motion]"));
    if (!hosts.length) return;

    const CONFIG = {
        hero: { cell: 6, density: 0.04, sweepSpeed: 0.142, signalSpeed: 6.2, accentRatio: 0.28, fps: 42, burstFactor: 0.42, packetFactor: 0.08 },
        guide: { cell: 8, density: 0.022, sweepSpeed: 0.092, signalSpeed: 4.4, accentRatio: 0.18, fps: 34, burstFactor: 0.26, packetFactor: 0.04 },
        doc: { cell: 8, density: 0.018, sweepSpeed: 0.082, signalSpeed: 4.1, accentRatio: 0.14, fps: 34, burstFactor: 0.24, packetFactor: 0.03 },
        reader: { cell: 6, density: 0.03, sweepSpeed: 0.118, signalSpeed: 5.8, accentRatio: 0.12, fps: 40, burstFactor: 0.38, packetFactor: 0.05 },
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
            this.bursts = [];
            this.packets = [];
            this.lastFrame = 0;
            this.active = true;
            this.boost = 0;
            this.boostTarget = 0;
            this.frameHandle = 0;

            this.onResize = this.resize.bind(this);
            this.loop = this.loop.bind(this);

            this.resize();
            this.installObservers();
            this.frameHandle = window.requestAnimationFrame(this.loop);
        }

        installObservers() {
            window.addEventListener("resize", this.onResize, { passive: true });

            this.host.addEventListener("pointerenter", () => {
                this.boostTarget = 1;
            });

            this.host.addEventListener("pointerleave", () => {
                this.boostTarget = 0;
            });

            this.host.addEventListener("focusin", () => {
                this.boostTarget = 1;
            });

            this.host.addEventListener("focusout", () => {
                this.boostTarget = 0;
            });

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
            const burstCount = Math.max(2, Math.round(this.rows * this.config.burstFactor * 0.08));
            const packetCount = Math.max(2, Math.round(this.cols * (this.config.packetFactor || 0.04)));

            this.signals = Array.from({ length: signalCount }, () => this.makeSignal(true));
            this.blips = Array.from({ length: blinkCount }, () => this.makeBlip());
            this.bursts = Array.from({ length: burstCount }, () => this.makeBurst());
            this.packets = Array.from({ length: packetCount }, () => this.makePacket());
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

        makeBurst() {
            return {
                row: Math.floor(Math.random() * this.rows),
                width: 6 + Math.floor(Math.random() * 12),
                speed: 0.16 + Math.random() * 0.22,
                phase: Math.random() * (this.cols + 18),
                tint: Math.random() < this.config.accentRatio ? "accent" : "teal",
            };
        }

        makePacket() {
            return {
                lane: Math.floor(Math.random() * this.rows),
                phase: Math.random() * (this.cols + 24),
                speed: 0.12 + Math.random() * 0.18,
                drift: 0.8 + Math.random() * 1.6,
                spread: 1 + Math.floor(Math.random() * 3),
                tint: Math.random() < this.config.accentRatio ? "accent" : "teal",
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

                for (let trail = 0; trail < signal.length; trail += 1) {
                    const position = cursor - trail;
                    const baseRow = Math.floor(position);
                    const mix = position - baseRow;
                    const alpha = Math.max(0, 0.22 - trail * 0.045) * (1 + this.boost * 0.18);

                    this.drawCell(signal.col, baseRow, alpha * (1 - mix), signal.tint, 1);
                    this.drawCell(signal.col, baseRow + 1, alpha * mix * 0.72, signal.tint, 1);
                }
            }
        }

        drawBlips(time) {
            for (const blip of this.blips) {
                const wave = (Math.sin(time * blip.speed + blip.phase) + 1) / 2;
                const alpha = wave * wave * (0.18 + this.boost * 0.04);
                this.drawCell(blip.col, blip.row, alpha, blip.tint, 2);
            }
        }

        drawBursts(time) {
            for (const burst of this.bursts) {
                const x = ((time * burst.speed * this.cols) + burst.phase) % (this.cols + burst.width + 12) - burst.width;

                for (let offset = 0; offset < burst.width; offset += 1) {
                    const col = Math.floor(x + offset);
                    const fade = 1 - offset / burst.width;
                    const alpha = fade * 0.13 * (1 + this.boost * 0.34);
                    this.drawCell(col, burst.row, alpha, burst.tint, 2);
                }
            }
        }

        drawPackets(time) {
            for (const packet of this.packets) {
                const lead = ((time * packet.speed * this.cols) + packet.phase) % (this.cols + 20) - 10;
                const centerRow = packet.lane + Math.sin(time * packet.drift + packet.phase) * packet.spread;

                for (let trail = 0; trail < 5; trail += 1) {
                    const col = Math.floor(lead - trail);
                    const row = Math.round(centerRow + (trail % 2 === 0 ? 0 : 1));
                    const alpha = Math.max(0, 0.18 - trail * 0.03) * (1 + this.boost * 0.16);
                    this.drawCell(col, row, alpha, packet.tint, 1);
                    this.drawCell(col - 1, row, alpha * 0.56, packet.tint, 2);
                }
            }
        }

        drawSweep(time) {
            const travel = (time * this.config.sweepSpeed * this.height) % (this.height + 120);
            const centerY = travel - 48;
            const gradient = this.ctx.createLinearGradient(0, centerY - 28, 0, centerY + 28);
            gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
            gradient.addColorStop(0.42, `rgba(255, 255, 255, ${0.042 + this.boost * 0.018})`);
            gradient.addColorStop(0.5, `rgba(255, 122, 38, ${0.08 + this.boost * 0.022})`);
            gradient.addColorStop(0.58, `rgba(93, 255, 219, ${0.05 + this.boost * 0.018})`);
            gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, centerY - 28, this.width, 56);
        }

        render(timestamp) {
            const time = timestamp * 0.001;
            this.boost += (this.boostTarget - this.boost) * 0.08;
            this.ctx.clearRect(0, 0, this.width, this.height);
            this.drawSignals(time);
            this.drawBlips(time);
            this.drawBursts(time);
            this.drawPackets(time);
            this.drawSweep(time);
        }

        loop(timestamp) {
            this.frameHandle = 0;
            if (!this.active) return;
            if (timestamp - this.lastFrame >= 1000 / this.config.fps) {
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
