# Flipper Zero 官方文档精读总表（中文）

更新时间：2026-03-24

这份文件的目标不是镜像官网，而是把 Flipper Zero 官方资料整理成一份适合人类阅读、也适合 AI 摄取的总表。

适用对象：

- 刚入门、想先看清楚菜单和设备边界的人
- 已经会用设备、想开始做 App 和脚本的人
- 想继续往固件、调试、硬件模块走的人
- 想把官方资料整理成长期知识库的人

## 1. 这份文件怎么用

推荐读法：

1. 先看 `第 3 节` 的学习顺序
2. 再看 `第 4 节` 的设备与生态官方页
3. 然后看 `第 5 节` 的开发者官方页
4. 最后用 `第 6 节` 和 `第 7 节` 去补高级页与官方仓库

如果你要把这份文档喂给 AI：

- 把 `页面` 当作知识节点
- 把 `为什么重要` 当作摘要
- 把 `高价值点` 当作检索标签
- 把 `建议放入知识库的位置` 当作分类字段

## 2. 官方资料其实分成三层

### 2.1 用户与设备文档

主入口：

- `https://docs.flipper.net/`

它解决的问题：

- 设备怎么用
- 菜单怎么走
- 官方桌面与移动生态怎么协作
- 硬件能力边界是什么
- 官方支持哪些协议域和外设

### 2.2 开发者文档

主入口：

- `https://developer.flipper.net/flipperzero/doxygen/`

它解决的问题：

- App 怎么写
- `application.fam` 怎么声明
- `.fap` 怎么构建和交付
- `FBT` / `uFBT` / VS Code / Dev Board 怎么协作
- JavaScript 路线怎么走
- 文件格式、系统层、硬件抽象是什么

### 2.3 官方 GitHub 仓库

高价值官方仓库：

- `https://github.com/flipperdevices/flipperzero-firmware`
- `https://github.com/flipperdevices/flipperzero-ufbt`
- `https://github.com/flipperdevices/flipper-application-catalog`
- `https://github.com/flipperdevices/flipperzero-good-faps`
- `https://github.com/flipperdevices/qFlipper`

它们不是附属品，而是文档的落地层：

- 文档给你结构
- 仓库给你真实实现、真实目录、真实工作流

## 3. 0 基础到会开发的官方阅读顺序

### 第 0 阶段：先理解设备本体

先读：

1. `https://docs.flipper.net/basics/desktop`
2. `https://docs.flipper.net/zero/development/hardware/tech-specs`
3. `https://docs.flipper.net/gpio-and-modules`

这一阶段的目标：

- 先知道设备菜单和数据入口
- 先知道硬件边界，不被社区神话带偏
- 先知道 GPIO、电源、模块、串口这些现实限制

### 第 1 阶段：理解官方生态层

再读：

1. `https://docs.flipper.net/qflipper`
2. `https://docs.flipper.net/mobile-app`
3. `https://docs.flipper.net/apps`
4. `https://docs.flipper.net/zero/development/cli`

这一阶段的目标：

- 会更新、备份、恢复、传文件、看日志
- 知道桌面端和移动端谁负责什么
- 知道 Apps 生态如何安装、更新、发布

### 第 2 阶段：理解设备能力域

再读：

1. `https://docs.flipper.net/nfc`
2. `https://docs.flipper.net/sub-ghz`
3. `https://docs.flipper.net/ibutton`
4. `https://docs.flipper.net/zero/u2f`

这一阶段的目标：

- 知道官方把能力域怎么切开
- 知道哪些是原生功能，哪些需要 App、脚本或外设
- 把“协议域”作为知识库主分类

### 第 3 阶段：开始官方开发路线

再读：

1. `https://developer.flipper.net/flipperzero/doxygen/`
2. `https://developer.flipper.net/flipperzero/doxygen/applications.html`
3. `https://developer.flipper.net/flipperzero/doxygen/app_manifests.html`
4. `https://developer.flipper.net/flipperzero/doxygen/apps_on_sd_card.html`
5. `https://developer.flipper.net/flipperzero/doxygen/app_examples.html`

这一阶段的目标：

- 明白 Flipper 开发先从 App 开始，不一定先改整机固件
- 明白 `FAM` 是声明层，`FAP` 是交付层
- 明白官方示例是“模式库”，不是一次性演示代码

### 第 4 阶段：掌握构建和调试

再读：

1. `https://developer.flipper.net/flipperzero/doxygen/dev_tools.html`
2. `https://developer.flipper.net/flipperzero/doxygen/fbt.html`
3. `https://developer.flipper.net/flipperzero/doxygen/vscode.html`
4. `https://developer.flipper.net/flipperzero/doxygen/dev_board.html`
5. `https://developer.flipper.net/flipperzero/doxygen/ota_updates.html`

这一阶段的目标：

- 理解官方构建链
- 理解 VS Code 工作区
- 知道 Dev Board 和 OTA 的官方机制

### 第 5 阶段：补脚本开发、系统编程、文件格式

再读：

1. `https://developer.flipper.net/flipperzero/doxygen/js.html`
2. `https://developer.flipper.net/flipperzero/doxygen/system.html`
3. `https://developer.flipper.net/flipperzero/doxygen/file_formats.html`
4. `https://developer.flipper.net/flipperzero/doxygen/files.html`
5. `https://developer.flipper.net/flipperzero/doxygen/annotated.html`

