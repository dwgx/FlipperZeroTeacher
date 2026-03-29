(function () {
    const root = document.querySelector("[data-flipper-sim]");
    if (!root) return;

    const menu = root.querySelector("[data-sim-menu]");
    const detail = root.querySelector("[data-sim-detail]");
    const modeNode = root.querySelector("[data-sim-mode]");
    const positionNode = root.querySelector("[data-sim-position]");
    const softkeyLeft = root.querySelector("[data-sim-softkey-left]");
    const softkeyCenter = root.querySelector("[data-sim-softkey-center]");
    const softkeyRight = root.querySelector("[data-sim-softkey-right]");

    const VISIBLE_ROWS = 4;

    const menuTree = {
        title: "MAIN MENU",
        led: "main",
        items: [
            {
                title: "START HERE",
                led: "main",
                children: [
                    {
                        title: "CN GUIDE",
                        icon: "./assets/official/icons/developer-mode.svg",
                        led: "main",
                        detail: "11 chapters from device basics to build flow.",
                    },
                    {
                        title: "MASTER CN",
                        icon: "./assets/official/icons/usb-connected.svg",
                        led: "main",
                        detail: "Big-picture map for protocols, tools and routes.",
                    },
                    {
                        title: "MANIFEST",
                        icon: "./assets/official/icons/backup.svg",
                        led: "docs",
                        detail: "Check every markdown file, snapshot and new entry.",
                    },
                ],
            },
            {
                title: "DESKTOP",
                led: "desktop",
                children: [
                    {
                        title: "UPDATE",
                        icon: "./assets/official/icons/update.svg",
                        led: "desktop",
                        detail: "Firmware channels, install flow and recovery path.",
                    },
                    {
                        title: "BACKUP",
                        icon: "./assets/official/icons/backup.svg",
                        led: "desktop",
                        detail: "Archive, restore and file safety in one desktop path.",
                    },
                    {
                        title: "CLI BRIDGE",
                        icon: "./assets/official/icons/usb-connected.svg",
                        led: "desktop",
                        detail: "Serial, RPC and scripted control for device work.",
                    },
                ],
            },
            {
                title: "BUILD LAB",
                led: "build",
                children: [
                    {
                        title: "FBT",
                        icon: "./assets/official/icons/developer-mode.svg",
                        led: "build",
                        detail: "Native firmware build and low-level debug route.",
                    },
                    {
                        title: "UFBT",
                        icon: "./assets/official/icons/developer-mode.svg",
                        led: "build",
                        detail: "Fast loop for external apps and release testing.",
                    },
                    {
                        title: "DEBUG",
                        icon: "./assets/official/icons/usb-connected.svg",
                        led: "build",
                        detail: "Logs, probes and dev board checks for failures.",
                    },
                ],
            },
            {
                title: "PROTOCOLS",
                led: "protocols",
                children: [
                    {
                        title: "NFC",
                        icon: "./assets/official/icons/nfc.svg",
                        led: "protocols",
                        detail: "Read, parse and emulate card formats cleanly.",
                    },
                    {
                        title: "SUB-GHZ",
                        icon: "./assets/official/icons/subghz.svg",
                        led: "protocols",
                        detail: "Region, presets and transmit path overview.",
                    },
                    {
                        title: "INFRARED",
                        icon: "./assets/official/icons/infrared.svg",
                        led: "protocols",
                        detail: "Signals, remotes and decode flow in one place.",
                    },
                ],
            },
            {
                title: "DOCS HUB",
                led: "docs",
                children: [
                    {
                        title: "SOURCE",
                        icon: "./assets/official/icons/developer-mode.svg",
                        led: "docs",
                        detail: "Firmware source analysis and code-level reading.",
                    },
                    {
                        title: "EN ENTRY",
                        icon: "./assets/official/icons/u2f.svg",
                        led: "docs",
                        detail: "English README and mirrored navigation entry.",
                    },
                    {
                        title: "ARCHIVE",
                        icon: "./assets/official/icons/backup.svg",
                        led: "docs",
                        detail: "Legacy notes, snapshots and historical references.",
                    },
                ],
            },
        ],
    };

    const state = {
        stack: [{ node: menuTree, index: 0 }],
        pageOpen: false,
    };

    const pulseTimers = new WeakMap();
    let refreshTimer = 0;
    let ledTimer = 0;

    const getNodeItems = (node) => node.items || node.children || [];
    const currentFrame = () => state.stack[state.stack.length - 1];
    const currentNode = () => currentFrame().node;
    const currentItems = () => getNodeItems(currentNode());
    const currentItem = () => currentItems()[currentFrame().index] || null;
    const hasChildren = (item) => getNodeItems(item).length > 0;

    function escapeHtml(value) {
        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#39;");
    }

    function visibleWindow(items, index) {
        if (items.length <= VISIBLE_ROWS) {
            return { start: 0, end: items.length };
        }

        const maxStart = items.length - VISIBLE_ROWS;
        const start = Math.max(0, Math.min(maxStart, index - 1));
        return { start, end: start + VISIBLE_ROWS };
    }

    function resolveLed() {
        const item = currentItem();
        if (state.pageOpen && item) return item.led || currentNode().led || "leaf";
        return currentNode().led || (item && item.led) || "main";
    }

    function setSoftkeys() {
        if (!softkeyLeft || !softkeyCenter || !softkeyRight) return;
        const item = currentItem();
        softkeyLeft.textContent = "";
        softkeyCenter.textContent = state.pageOpen ? "close" : item && hasChildren(item) ? "enter" : "open";
        softkeyRight.textContent = state.stack.length > 1 || state.pageOpen ? "back" : "exit";
    }

    function renderMenu() {
        if (!menu) return;
        const items = currentItems();
        const activeIndex = currentFrame().index;
        const { start, end } = visibleWindow(items, activeIndex);
        const visibleItems = items.slice(start, end);

        menu.innerHTML = visibleItems
            .map((item, offset) => {
                const index = start + offset;
                const active = index === activeIndex ? " is-active" : "";
                const kind = hasChildren(item) ? " is-parent" : " is-leaf";
                return `
                    <button class="flipper-sim-item${active}${kind}" type="button" data-item-index="${index}">
                        <strong>${escapeHtml(item.title)}</strong>
                    </button>
                `;
            })
            .join("");

        if (items.length > VISIBLE_ROWS) {
            const railHeight = Math.max(24, visibleItems.length * 13 - 2);
            const thumbHeight = Math.max(8, Math.round((VISIBLE_ROWS / items.length) * railHeight));
            const travel = Math.max(0, railHeight - thumbHeight);
            const ratio = (items.length - VISIBLE_ROWS) > 0 ? start / (items.length - VISIBLE_ROWS) : 0;
            menu.dataset.scrollable = "true";
            menu.style.setProperty("--scroll-thumb-top", `${2 + Math.round(travel * ratio)}px`);
            menu.style.setProperty("--scroll-thumb-height", `${thumbHeight}px`);
        } else {
            menu.dataset.scrollable = "false";
            menu.style.removeProperty("--scroll-thumb-top");
            menu.style.removeProperty("--scroll-thumb-height");
        }
    }

    function renderDetail() {
        if (!detail) return;
        const item = currentItem();

        if (!state.pageOpen || !item || hasChildren(item)) {
            detail.innerHTML = "";
            return;
        }

        const icon = item.icon ? `<img class="flipper-sim-page-icon" src="${escapeHtml(item.icon)}" alt="" loading="lazy">` : "";
        detail.innerHTML = `
            <div class="flipper-sim-page">
                ${icon}
                <div class="flipper-sim-page-copy">
                    <span class="flipper-sim-detail-meta">${escapeHtml(currentNode().title)}</span>
                    <strong>${escapeHtml(item.title)}</strong>
                    <p>${escapeHtml(item.detail || "Open item")}</p>
                </div>
            </div>
        `;
    }

    function renderStatus() {
        const item = currentItem();
        const items = currentItems();
        if (modeNode) {
            modeNode.textContent = state.pageOpen && item ? item.title : currentNode().title;
        }
        if (positionNode) {
            positionNode.textContent = `${Math.max(1, currentFrame().index + 1)}/${Math.max(1, items.length)}`;
        }
    }

    function render() {
        root.dataset.pageOpen = String(state.pageOpen);
        root.dataset.led = resolveLed();
        setSoftkeys();
        renderStatus();
        renderMenu();
        renderDetail();
    }

    function triggerRefresh() {
        root.classList.remove("is-refreshing");
        window.clearTimeout(refreshTimer);
        window.requestAnimationFrame(() => {
            root.classList.add("is-refreshing");
            refreshTimer = window.setTimeout(() => root.classList.remove("is-refreshing"), 160);
        });
    }

    function triggerLedPulse() {
        root.classList.remove("is-led-pulse");
        window.clearTimeout(ledTimer);
        window.requestAnimationFrame(() => root.classList.add("is-led-pulse"));
        ledTimer = window.setTimeout(() => root.classList.remove("is-led-pulse"), 280);
    }

    function pulseButton(name) {
        root.querySelectorAll(`[data-button="${name}"]`).forEach((button) => {
            button.classList.remove("is-pressed");
            window.clearTimeout(pulseTimers.get(button));
            window.requestAnimationFrame(() => button.classList.add("is-pressed"));
            const timer = window.setTimeout(() => button.classList.remove("is-pressed"), 160);
            pulseTimers.set(button, timer);
        });
    }

    function moveItem(step) {
        const frame = currentFrame();
        const items = currentItems();
        if (!items.length) return;
        state.pageOpen = false;
        frame.index = (frame.index + step + items.length) % items.length;
        render();
        triggerRefresh();
    }

    function openCurrent() {
        const item = currentItem();
        if (!item) return;

        if (hasChildren(item)) {
            state.stack.push({ node: item, index: 0 });
            state.pageOpen = false;
        } else {
            state.pageOpen = !state.pageOpen;
        }

        render();
        triggerRefresh();
        triggerLedPulse();
    }

    function goBack() {
        if (state.pageOpen) {
            state.pageOpen = false;
            render();
            triggerRefresh();
            triggerLedPulse();
            return;
        }

        if (state.stack.length > 1) {
            state.stack.pop();
            render();
            triggerRefresh();
            triggerLedPulse();
            return;
        }

        currentFrame().index = 0;
        render();
        triggerRefresh();
    }

    function handleControl(name) {
        pulseButton(name);

        if (name === "up") {
            moveItem(-1);
            return;
        }
        if (name === "down") {
            moveItem(1);
            return;
        }
        if (name === "right" || name === "ok") {
            openCurrent();
            return;
        }
        if (name === "left" || name === "back") {
            goBack();
        }
    }

    root.querySelectorAll("[data-button]").forEach((button) => {
        button.addEventListener("click", () => handleControl(button.dataset.button));
    });

    if (menu) {
        menu.addEventListener("click", (event) => {
            const button = event.target.closest("[data-item-index]");
            if (!button) return;
            currentFrame().index = Number(button.dataset.itemIndex) || 0;
            state.pageOpen = false;
            render();
            triggerRefresh();
            openCurrent();
        });
    }

    root.addEventListener("keydown", (event) => {
        const keyMap = {
            ArrowUp: "up",
            ArrowDown: "down",
            ArrowLeft: "left",
            ArrowRight: "right",
            Enter: "ok",
            " ": "ok",
            Spacebar: "ok",
            Escape: "back",
            Backspace: "back",
        };
        const control = keyMap[event.key] || (event.code === "Space" ? "ok" : "");
        if (!control) return;
        event.preventDefault();
        handleControl(control);
    });

    root.addEventListener("pointerdown", () => root.focus());

    render();
    window.setTimeout(() => {
        root.dataset.booted = "true";
        triggerLedPulse();
    }, 220);
})();
