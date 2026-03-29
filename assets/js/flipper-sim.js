(function () {
    const root = document.querySelector("[data-flipper-sim]");
    if (!root) return;

    const shell = root.querySelector(".flipper-sim-shell");
    const menu = root.querySelector("[data-sim-menu]");
    const detail = root.querySelector("[data-sim-detail]");
    const modeNode = root.querySelector("[data-sim-mode]");
    const positionNode = root.querySelector("[data-sim-position]");
    const pathNode = root.querySelector("[data-sim-path]");
    const softkeyLeft = root.querySelector("[data-sim-softkey-left]");
    const softkeyCenter = root.querySelector("[data-sim-softkey-center]");
    const softkeyRight = root.querySelector("[data-sim-softkey-right]");

    const menuTree = {
        title: "Main Menu",
        led: "main",
        items: [
            {
                title: "Desktop Chain",
                meta: "qflipper / cli",
                summary: "把更新、备份、CLI 和投屏统一到一条桌面链路里。",
                tags: ["desktop", "qFlipper", "workflow"],
                led: "desktop",
                children: [
                    {
                        title: "qFlipper",
                        meta: "update / backup",
                        summary: "桌面端主入口，先处理更新、恢复和文件流。",
                        tags: ["desktop", "firmware", "archive"],
                        led: "desktop",
                        children: [
                            {
                                title: "Update Center",
                                meta: "stable / preview",
                                detail: "先看通道、版本和恢复路径，再决定是稳定更新还是预览构建。",
                                tags: ["update", "channel", "recovery"],
                            },
                            {
                                title: "Backup Kit",
                                meta: "archive / restore",
                                detail: "Archive、配置和资源按一套可恢复流程处理，不再散在文档里。",
                                tags: ["backup", "restore", "archive"],
                            },
                            {
                                title: "Screen Stream",
                                meta: "cast / inspect",
                                detail: "投屏只作为桌面流的一环，用于观察、录屏和核对状态。",
                                tags: ["screen", "stream", "inspect"],
                            },
                        ],
                    },
                    {
                        title: "CLI Bridge",
                        meta: "serial / rpc",
                        summary: "命令行和 RPC 都当成桌面桥接层来理解。",
                        tags: ["cli", "rpc", "serial"],
                        led: "desktop",
                        children: [
                            {
                                title: "Serial CLI",
                                meta: "input / shell",
                                detail: "用 CLI 处理 `input_send`、日志和设备状态，适合自动化和回归。",
                                tags: ["cli", "input_send", "automation"],
                            },
                            {
                                title: "RPC Scripts",
                                meta: "files / device",
                                detail: "把文件、信息读取和桌面脚本整合成一条设备桥接能力线。",
                                tags: ["rpc", "files", "scripts"],
                            },
                        ],
                    },
                    {
                        title: "Assets",
                        meta: "official / mirror",
                        summary: "官方资产、镜像和索引都放在同一个支线里。",
                        tags: ["assets", "mirror", "index"],
                        led: "desktop",
                        children: [
                            {
                                title: "Official Docs",
                                meta: "core path",
                                detail: "稳定主线从官方精读总表进入，不和桌面链路重复占位。",
                                tags: ["official", "docs", "core"],
                            },
                            {
                                title: "Manifest",
                                meta: "all markdown",
                                detail: "新增 Markdown、覆盖率和快照先走索引，不靠首页猜位置。",
                                tags: ["manifest", "coverage", "wiki"],
                            },
                        ],
                    },
                ],
            },
            {
                title: "Build / Debug",
                meta: "fbt / devboard",
                summary: "把构建、应用开发、调试和开发板收成一条开发支线。",
                tags: ["build", "debug", "devboard"],
                led: "build",
                children: [
                    {
                        title: "Build Stack",
                        meta: "fbt / ufbt",
                        summary: "构建层先分官方工程和外部应用，再看发布节奏。",
                        tags: ["fbt", "ufbt", "toolchain"],
                        led: "build",
                        children: [
                            {
                                title: "FBT",
                                meta: "native build",
                                detail: "完整工程和底层能力修改优先走 FBT，适合系统级调试。",
                                tags: ["fbt", "native", "firmware"],
                            },
                            {
                                title: "uFBT",
                                meta: "external apps",
                                detail: "外部应用开发更轻，适合先把功能模型和发布流程跑通。",
                                tags: ["ufbt", "apps", "release"],
                            },
                            {
                                title: "App Model",
                                meta: "fam / assets",
                                detail: "应用资源、application.fam 和包结构都归到构建链路里理解。",
                                tags: ["fam", "assets", "packaging"],
                            },
                        ],
                    },
                    {
                        title: "Debug Lab",
                        meta: "logs / probe",
                        summary: "日志、断点、探针和开发板集中到排障层。",
                        tags: ["debug", "logs", "probe"],
                        led: "build",
                        children: [
                            {
                                title: "Runtime Logs",
                                meta: "trace / inspect",
                                detail: "先看串口、日志和运行痕迹，再决定要不要下探到硬件。",
                                tags: ["logs", "trace", "runtime"],
                            },
                            {
                                title: "Dev Board",
                                meta: "board / bridge",
                                detail: "开发板和设备联动单独收一层，不再混进桌面入口。",
                                tags: ["devboard", "stlink", "bridge"],
                            },
                        ],
                    },
                    {
                        title: "Release Flow",
                        meta: "test / package",
                        summary: "从测试、打包到交付都按一条小闭环收口。",
                        tags: ["release", "test", "package"],
                        led: "build",
                        children: [
                            {
                                title: "Smoke Test",
                                meta: "device check",
                                detail: "先验证按钮、文件和关键协议路径，再决定是否发布。",
                                tags: ["smoke", "device", "qa"],
                            },
                            {
                                title: "Package",
                                meta: "artifact / notes",
                                detail: "把构建产物、说明和版本注记固定下来，降低回归成本。",
                                tags: ["package", "artifact", "notes"],
                            },
                        ],
                    },
                ],
            },
            {
                title: "Protocols",
                meta: "nfc / radio",
                summary: "协议域只保留高信号入口，强调能力边界和实现链路。",
                tags: ["nfc", "subghz", "infrared"],
                led: "protocols",
                children: [
                    {
                        title: "NFC",
                        meta: "cards / formats",
                        summary: "卡片格式、读写和模拟从同一层进入。",
                        tags: ["nfc", "cards", "formats"],
                        led: "protocols",
                        children: [
                            {
                                title: "Read / Parse",
                                meta: "dump / decode",
                                detail: "先理解卡片内容和格式，再决定后续处理链路。",
                                tags: ["read", "parse", "dump"],
                            },
                            {
                                title: "Emulate",
                                meta: "profile / test",
                                detail: "模拟放在格式理解之后，不单独作为炫技入口。",
                                tags: ["emulate", "profile", "test"],
                            },
                        ],
                    },
                    {
                        title: "Sub-GHz",
                        meta: "region / tx",
                        summary: "无线主线看频率、预设、区域和发送链路。",
                        tags: ["subghz", "region", "tx"],
                        led: "protocols",
                        children: [
                            {
                                title: "Region / Presets",
                                meta: "config / range",
                                detail: "先明确区域和预设，再看具体信号发送或接收路径。",
                                tags: ["region", "preset", "range"],
                            },
                            {
                                title: "TX Path",
                                meta: "async / cc1101",
                                detail: "发送入口、分发器和 CC1101 异步发射链路单独看。",
                                tags: ["tx", "cc1101", "async"],
                            },
                        ],
                    },
                    {
                        title: "Infrared / BLE",
                        meta: "services / decode",
                        summary: "红外和 BLE 都按系统服务角度理解，而不是当玩具模块拆碎。",
                        tags: ["infrared", "ble", "service"],
                        led: "protocols",
                        children: [
                            {
                                title: "Infrared",
                                meta: "remote / decode",
                                detail: "红外聚焦信号、解码和遥控场景，不和无线混讲。",
                                tags: ["infrared", "decode", "remote"],
                            },
                            {
                                title: "BLE",
                                meta: "companion / bridge",
                                detail: "BLE 放在 Companion 和服务桥接语境里，更接近真实实现。",
                                tags: ["ble", "companion", "bridge"],
                            },
                        ],
                    },
                ],
            },
            {
                title: "Docs / Archive",
                meta: "guide / search",
                summary: "课程、主知识库、英文入口和归档都从一条静态阅读链路进入。",
                tags: ["guide", "master", "search"],
                led: "docs",
                children: [
                    {
                        title: "Guide",
                        meta: "11 chapters",
                        summary: "顺序主线先讲设备、协议、开发和工具链。",
                        tags: ["guide", "study", "chapters"],
                        led: "docs",
                        children: [
                            {
                                title: "Study Map",
                                meta: "00 / route",
                                detail: "学习总图先定路线和边界，再决定深入哪条专题。",
                                tags: ["guide", "map", "entry"],
                            },
                            {
                                title: "Source Analysis",
                                meta: "10 / code",
                                detail: "源码级分析放在课程尾段，适合已经熟悉整体脉络后再进。",
                                tags: ["source", "analysis", "firmware"],
                            },
                        ],
                    },
                    {
                        title: "Knowledge Base",
                        meta: "cn / en",
                        summary: "中英文主知识库和官方整合页单独收纳。",
                        tags: ["kb", "cn", "en"],
                        led: "docs",
                        children: [
                            {
                                title: "Master CN",
                                meta: "big picture",
                                detail: "中文主知识库负责总览设备、协议、工具链和阅读顺序。",
                                tags: ["master", "cn", "overview"],
                            },
                            {
                                title: "README EN",
                                meta: "entry / english",
                                detail: "英文入口不再藏在搜索结果里，直接从知识库支线进入。",
                                tags: ["english", "readme", "entry"],
                            },
                        ],
                    },
                    {
                        title: "Search / Legacy",
                        meta: "index / archive",
                        summary: "索引、覆盖率、Wiki Resources 和历史版本都留在查全层。",
                        tags: ["search", "legacy", "wiki"],
                        led: "docs",
                        children: [
                            {
                                title: "Manifest",
                                meta: "all markdown",
                                detail: "用 All Markdown Manifest 快速核对新增文档和落位情况。",
                                tags: ["manifest", "index", "docs"],
                            },
                            {
                                title: "Legacy",
                                meta: "snapshots / refs",
                                detail: "历史版本和旧整理方式保留在归档层，避免压过主导航。",
                                tags: ["legacy", "archive", "refs"],
                            },
                        ],
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
    let tiltFrame = 0;
    let shellRect = null;
    let pointerClientX = 0;
    let pointerClientY = 0;

    const getNodeItems = (node) => node.items || node.children || [];
    const currentFrame = () => state.stack[state.stack.length - 1];
    const currentNode = () => currentFrame().node;
    const currentItems = () => getNodeItems(currentNode());
    const currentItem = () => currentItems()[currentFrame().index] || null;
    const hasChildren = (item) => getNodeItems(item).length > 0;
    const currentDepth = () => Math.max(0, state.stack.length - 1);

    function escapeHtml(value) {
        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#39;");
    }

    function renderTags(tags) {
        if (!tags || !tags.length) return "";
        return `<div class="flipper-sim-detail-tags">${tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>`;
    }

    function pathLabels(includeItem) {
        const labels = [menuTree.title];
        state.stack.slice(1).forEach((frame) => labels.push(frame.node.title));

        const item = currentItem();
        if (includeItem && item && !hasChildren(item)) labels.push(item.title);
        return labels;
    }

    function resolveLed() {
        if (state.pageOpen) return "leaf";
        const item = currentItem();
        return currentNode().led || (item && item.led) || "main";
    }

    function setSoftkeys() {
        if (!softkeyLeft || !softkeyCenter || !softkeyRight) return;
        const item = currentItem();
        const branch = item && hasChildren(item);

        softkeyLeft.textContent = "move";
        softkeyCenter.textContent = branch ? "enter" : state.pageOpen ? "close" : "open";
        softkeyRight.textContent = state.stack.length > 1 || state.pageOpen ? "back" : "exit";
    }

    function renderMenu() {
        const items = currentItems();
        menu.innerHTML = items
            .map((item, index) => {
                const active = index === currentFrame().index ? " is-active" : "";
                const kind = hasChildren(item) ? " is-parent" : " is-leaf";
                const meta = item.meta || (hasChildren(item) ? `${getNodeItems(item).length} items` : "open");
                return `
                    <button class="flipper-sim-item${active}${kind}" type="button" data-item-index="${index}">
                        <strong>${escapeHtml(item.title)}</strong>
                        <span>${escapeHtml(meta)}</span>
                    </button>
                `;
            })
            .join("");
    }

    function renderDetail() {
        if (!detail) return;

        const node = currentNode();
        const item = currentItem();
        if (!item) {
            detail.innerHTML = `
                <span class="flipper-sim-detail-meta">${escapeHtml(node.title)}</span>
                <strong>${escapeHtml(node.title)}</strong>
                <p>${escapeHtml(node.summary || "Select a menu item.")}</p>
                ${renderTags(node.tags || [])}
            `;
            return;
        }

        if (state.pageOpen && !hasChildren(item)) {
            detail.innerHTML = `
                <span class="flipper-sim-detail-meta">${escapeHtml(pathLabels(true).join(" / "))}</span>
                <strong>${escapeHtml(item.title)}</strong>
                <p>${escapeHtml(item.detail || item.summary || item.meta || "")}</p>
                ${renderTags(item.tags || [])}
            `;
            return;
        }

        if (hasChildren(item)) {
            detail.innerHTML = `
                <span class="flipper-sim-detail-meta">${escapeHtml(item.meta || `${getNodeItems(item).length} items`)}</span>
                <strong>${escapeHtml(item.title)}</strong>
                <p>${escapeHtml(item.summary || "Enter submenu.")}</p>
                ${renderTags(item.tags || [])}
            `;
            return;
        }

        detail.innerHTML = `
            <span class="flipper-sim-detail-meta">${escapeHtml(item.meta || "leaf")}</span>
            <strong>${escapeHtml(item.title)}</strong>
            <p>${escapeHtml(item.detail || item.summary || "")}</p>
            ${renderTags(item.tags || [])}
        `;
    }

    function renderStatus() {
        const items = currentItems();
        const item = currentItem();
        const node = currentNode();
        const statusTitle = state.pageOpen && item && !hasChildren(item) ? item.title : node.title;

        if (modeNode) modeNode.textContent = statusTitle;
        if (positionNode) {
            positionNode.textContent = `L${currentDepth()} ${Math.max(1, currentFrame().index + 1)} / ${Math.max(1, items.length)}`;
        }
        if (pathNode) {
            pathNode.textContent = pathLabels(state.pageOpen && item && !hasChildren(item)).join(" / ").toLowerCase();
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
            refreshTimer = window.setTimeout(() => root.classList.remove("is-refreshing"), 220);
        });
    }

    function triggerLedPulse() {
        root.classList.remove("is-led-pulse");
        window.clearTimeout(ledTimer);
        window.requestAnimationFrame(() => root.classList.add("is-led-pulse"));
        ledTimer = window.setTimeout(() => root.classList.remove("is-led-pulse"), 340);
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
            render();
            triggerRefresh();
            return;
        }

        state.pageOpen = !state.pageOpen;
        render();
        triggerRefresh();
    }

    function goBack() {
        if (state.pageOpen) {
            state.pageOpen = false;
            render();
            triggerRefresh();
            return;
        }

        if (state.stack.length > 1) {
            state.stack.pop();
            render();
            triggerRefresh();
            return;
        }

        currentFrame().index = 0;
        render();
        triggerRefresh();
    }

    function handleControl(name) {
        pulseButton(name);
        triggerLedPulse();

        if (name === "up") moveItem(-1);
        if (name === "down") moveItem(1);
        if (name === "right" || name === "ok") openCurrent();
        if (name === "left" || name === "back") goBack();
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

    if (shell) {
        const updateShellRect = () => {
            shellRect = shell.getBoundingClientRect();
        };

        const applyTilt = () => {
            tiltFrame = 0;
            if (!shellRect) updateShellRect();
            if (!shellRect) return;
            const px = ((pointerClientX - shellRect.left) / shellRect.width) - 0.5;
            const py = ((pointerClientY - shellRect.top) / shellRect.height) - 0.5;
            shell.style.setProperty("--tilt-y", `${-4 + (px * 7)}deg`);
            shell.style.setProperty("--tilt-x", `${2 + (-py * 6)}deg`);
        };

        shell.addEventListener("pointerenter", updateShellRect);
        window.addEventListener("resize", updateShellRect);

        shell.addEventListener("pointermove", (event) => {
            if (window.matchMedia("(pointer: coarse)").matches) return;
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
            pointerClientX = event.clientX;
            pointerClientY = event.clientY;
            if (tiltFrame) return;
            tiltFrame = window.requestAnimationFrame(applyTilt);
        });

        shell.addEventListener("pointerleave", () => {
            if (tiltFrame) window.cancelAnimationFrame(tiltFrame);
            tiltFrame = 0;
            shell.style.removeProperty("--tilt-x");
            shell.style.removeProperty("--tilt-y");
        });
    }

    render();
    window.setTimeout(() => {
        root.dataset.booted = "true";
        triggerLedPulse();
    }, 220);
})();