这一阶段的目标：

- 会走 JS 快速开发路线
- 看懂底层系统页和硬件抽象页
- 把文件格式纳入知识库，而不是把它们当附件

## 4. 设备、生态、硬件文档精读

### 4.1 Desktop

- 页面：`Desktop`
- URL：`https://docs.flipper.net/basics/desktop`
- 页面定位：设备桌面、状态栏、主菜单、Archive、Device Info、Quick Access Apps、Lock Menu 的总入口
- 为什么重要：这是整机交互地图，不先理解这页，后面很多“数据放哪里、功能从哪里进、状态怎么看”都会混乱
- 高价值点：
- 状态栏直接暴露 BLE、SD 卡、与 `qFlipper`/`Flipper Lab` 连接、外部模块连接、后台 App 等系统状态
- `Archive` 不只是文件夹，而是设备数据资产入口
- 这页会把你带到 `Sub-GHz`、`NFC`、`GPIO & modules`、`iButton`、`U2F`、`Apps`
- 建议放入知识库的位置：`设备界面 / 菜单地图 / 数据入口`

### 4.2 Tech Specs of Flipper Zero

- 页面：`Tech specs of Flipper Zero`
- URL：`https://docs.flipper.net/zero/development/hardware/tech-specs`
- 页面定位：整机官方规格表
- 为什么重要：任何“Flipper 能不能做某件事”的讨论，先回到这里，不要先信社区传说
- 高价值点：
- MCU：`STM32WB55RG`
- 应用核：`ARM Cortex-M4 64 MHz`
- 射频核：`ARM Cortex-M0+ 32 MHz`
- Sub-GHz 芯片：`CC1101`
- NFC 芯片：`ST25R3916`
- GPIO：`13` 个用户可用 I/O，`3.3V CMOS`，输入 `5V tolerant`
- BLE 版本官方写为 `Bluetooth LE 5.4`
- microSD 最大支持 `256 GB`，官方推荐 `2-32 GB`
- 建议放入知识库的位置：`硬件规格 / 能力边界 / 事实基线`

### 4.3 GPIO & Modules

- 页面：`GPIO & Modules`
- URL：`https://docs.flipper.net/gpio-and-modules`
- 页面定位：GPIO 引脚、电源脚、USB-UART 桥、模块插接说明
- 为什么重要：这是从“会用设备”走向“会接模块、会做外设、会排硬件问题”的桥梁页
- 高价值点：
- 顶部有 `18` 针，既有供电脚也有 I/O
- `+3.3V` 默认可用，但在某些流程中会暂时断电
- `+5V` 不默认开启，需要在 `GPIO` App 里手动打开
- 官方明确指出 Flipper 可以作为 `USB to UART / SPI / I2C` 转换器
- 文档强调功耗与机械插接，这些都是真实排障点
- 建议放入知识库的位置：`GPIO / 供电 / 模块连接 / 硬件实验`

### 4.4 qFlipper

- 页面：`qFlipper`
- URL：`https://docs.flipper.net/qflipper`
- 页面定位：官方桌面端管理工具
- 为什么重要：长期使用和开发调试都绕不开它
- 高价值点：
- 可做固件更新、数据库更新、文件管理
- `Advanced controls` 负责 `backup / restore / reset`
- 可远程控制设备、截图、看日志
- 有 `dev / rc / release` 更新通道概念
- Linux 侧还有 AppImage 权限与 `udev rules` 这种实战细节
- 建议放入知识库的位置：`桌面运维 / 更新 / 备份恢复 / 文件管理`

### 4.5 Flipper Mobile App

- 页面：`Flipper Mobile App`
- URL：`https://docs.flipper.net/mobile-app`
- 页面定位：官方移动端管理与 Apps 安装入口
- 为什么重要：它不是辅助工具，而是官方生态的正式入口
- 高价值点：
- 通过 BLE 更新固件
- 管理同步、归档、备份
- `Apps` 标签页可浏览与安装社区 App
- `Tools` 页会串到官方维护的工具与库
- 文档还写了同步失败时的具体排障细节
- 建议放入知识库的位置：`移动运维 / BLE 更新 / 生态入口`

### 4.6 Apps

- 页面：`Apps`
- URL：`https://docs.flipper.net/apps`
- 页面定位：官方 Apps 生态总入口
- 为什么重要：这是用户安装 App 和开发者理解分发链路的共同入口
- 高价值点：
- 官方安装入口同时指向 `Flipper Mobile App` 和 `Flipper Lab`
- 应用详情页会包含描述、大小、版本、changelog、manifest、repo
- 提交 App 会回到官方 catalog 仓库流程
- 旧资料里常写 `apps-catalog`，当前更准确的官方入口是 `apps`
- 建议放入知识库的位置：`Apps 生态 / 分发 / 安装流程`

### 4.7 Command-line interface

- 页面：`Command-line interface`
- URL：`https://docs.flipper.net/zero/development/cli`
- 页面定位：官方 CLI、日志与子系统 shell 入口
- 为什么重要：这是调试、自动化、日志抓取的核心页
- 高价值点：
- 官方列出通过浏览器、Web Serial、本地串口终端三种接入方式
- 支持多级别日志：`error / warn / info / debug / trace`
- `nfc`、`gpio`、`storage`、`subghz`、`input`、`ir` 等都有对应命令或 shell
- 这是把“设备会用”推进到“设备可调试”的关键一步
- 建议放入知识库的位置：`CLI / 自动化 / 日志 / 调试`

