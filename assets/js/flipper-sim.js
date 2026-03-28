(function () {
    const root = document.querySelector("[data-flipper-sim]");
    if (!root) return;

    const shell = root.querySelector(".flipper-sim-shell");
    const menu = root.querySelector("[data-sim-menu]");
    const detail = root.querySelector("[data-sim-detail]");
    const modeNode = root.querySelector("[data-sim-mode]");
    const positionNode = root.querySelector("[data-sim-position]");
    const softkeyLeft = root.querySelector("[data-sim-softkey-left]");
    const softkeyCenter = root.querySelector("[data-sim-softkey-center]");
    const softkeyRight = root.querySelector("[data-sim-softkey-right]");

    const views = [
        {
            label: "Desktop Chain",
            summary: "用一条桌面链路处理更新、备份、CLI 和投屏。",
            tags: ["qFlipper", "Update", "Backup"],
            items: [
                {
                    title: "Update",
                    meta: "stable / preview",
                    detail: "统一看版本、升级通道和固件分发，不用在首页跳来跳去。",
                    tags: ["channel", "firmware", "desktop"],
                },
                {
                    title: "Backup",
                    meta: "archive / restore",
                    detail: "把 Archive、资源和状态整理成可恢复的桌面工作流。",
                    tags: ["archive", "restore", "assets"],
                },
                {
                    title: "CLI",
                    meta: "device bridge",
                    detail: "命令行和桌面端桥接放在同一条入口，不再拆成多层文档。",
                    tags: ["cli", "bridge", "tools"],
                },
                {
                    title: "Screen",
                    meta: "cast / inspect",
                    detail: "投屏和状态观察只作为桌面工作流的一部分，不单独抢首页主角。",
                    tags: ["screen", "inspect", "debug"],
                },
            ],
        },
        {
            label: "Build / Debug",
            summary: "把构建、调试、工具链和 Dev Board 归到一条开发支线。",
            tags: ["FBT", "uFBT", "Debug"],
            items: [
                {
                    title: "FBT",
                    meta: "native build",
                    detail: "原生构建主线，适合完整工程和底层能力调试。",
                    tags: ["build", "native", "toolchain"],
                },
                {
                    title: "uFBT",
                    meta: "external apps",
                    detail: "外部应用开发更轻，适合先把应用模型和发布流程跑通。",
                    tags: ["apps", "workflow", "publish"],
                },
                {
                    title: "Debug",
                    meta: "logging / probe",
                    detail: "日志、探针、断点和设备侧排障从这里进入。",
                    tags: ["logs", "probe", "trace"],
                },
                {
                    title: "Dev Board",
                    meta: "board / bridge",
                    detail: "开发板和设备联动归到同一支线，不再混进桌面或协议导航。",
                    tags: ["board", "bridge", "usb"],
                },
            ],
        },
        {
            label: "Protocols",
            summary: "协议域只保留高信号入口，强调能力边界而不是花哨装饰。",
            tags: ["NFC", "Sub-GHz", "IR"],
            items: [
                {
                    title: "NFC",
                    meta: "cards / emu",
                    detail: "卡片格式、读取写入和协议理解从这里分流。",
                    tags: ["nfc", "rfid", "cards"],
                },
                {
                    title: "Sub-GHz",
                    meta: "radio / presets",
                    detail: "频率、预设、发送链路和区域控制都归在无线主线。",
                    tags: ["radio", "presets", "range"],
                },
                {
                    title: "Infrared",
                    meta: "remote / decode",
                    detail: "红外只讲信号、解码和应用，不再散成零碎入口。",
                    tags: ["infrared", "remote", "decode"],
                },
                {
                    title: "BLE",
                    meta: "bridge / services",
                    detail: "BLE 放在系统服务和 Companion 语境里理解，更接近真实实现。",
                    tags: ["ble", "companion", "service"],
                },
            ],
        },
        {
            label: "Docs / Archive",
            summary: "课程、主知识库、索引和归档都从同一套静态阅读链路进入。",
            tags: ["Guide", "Master", "Search"],
            items: [
                {
                    title: "Guide",
                    meta: "11 chapters",
                    detail: "顺序主线先讲清设备、协议、开发和工具链。",
                    tags: ["guide", "study", "chapters"],
                },
                {
                    title: "Master",
                    meta: "big picture",
                    detail: "总览所有目录和主题，再决定进入哪条专题链路。",
                    tags: ["master", "overview", "kb"],
                },
                {
                    title: "Search",
                    meta: "lazy index",
                    detail: "全站搜索按需加载索引，新增 Markdown 不再被首页结构埋掉。",
                    tags: ["search", "index", "docs"],
                },
                {
                    title: "Archive",
                    meta: "refs / snapshots",
                    detail: "归档和镜像只作为参考层，不再压过主视觉和主导航。",
                    tags: ["archive", "refs", "snapshots"],
                },
            ],
        },
    ];

    const state = {
        viewIndex: 0,
        itemIndex: 0,
        detailOpen: false,
    };

    const pulseTimers = new WeakMap();
    let refreshTimer = 0;
    let tiltFrame = 0;
    let shellRect = null;
    let pointerClientX = 0;
    let pointerClientY = 0;

    const getView = () => views[state.viewIndex];
    const getItem = () => getView().items[state.itemIndex];

    function setSoftkeys() {
        if (!softkeyLeft || !softkeyCenter || !softkeyRight) return;
        softkeyLeft.textContent = "move";
        softkeyCenter.textContent = state.detailOpen ? "close" : "open";
        softkeyRight.textContent = state.detailOpen ? "back" : "home";
    }

    function renderMenu() {
        const view = getView();
        menu.innerHTML = view.items
            .map((item, index) => {
                const active = index === state.itemIndex ? " is-active" : "";
                return `
                    <button class="flipper-sim-item${active}" type="button" data-item-index="${index}">
                        <strong>${item.title}</strong>
                        <span>${item.meta}</span>
                    </button>
                `;
            })
            .join("");
    }

    function renderDetail() {
        const view = getView();
        const item = getItem();
        if (!detail) return;

        if (state.detailOpen) {
            detail.innerHTML = `
                <strong>${item.title}</strong>
                <p>${item.detail}</p>
                <div class="flipper-sim-detail-tags">${item.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
            `;
            return;
        }

        detail.innerHTML = `
            <strong>${view.label}</strong>
            <p>${view.summary}</p>
            <div class="flipper-sim-detail-tags">${view.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
        `;
    }

    function render() {
        const view = getView();
        if (modeNode) modeNode.textContent = view.label;
        if (positionNode) positionNode.textContent = `${state.viewIndex + 1} / ${views.length}`;
        setSoftkeys();
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

    function pulseButton(name) {
        root.querySelectorAll(`[data-button="${name}"]`).forEach((button) => {
            button.classList.remove("is-pressed");
            window.clearTimeout(pulseTimers.get(button));
            window.requestAnimationFrame(() => button.classList.add("is-pressed"));
            const timer = window.setTimeout(() => button.classList.remove("is-pressed"), 160);
            pulseTimers.set(button, timer);
        });
    }

    function changeView(step) {
        state.viewIndex = (state.viewIndex + step + views.length) % views.length;
        state.itemIndex = 0;
        state.detailOpen = false;
        render();
        triggerRefresh();
    }

    function moveItem(step) {
        const items = getView().items;
        state.itemIndex = (state.itemIndex + step + items.length) % items.length;
        render();
        triggerRefresh();
    }

    function openCurrent() {
        state.detailOpen = !state.detailOpen;
        render();
        triggerRefresh();
    }

    function goBack() {
        if (state.detailOpen) {
            state.detailOpen = false;
            render();
            triggerRefresh();
            return;
        }
        state.viewIndex = 0;
        state.itemIndex = 0;
        render();
        triggerRefresh();
    }

    function handleControl(name) {
        pulseButton(name);
        if (name === "left") changeView(-1);
        if (name === "right") changeView(1);
        if (name === "up") moveItem(-1);
        if (name === "down") moveItem(1);
        if (name === "ok") openCurrent();
        if (name === "back") goBack();
    }

    root.querySelectorAll("[data-button]").forEach((button) => {
        button.addEventListener("click", () => handleControl(button.dataset.button));
    });

    if (menu) {
        menu.addEventListener("click", (event) => {
            const button = event.target.closest("[data-item-index]");
            if (!button) return;
            state.itemIndex = Number(button.dataset.itemIndex) || 0;
            state.detailOpen = true;
            render();
            triggerRefresh();
        });
    }

    root.addEventListener("keydown", (event) => {
        const keyMap = {
            ArrowUp: "up",
            ArrowDown: "down",
            ArrowLeft: "left",
            ArrowRight: "right",
            Enter: "ok",
            Escape: "back",
            Backspace: "back",
        };
        const control = keyMap[event.key];
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
    }, 220);
})();