### 4.8 NFC

- 页面：`NFC`
- URL：`https://docs.flipper.net/nfc`
- 页面定位：官方 NFC 总览页
- 为什么重要：这是高频能力域的官方总入口
- 高价值点：
- 官方不只是讲读卡和保存，也讲 `Analyze reader`
- 页面会串到 `mfkey32`、密码解锁、magic cards、手动添加卡等高级主题
- 这类页面适合纳入知识库，但要保留合法授权边界，不做滥用教学
- 建议放入知识库的位置：`NFC / 能力总览 / 高级子页导航`

### 4.9 Sub-GHz

- 页面：`Sub-GHz`
- URL：`https://docs.flipper.net/sub-ghz`
- 页面定位：Sub-1 GHz 无线能力总入口
- 为什么重要：这是无线遥控、频率、读取、RAW、区域限制这些概念的官方起点
- 高价值点：
- 官方明确区分 `Read` 与 `Read RAW`
- 有 `Region information` 和频率边界概念
- 官方支持外接基于 `CC1101` 的外部模块
- 文档会把频率、供应商、添加新遥控器等子页串起来
- 建议放入知识库的位置：`Sub-GHz / 无线遥控 / 频率边界`

### 4.10 iButton

- 页面：`iButton`
- URL：`https://docs.flipper.net/ibutton`
- 页面定位：1-Wire / iButton 能力总览
- 为什么重要：这是很多人忽略，但官方支持很完整的原生能力
- 高价值点：
- 官方明确支持 `read / save / edit / write / emulate`
- 支持 `Dallas`、`Cyfral`、`Metakom`
- 文档说明三根 pogo pin 的物理作用
- 还解释平面部分和凸起部分在交互上的差异
- 建议放入知识库的位置：`iButton / 1-Wire / 接触式密钥`

### 4.11 U2F

- 页面：`U2F`
- URL：`https://docs.flipper.net/zero/u2f`
- 页面定位：把 Flipper 当作 USB U2F 安全密钥使用
- 为什么重要：这是被低估的原生安全功能
- 高价值点：
- 使用流程很简单，但文档明确要求注册与登录时关闭 `qFlipper`
- 官方给出多个站点的使用示例
- 它证明 Flipper 不只是“玩协议”，也能进入身份安全设备场景
- 建议放入知识库的位置：`U2F / 身份安全 / 原生功能`

### 4.12 Schematics of Flipper Zero

- 页面：`Schematics of Flipper Zero`
- URL：`https://docs.flipper.net/development/hardware/schematic`
- 页面定位：主板、iButton 板、NFC/RFID 板等官方原理图入口
- 为什么重要：这是硬件模块开发和低层调试的高价值基线页
- 高价值点：
- 适合查电源、MCU、LCD、CC1101、NFC/RFID 等块级连接
- 比规格页更接近真实电路关系
- 官方明确把它定位在模块开发与低层调试
- 建议放入知识库的位置：`硬件原理图 / 低层调试 / 参考设计`

### 4.13 Blueprints of Flipper Zero

- 页面：`Blueprints of Flipper Zero`
- URL：`https://docs.flipper.net/zero/development/hardware/flipper-blueprints`
- 页面定位：整机外形蓝图与 3D 模型入口
- 为什么重要：做配件、底座、外壳、治具时非常关键
- 高价值点：
- 它解决的是机械结构，不是电气结构
- 应和 `modules-blueprints` 一起看
- 这类页面常被开发者忽略，但做实体项目时会直接卡住
- 建议放入知识库的位置：`机械结构 / 外形尺寸 / 配件开发`

### 4.14 External modules blueprints

- 页面：`External modules blueprints`
- URL：`https://docs.flipper.net/development/hardware/modules-blueprints`
- 页面定位：外挂模块的几何参数、3D 模型、尺寸建议
- 为什么重要：模块机械兼容和插接外形都依赖它
- 高价值点：
- 区分 `regular` 与 `small` module
- 适合 PCB 外形、外壳、3D 打印、配件尺寸统一
- 建议放入知识库的位置：`模块外形标准 / 机械兼容`

### 4.15 ST-Link V3 Developer Board

- 页面：`ST-Link V3 Developer Board`
- URL：`https://docs.flipper.net/development/hardware/devboard-stlinkv3`
- 页面定位：官方高级调试板文档
- 为什么重要：这是固件烧录、在线调试、UART-to-USB 的重要硬件入口
- 高价值点：
- 基于 `STLINK-V3MODS`
- 页面会给出 `schematic / BOM / Altium project`
- 适合真正进入断点调试和 bring-up
- 建议放入知识库的位置：`硬件调试 / 固件烧录 / 调试板`

### 4.16 Wi-Fi Developer Board schematics

- 页面：`Wi-Fi Developer Board schematics`
- URL：`https://docs.flipper.net/zero/development/hardware/devboard-schematics`
- 页面定位：官方 Wi-Fi Dev Board 原理图与装配图入口
- 为什么重要：理解官方开发板硬件实现时非常有用
- 高价值点：
- 文档直接点名 `ESP32-S2-WROVER-N4R2`
- 适合核对供电、连接器、板级结构
- 建议放入知识库的位置：`开发板原理图 / ESP32-S2 / 外部板级参考`

## 5. 开发者文档精读

### 5.1 Developer Docs 首页

- 页面：`Flipper Developer Docs`
- URL：`https://developer.flipper.net/flipperzero/doxygen/`
- 页面定位：开发文档总入口
- 为什么重要：这是开发知识树的根
- 高价值点：
- 首页把文档明确切成 `Developer Tools`、`System Programming`、`App Development`、`JavaScript`、`Expansion Modules`、`File Formats`
- 另外还有自动生成的 `Data Structures` 与 `Files`
- 你做知识库时，应该直接按这套骨架分区
- 建议放入知识库的位置：`开发总纲 / 一级目录`

### 5.2 App Development

- 页面：`App Development`
- URL：`https://developer.flipper.net/flipperzero/doxygen/applications.html`
- 页面定位：官方 App 开发总入口
- 为什么重要：大多数开发者都应该从这里开始，不必一上来就改整机固件
- 高价值点：
- 官方明确把 `FAP`、`FAM`、`App Examples`、`Publishing` 作为主线
- 这页的真正价值是给你一个正确的开发分流图
- 建议放入知识库的位置：`App 开发 / 总入口`

### 5.3 Flipper App Manifests

- 页面：`FAM`
- URL：`https://developer.flipper.net/flipperzero/doxygen/app_manifests.html`
- 页面定位：`application.fam` 声明系统
- 为什么重要：不会写 manifest，就不算真正理解 Flipper App 架构
- 高价值点：
- 关键字段包括 `appid`、`apptype`、`entry_point`、`requires`、`conflicts`、`stack_size`、`targets`、`resources`
- 外部 App 还会涉及 `sources`、`fap_version`、`fap_icon`、`fap_category`、`fap_description`、`fap_author`、`fap_weburl`
- 高级字段还包括 `fap_private_libs`、`fap_extbuild`
- 建议放入知识库的位置：`App 架构 / Manifest / 声明层`

### 5.4 Flipper App Package

- 页面：`FAP`
- URL：`https://developer.flipper.net/flipperzero/doxygen/apps_on_sd_card.html`
- 页面定位：`.fap` 外部应用包
- 为什么重要：这是 App 真正分发到设备上的交付层
- 高价值点：
- `.fap` 本质上是带额外元数据和资源的 `.elf`
- 可放到 SD 卡动态加载
- 兼容性关键点是 API 版本，而不是简单固件版本号
- 外部 App 通常放在 `applications_user`
- 建议放入知识库的位置：`FAP / 交付 / 外部应用`

### 5.5 App Examples

- 页面：`App Examples`
- URL：`https://developer.flipper.net/flipperzero/doxygen/app_examples.html`
- 页面定位：官方示例总索引
- 为什么重要：这是最小可运行范式库
- 高价值点：
- 示例主题包括数字输入、图标使用、assets 目录、data 目录、1-Wire 温度计
- 应该把这页当作“模式库”，不是只当教程
- 如果你要做知识库，这页适合拆成多个微型节点
- 建议放入知识库的位置：`示例 / GUI / 资源 / 数据 / 硬件接口`

### 5.6 重点示例页

- `Number Input`
- URL：`https://developer.flipper.net/flipperzero/doxygen/example_number_input.html`
- 价值：看基础 GUI 输入、限制逻辑、用户交互

- `Application icons / Apps data`
- URL：`https://developer.flipper.net/flipperzero/doxygen/example_apps_data.html`
- 价值：理解图标与应用数据目录的基本组织

- `Apps Assets folder Example`
- URL：`https://developer.flipper.net/flipperzero/doxygen/example_assets.html`
- 价值：理解资源打包与读取

- `1-Wire Thermometer`
- URL：`https://developer.flipper.net/flipperzero/doxygen/example_onewire.html`
- 价值：理解硬件接口与应用结合

### 5.7 官方示例模式卡（第一批）

#### 5.7.1 Number Input

- 适合学什么：
- 最基础的交互式输入界面
- 输入边界、用户确认、输入结果回传这类 GUI 基本模式
- 在知识库里的最佳角色：`最小输入控件范式`

#### 5.7.2 Application icons / Apps data

- 适合学什么：
- 图标资源与应用数据不是一回事
- 资源更偏编译时打包，数据更偏运行时目录和持久化
- 在知识库里的最佳角色：`资源 vs 数据` 的最小区分样例

#### 5.7.3 Apps Assets folder Example

- 适合学什么：
- 应用自带资源如何组织
- 资源目录如何成为 App 结构的一部分
- 在知识库里的最佳角色：`assets 打包与引用模板`

#### 5.7.4 1-Wire Thermometer

- 适合学什么：
- 一个 App 如何真正接入硬件总线
- 外设交互、读取逻辑、应用层展示如何串起来
- 在知识库里的最佳角色：`App + 外设接口` 的最小官方模式

#### 5.7.5 这一组示例的共同价值

- 它们不是随意示例，而是官方给出的最小模式库
- 如果以后做 AI 知识库，应该把这些示例拆成独立卡片，而不是只保留一个总链接
- 正确读法不是死记代码，而是提炼“这个示例教的是什么模式”

### 5.8 Publishing to the Apps Catalog

- 页面：`Publishing to the Apps Catalog`
- URL：`https://developer.flipper.net/flipperzero/doxygen/app_publishing.html`
- 页面定位：从应用开发走向应用发布
- 为什么重要：生态分发不是额外话题，而是正式工作流的一部分
- 高价值点：
- 官方分发链路指向 Apps Catalog、移动端和 `Flipper Lab`
- 真正的提交与目录结构落在官方 catalog 仓库
- 建议放入知识库的位置：`App 发布 / Catalog / 分发`

### 5.9 Developer Tools

- 页面：`Developer Tools`
- URL：`https://developer.flipper.net/flipperzero/doxygen/dev_tools.html`
- 页面定位：官方工具链总览
- 为什么重要：如果只看 `FBT` 页面，容易丢掉整个调试和 OTA 视角
- 高价值点：
- 这一章会把 `FBT`、VS Code、Wi-Fi Dev Board、OTA 串起来
- 它很适合作为“开发工具总图”
- 建议放入知识库的位置：`工具链 / 调试 / IDE / OTA`

### 5.10 Flipper Build Tool

- 页面：`FBT`
- URL：`https://developer.flipper.net/flipperzero/doxygen/fbt.html`
- 页面定位：官方原生构建系统
- 为什么重要：做整机构建、做内建 App、做完整调试链都绕不过它
- 高价值点：
- 入口是仓库根目录下的 `./fbt`
- 本质是对 `scons` 的封装
- 关键环境变量包括 `FBT_NOENV`、`FBT_NO_SYNC`、`FBT_TOOLCHAIN_PATH`、`FBT_VERBOSE`
- `build/latest` 和 `compile_commands.json` 对 IDE 工作流很重要
- 建议放入知识库的位置：`构建系统 / FBT / IDE 支撑`

### 5.11 Visual Studio Code workspace

- 页面：`Visual Studio Code workspace for Flipper Zero`
- URL：`https://developer.flipper.net/flipperzero/doxygen/vscode.html`
- 页面定位：官方 IDE 工作流
- 为什么重要：把命令行构建转成可重复的 IDE 工作区
- 高价值点：
- 使用 `./fbt vscode_dist` 生成工作区
- 对调试、附加、重新构建的顺序有实际要求
- 建议放入知识库的位置：`IDE / VS Code / 调试工作流`

### 5.12 Wi-Fi Developer Board

- 页面：`Wi-Fi Developer Board`
- URL：`https://developer.flipper.net/flipperzero/doxygen/dev_board.html`
- 页面定位：官方 Wi-Fi Dev Board 与调试入口
- 为什么重要：这是官方调试硬件路线的中枢页
- 高价值点：
- 板上核心是 `ESP32-S2`
- 集成 `Black Magic Debug` 和 `CMSIS-DAP`
- 会串到快速开始、固件升级、USB 连接、Wi-Fi 连接、调试、读日志
- 建议放入知识库的位置：`开发板 / 调试 / 日志`

### 5.13 Dev Board 关键子页

- `Get started with the Devboard`
- URL：`https://developer.flipper.net/flipperzero/doxygen/dev_board_get_started.html`
- 价值：官方推荐上手顺序，减少接线和模式配置错误

- `Firmware update on Developer Board`
- URL：`https://developer.flipper.net/flipperzero/doxygen/dev_board_fw_update.html`
- 价值：旧固件是高频坑，这页很实战

- `USB connection to the Devboard`
- URL：`https://developer.flipper.net/flipperzero/doxygen/dev_board_usb_uart.html`
- 价值：最稳的接入方式

- `Wi-Fi connection to the Devboard`
- URL：`https://developer.flipper.net/flipperzero/doxygen/dev_board_wifi.html`
- 价值：无线调试与部署

- `Debugging via the Devboard`
- URL：`https://developer.flipper.net/flipperzero/doxygen/dev_board_debugging_guide.html`
- 价值：真正进入断点、单步、寄存器级调试

- `Devboard debug modes`
- URL：`https://developer.flipper.net/flipperzero/doxygen/dev_board_debug_modes.html`
- 价值：不同调试模式会决定接入方法

- `Reading logs via the Devboard`
- URL：`https://developer.flipper.net/flipperzero/doxygen/dev_board_reading_logs.html`
- 价值：很多故障比普通 CLI 更适合这样看日志

### 5.14 OTA update process

- 页面：`Flipper Zero OTA update process`
- URL：`https://developer.flipper.net/flipperzero/doxygen/ota_updates.html`
- 页面定位：官方 OTA 机制
- 为什么重要：这是理解更新包、资源包和恢复过程的架构页
- 高价值点：
- 包括 updater 在 RAM 中运行、备份 `/int`、刷写、恢复内部存储等概念
- 适合知识库中的“更新机制 / 包格式 / 恢复流程”
- 建议放入知识库的位置：`OTA / 更新机制 / 系统恢复`

### 5.15 JavaScript

- 页面：`JavaScript`
- URL：`https://developer.flipper.net/flipperzero/doxygen/js.html`
- 页面定位：Flipper JS 路线总入口
- 为什么重要：这是低门槛开发路线
- 高价值点：
- 可直接运行脚本，不必先编整机固件
- 文档会串到引擎介绍、首个 JS App、JS SDK、模块系统、模块文档
- 它适合做“快速原型”和“脚本工具层”
- 建议放入知识库的位置：`JavaScript / 快速开发`

### 5.16 About the JavaScript engine

- 页面：`About the JavaScript engine`
- URL：`https://developer.flipper.net/flipperzero/doxygen/js_about_js_engine.html`
- 页面定位：JS 引擎设计与限制
- 为什么重要：它能帮你建立正确预期
- 高价值点：
- 引擎基于 `mJS`
- 资源占用小，适合嵌入式
- 可以访问 GUI、按钮、USB-HID、GPIO、UART 等
- 不应把它理解成完整现代 JS 运行时
- 建议放入知识库的位置：`JS 引擎 / 能力边界 / 运行时预期`

### 5.17 JavaScript SDK 与模块

- `Your first JavaScript app`
- URL：`https://developer.flipper.net/flipperzero/doxygen/js_your_first_js_app.html`
- 价值：跑通第一条官方 JS 闭环

- `Developing apps using JavaScript SDK`
- URL：`https://developer.flipper.net/flipperzero/doxygen/js_developing_apps_using_js_sdk.html`
- 价值：官方 NPM / TypeScript 路线，适合更规范的脚本工程

- `Using JavaScript modules`
- URL：`https://developer.flipper.net/flipperzero/doxygen/js_using_js_modules.html`
- 价值：理解 `require()`、模块化、内存节约

### 5.18 JavaScript 重点模块

重点模块页：

- `https://developer.flipper.net/flipperzero/doxygen/js_badusb.html`
- `https://developer.flipper.net/flipperzero/doxygen/js_event_loop.html`
- `https://developer.flipper.net/flipperzero/doxygen/js_flipper.html`
- `https://developer.flipper.net/flipperzero/doxygen/js_gpio.html`
- `https://developer.flipper.net/flipperzero/doxygen/js_gui.html`
- `https://developer.flipper.net/flipperzero/doxygen/js_notification.html`
- `https://developer.flipper.net/flipperzero/doxygen/js_serial.html`
- `https://developer.flipper.net/flipperzero/doxygen/js_storage.html`

这些页在知识库里的价值：

- `GPIO / Serial / Storage` 适合做外设、文件和数据流
- `GUI / Notification / Event Loop` 适合做交互型脚本
- `Flipper` 模块适合做设备状态感知

### 5.19 System Programming

- 页面：`System Programming`
- URL：`https://developer.flipper.net/flipperzero/doxygen/system.html`
- 页面定位：更底层的系统层开发入口
- 为什么重要：这是从 App 开发走向平台层的门槛页
- 高价值点：
- 会串到单元测试、运行时检查、FuriHalBus、HAL 调试、Firmware Target、Firmware Assets、Dolphin assets
- 这章对希望深入平台层的读者非常重要，但不适合作为新手的第一阅读入口
- 建议放入知识库的位置：`系统编程 / 平台层 / 低层抽象`

### 5.20 System Programming 重点页

- `Unit tests`
- URL：`https://developer.flipper.net/flipperzero/doxygen/unit_tests.html`
- 价值：理解设备上跑测试的官方方式

- `Run time checks and forced system crash`
- URL：`https://developer.flipper.net/flipperzero/doxygen/furi_check.html`
- 价值：理解 `furi_assert`、`furi_check`、`furi_crash` 的哲学和行为差异

- `Using FuriHalBus API`
- URL：`https://developer.flipper.net/flipperzero/doxygen/furi_hal_bus.html`
- 价值：做底层硬件操作时非常关键，误用会直接踩系统问题

- `Furi HAL Debugging`
- URL：`https://developer.flipper.net/flipperzero/doxygen/furi_hal_debug.html`
- 价值：靠近 HAL 层排障时必看

- `What a Firmware Target is`
- URL：`https://developer.flipper.net/flipperzero/doxygen/hardware_targets.html`
- 价值：理解 `target.json`、硬件差异适配、链接脚本和符号导出

- `Firmware Assets`
- URL：`https://developer.flipper.net/flipperzero/doxygen/firmware_assets.html`
- 价值：理解资源构建、命名规则、打包

- `Dolphin assets`
- URL：`https://developer.flipper.net/flipperzero/doxygen/dolphin_assets.html`
- 价值：系统界面与体验层资源

### 5.21 File Formats

- 页面：`File Formats`
- URL：`https://developer.flipper.net/flipperzero/doxygen/file_formats.html`
- 页面定位：官方文件格式总览
- 为什么重要：设备数据如何存储、交换、导入、导出，全部落在这里
- 高价值点：
- 这是知识库里必须单独成区的部分
- 做工具链、转换器、批处理、AI 识别都绕不过格式层
- 建议放入知识库的位置：`文件格式 / 数据交换 / 数据资产`

### 5.22 File Formats 重点页

- `BadUSB File Format`
- URL：`https://developer.flipper.net/flipperzero/doxygen/badusb_file_format.html`
- 价值：理解 BadUSB 文本脚本格式与平台扩展语法

- `iButton key file format`
- URL：`https://developer.flipper.net/flipperzero/doxygen/ibutton_file_format.html`
- 价值：理解 iButton 数据文件结构

- `Infrared Flipper File Formats`
- URL：`https://developer.flipper.net/flipperzero/doxygen/infrared_file_format.html`
- 价值：红外数据导入导出和库构建的基础

- `LF RFID key file format`
- URL：`https://developer.flipper.net/flipperzero/doxygen/lfrfid_file_format.html`
- 价值：低频 RFID 数据结构的基线

- `NFC Flipper File Formats`
- URL：`https://developer.flipper.net/flipperzero/doxygen/nfc_file_format.html`
- 价值：NFC 数据文件结构与版本组织

- `SubGhz Subsystem File Formats`
- URL：`https://developer.flipper.net/flipperzero/doxygen/subghz_file_format.html`
- 价值：`.sub` 文件、RAW 与协议文件、用户配置等关键格式

- `Heatshrink-compressed Tarball Format`
- URL：`https://developer.flipper.net/flipperzero/doxygen/heatshrink_tar_format.html`
- 价值：资源包、更新包和压缩分发的隐藏高级页

### 5.23 文件格式字段级第一批摘要

下面这部分不是全文镜像，而是把最常用、最容易被 AI 搞混的字段层骨架抽出来。

#### 5.22.1 `.sub` / SubGhz

- 页面：`SubGhz Subsystem File Formats`
- URL：`https://developer.flipper.net/flipperzero/doxygen/subghz_file_format.html`
- 关键结论：
- `.sub` 文件分成三段：`header`、`preset information`、`protocol/data`
- 常规头部字段：`Filetype`、`Version`、`Frequency`
- 预设字段：`Preset`
- 自定义预设还要加：`Custom_preset_module`、`Custom_preset_data`
- 如果是协议型 key 文件，常见还会有：`Protocol`、`Bit`、`Key`、`TE`
- 如果是 RAW 文件，必须有：`Protocol: RAW`、`RAW_Data`
- 如果是 `BinRAW`，常见字段是：`Protocol`、`Bit`、`TE`、`Bit_RAW`、`Data_RAW`
- 对知识库最重要的理解：
- `.sub` 不只是“波形”，它把频率、无线芯片预设、协议数据放在一起
- RAW 和协议型 key 文件是两种思维，不要混成一种
- `Frequency` 和 `Preset` 是很多转换工具最容易漏掉的上下文

#### 5.22.2 NFC 通用头和设备分型

- 页面：`NFC Flipper File Formats`
- URL：`https://developer.flipper.net/flipperzero/doxygen/nfc_file_format.html`
- 关键结论：
- NFC 文件通用头至少有：`Filetype`、`Version`、`Device type`、`UID`
- 当前官方示例版本常见为 `Version: 4`
- `Device type` 会决定后面跟什么设备专属字段
- 对知识库最重要的理解：
- NFC 文件不是一个单一格式，而是一组“共用头 + 设备专属段”的格式族
- 如果 AI 没先识别 `Device type`，后面的字段就会全部解释错

#### 5.22.3 NFC 常见设备专属字段

- `ISO14443-3A`
- 常见字段：`ATQA`、`SAK`
- 作用：保存最基础的 3A 识别信息

- `ISO14443-3B`
- 常见字段：`Application data`、`Protocol info`
- 作用：保存 3B 设备相关识别信息

- `ISO14443-4A`
- 常见字段：`ATQA`、`SAK`、`ATS`
- 作用：在 3A 基础上再保存 `ATS`

- `NTAG/Ultralight`
- 常见字段：`Data format version`、`NTAG/Ultralight type`、`Signature`、`Mifare version`、`Counter n`、`Tearing n`、`Pages total`、`Pages read`、`Page n`
- 作用：更像“整卡内部状态快照”

- `Mifare Classic`
- 常见字段：`Mifare Classic type`、`Data format version`、`Block n`
- 作用：按 block 存储已知数据，未知处可保留占位

- 对知识库最重要的理解：
- NFC 文件格式最核心的不是“一个统一模板”，而是“先判断设备族，再解释字段”
- `Page n` 和 `Block n` 是典型的设备内部数据映射，不是普通文本键值对

#### 5.22.4 `.ibtn` / iButton

- 页面：`iButton key file format`
- URL：`https://developer.flipper.net/flipperzero/doxygen/ibutton_file_format.html`
- 关键结论：
- 文件扩展名是 `.ibtn`
- 当前官方版本是 `Version: 2`
- 通用关键字段：`Protocol`
- 协议相关字段按类型变化：
- Dallas 类常见：`Rom Data`
- `DS1992`、`DS1996` 可有：`Sram Data`
- `DS1971` 可有：`Eeprom Data`
- `Cyfral`、`Metakom` 常见：`Data`
- 对知识库最重要的理解：
- iButton 文件不是死板固定表头，而是“协议字段后移”
- `Protocol` 决定后面跟 ROM、SRAM、EEPROM 还是普通 key data

#### 5.22.5 `.rfid` / LF RFID

- 页面：`LF RFID key file format`
- URL：`https://developer.flipper.net/flipperzero/doxygen/lfrfid_file_format.html`
- 关键结论：
- 文件扩展名是 `.rfid`
- 基本结构非常干净：`Filetype`、`Version`、`Key type`、`Data`
- `Key type` 决定协议族，如 `EM4100`、`H10301`、`Indala26`、`AWID`、`Gallagher`
- 对知识库最重要的理解：
- LF RFID 页虽然短，但非常适合做转换器和标准化输入模板
- 这类格式适合知识库做成“协议名 -> 原始 HEX 数据”模型

#### 5.22.6 BadUSB 文本脚本

- 页面：`BadUSB File Format`
- URL：`https://developer.flipper.net/flipperzero/doxygen/badusb_file_format.html`
- 关键结论：
- BadUSB 使用的是扩展 Duckyscript
- 文件本体是纯文本 `.txt`
- 不需要编译
- 常见命令组：
- 注释与延时：`REM`、`DELAY`、`DEFAULT_DELAY`
- 字符串：`STRING`、`STRINGLN`
- 组合键：`CTRL`、`SHIFT`、`ALT`、`GUI`
- 按键保持：`HOLD`、`RELEASE`
- 字符延时：`STRING_DELAY`、`DEFAULT_STRING_DELAY`
- 重复：`REPEAT`
- ALT Numpad：`ALTCHAR`、`ALTSTRING`、`ALTCODE`
- 系统请求：`SYSRQ`
- 多媒体键：`MEDIA`
- 等待用户继续：`WAIT_FOR_BUTTON_PRESS`
- 自定义 USB HID 标识：`ID VID:PID Manufacturer:Product`
- 鼠标命令：`LEFTCLICK`、`RIGHTCLICK`、`MOUSEMOVE`、`MOUSESCROLL`
- 对知识库最重要的理解：
- BadUSB 格式本质是“命令语言”，不是普通数据文件
- 用于知识库时，更适合作成“命令类别 -> 参数 -> 作用”的语法卡片
- 高风险场景下只解释格式和能力边界，不给未授权使用步骤

### 5.24 Files / Data Structures / Related Pages

- `Files`
- URL：`https://developer.flipper.net/flipperzero/doxygen/files.html`
- 价值：高级开发者做 API 考古和源码跳转时非常有用

- `Data Structures`
- URL：`https://developer.flipper.net/flipperzero/doxygen/annotated.html`
- 价值：按结构体和类型名检索内部 API

- `Related Pages`
- URL：`https://developer.flipper.net/flipperzero/doxygen/pages.html`
- 价值：很多零散但关键的高级页都能从这里快速发现

## 6. 高级用户最容易漏掉的官方页面

下面这些页面不是“热门页面”，但对长期做知识库特别值钱：

- `https://docs.flipper.net/zero/development/cli`
- `https://docs.flipper.net/zero/development/hardware/flipper-blueprints`
- `https://docs.flipper.net/zero/development/hardware/devboard-schematics`
- `https://developer.flipper.net/flipperzero/doxygen/dev_tools.html`
- `https://developer.flipper.net/flipperzero/doxygen/ota_updates.html`
- `https://developer.flipper.net/flipperzero/doxygen/furi_check.html`
- `https://developer.flipper.net/flipperzero/doxygen/hardware_targets.html`
- `https://developer.flipper.net/flipperzero/doxygen/files.html`
- `https://developer.flipper.net/flipperzero/doxygen/pages.html`

这些页的共同特点：

- 不一定是新手第一眼会点的页
- 但它们决定你后面能不能把知识库做深、做稳、做成体系

## 7. 官方仓库在知识库里的角色

### 7.1 flipperzero-firmware

- URL：`https://github.com/flipperdevices/flipperzero-firmware`
- 角色：整机固件与官方实现基线
- 适合放在：`源码基线 / 内部实现 / API 真相`

### 7.2 flipperzero-ufbt

- URL：`https://github.com/flipperdevices/flipperzero-ufbt`
- 角色：单 App 开发的官方简化路线
- 适合放在：`轻量开发 / 外部应用 / 快速上手`

### 7.3 flipper-application-catalog

- URL：`https://github.com/flipperdevices/flipper-application-catalog`
- 角色：Apps Catalog 的元数据与构建信息仓库
- 适合放在：`发布 / 分发 / manifest / catalog`

### 7.4 flipperzero-good-faps

- URL：`https://github.com/flipperdevices/flipperzero-good-faps`
- 角色：官方与官方友好生态维护的真实 App 参考
- 适合放在：`真实项目样本 / 官方风格参考`

### 7.5 qFlipper

- URL：`https://github.com/flipperdevices/qFlipper`
- 角色：官方桌面管理工具实现
- 适合放在：`桌面生态 / 设备管理 / 同步与更新`

## 8. 给人类和 AI 的统一知识库切分建议

如果你要把官方资料压成长期知识库，最推荐的一级目录是：

1. `设备界面与菜单`
2. `桌面端与移动端生态`
3. `协议能力域`
4. `硬件规格与边界`
5. `GPIO、模块与外设`
6. `CLI、日志与调试`
7. `App 开发`
8. `构建与发布`
9. `JavaScript`
10. `系统编程`
11. `文件格式`
12. `官方仓库与真实实现`

## 9. 当前诚实状态

这份文档现在已经做到：

- 按官方页面分章节
- 按学习顺序整理
- 能同时服务人类阅读和 AI 摄取
- 把以前零散的“官方入口”提升成一份结构化总表

这份文档还没有做到：

- 没有把官网所有子页逐页全文摘要
- 只做了第一批高价值文件格式字段级摘要，还没把所有格式全部做完
- 没有把每个 API 页面做到逐项摘录

如果继续往下扩，最正确的顺序是：

1. 把 `File Formats` 每个格式做成字段级页
2. 把 `App Examples` 每个示例拆成独立知识卡
3. 把 `System Programming` 再深挖到 HAL 与 target 级
4. 再补 Doxygen `Files` 里的关键头文件与结构体索引
