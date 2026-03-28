# 10. 固件源码深度分析

[返回中文教学导航](README.md) | [上一章：09. 固件参考](09-Firmware-Reference-2025.md) | [返回中文入口](../README.md)

## 本章作用

本章与 [09. 固件参考](09-Firmware-Reference-2025.md) 的区别：
- **09章**：面向用户，介绍各固件的功能特点和选择建议
- **本章**：面向开发者，深入源码层面分析 4 套主流社区固件的架构差异、实现机制和学习路线

如果你需要**移植代码**、**理解底层机制**或**维护自定义固件**，本章是必读内容。

---

## 本地语料位置

本章内容基于本地已落盘的固件源码分析：

| 固件 | 本地目录 | 分支 | 状态 |
|------|----------|------|------|
| **Momentum** | `vendor_firmware/momentum` | `dev` | 活跃，推荐主基线 |
| **Unleashed** | `vendor_firmware/unleashed` | `dev` | 活跃，协议增强型 |
| **Xtreme** | `vendor_firmware/xtreme` | `dev` | 已归档，历史参考 |
| **RogueMaster** | `vendor_firmware/roguemaster` | `420` | 活跃，超大聚合仓 |

---

## 一句话结论

| 固件 | 核心定位 | 最适合学习 |
|------|----------|-----------|
| **Momentum** | 把"社区固件"做成成熟发行版 | 系统化改造、主题资产、启动迁移 |
| **Unleashed** | 协议能力增强优先 | 如何在稳定基线上增强协议栈 |
| **Xtreme** | 祖先型深改固件 | 大规模 UX 改造的历史演化 |
| **RogueMaster** | 超大外部 App 聚合 | 大仓运维的反面教材 |

**学习优先级**：Momentum → Unleashed → Xtreme → RogueMaster

---

## 四套固件的本质区别

### 1. Momentum：体系化发行版

**身份**
- 本地目录：`vendor_firmware/momentum`
- 分支：`dev`
- 提交：`430a3d506ea8c800e66d8b2f3d243631aebbe35c`

**核心定位**

Momentum 不是"多加几个功能"的固件，而是一套把 `主题资产 + 启动迁移 + 菜单重排 + 设置中心 + 兼容旧系配置` 系统化做出来的深改固件。

它是这 4 套里最适合拿来学"如何长期维护自定义 Flipper 发行版"的一套。

**仓库骨架与构建链路**

它依然是标准 Flipper 固件骨架：
- `SConstruct`
- `firmware.scons`
- `fbt`
- `fbt_options.py`
- `applications/`
- `lib/`
- `furi/`
- `targets/`

重点不是构建链路变了，而是它在官方骨架里塞进了一层自己的中间层：
- `lib/momentum`
- `applications/main/momentum_app`

这说明 Momentum 的设计理念不是到处散改，而是努力把"自定义发行版能力"收进独立命名空间。

**相对官方固件最明显的改动**

#### 启动阶段就做迁移与自定义初始化

最关键的文件是 `furi/flipper.c`，做了几件非常"发行版化"的事：
- 迁移旧路径和旧配置
- 兼容早期 `xtreme` 配置文件名
- 迁移 U2F、favorites、desktop、notification、power 等配置
- 启动时加载 `momentum_settings`
- 启动时初始化 `asset_packs`

这代表 Momentum 把"用户升级时不炸配置"作为正式设计目标，而不是临时脚本。

#### 独立的 Momentum 设置系统

关键目录：
- `lib/momentum`
- `applications/main/momentum_app`

`lib/momentum/settings.c` 里能看到它把大量行为都参数化了：
- 动画速度
- 菜单风格
- 锁屏选项
- 状态栏图标
- 文件浏览器显示策略
- 暗色模式
- RGB 背光
- 外置 SPI / UART 通道
- 颜色伪装

这说明 Momentum 的核心不是"硬编码功能"，而是"把改造项做成统一配置表"。

#### 资产包系统是它最有辨识度的实现

关键文件：
- `lib/momentum/asset_packs.c`
- `lib/momentum/asset_packs.h`
- `scripts/asset_packer.py`
- `documentation/file_formats/AssetPacks.md`

它把动画、图标、字体都做成外部包体系，并且提供打包脚本。这个思路比单纯替换图片高级很多，因为它把"美术资产更换"抽象成可分发格式。

#### GUI / Canvas / Loader 都被接管了关键行为

高价值文件：
- `applications/services/gui/canvas.c`
- `applications/services/gui/gui.c`
- `applications/services/gui/modules/menu.c`
- `applications/services/loader/loader.c`

这里能看到几个非常关键的设计：
- 字体与图标不是固定资源，而是可被 `asset_packs` 替换
- 菜单样式不止一种
- 暗色模式直接深入到 canvas / gui 层
- loader 会在运行某些 App 前卸载资产包，退出后再恢复

也就是说，Momentum 的改造不是"一个设置 App + 一点主题皮肤"，而是已经打到 UI 基础设施层。

**最值得注意的实现**

#### `momentum_app`

它不是一个简单设置页，而是这套发行版的前台控制中心。承担：
- 设置项编辑
- 资产包枚举
- 配置保存
- 资源重载触发

#### `namespoof`

关键文件：
- `lib/momentum/namespoof.c`
- `lib/momentum/namespoof.h`

这说明"设备身份呈现"也被纳入了统一自定义层，而不是散落到别的服务里。

#### 启动迁移逻辑

最有工程味的部分就是迁移：
- 兼容旧配置名
- 清理废弃路径
- 把 Xtreme 旧配置迁移进 Momentum 新配置

这直接体现出：Momentum 在设计上就是 Xtreme 之后更成熟的一代。

**维护风险 / 兼容性风险 / 技术债**

**风险 1：UI 深改面太大**

它改到了 canvas、gui、menu、loader。任何一个官方 GUI 层升级，都可能让这套自定义钩子出兼容问题。

**风险 2：资产热替换涉及手动内存管理**

图标、字体、动画替换里有大量 malloc/free/原始指针替换。这类代码一旦某条异常路径没清干净，就容易出内存泄漏、双重释放、恢复原始资源失败。

**风险 3：迁移逻辑会持续增长**

迁移逻辑越强，历史包袱越重。以后每次格式调整都要继续维护"旧名字 -> 新名字"的兼容链。

**风险 4：loader 与 asset pack 的联动复杂**

运行 App 时卸载资源、退出后恢复资源，这种生命周期管理最怕：
- App 异常退出
- 恢复路径没走到
- 多个状态叠加

**这套源码最适合学什么**

1. 如何把一堆自定义功能统一进一个配置系统
2. 如何把主题资产做成打包格式而不是散文件
3. 如何从激进固件演化到"可升级、可迁移、可长期维护"的固件

**最值得继续深挖的 10 个文件 / 目录**

1. `furi/flipper.c`
2. `lib/momentum/settings.c`
3. `lib/momentum/asset_packs.c`
4. `lib/momentum/namespoof.c`
5. `applications/main/momentum_app/`
6. `applications/services/gui/modules/menu.c`
7. `applications/services/gui/canvas.c`
8. `applications/services/loader/loader.c`
9. `scripts/asset_packer.py`
10. `documentation/file_formats/AssetPacks.md`

---

### 2. Unleashed：协议能力增强

**身份**
- 本地目录：`vendor_firmware/unleashed`
- 分支：`dev`
- 提交：`a5f6285e917240101bc86444ebf36a6b9f2b7e66`

**核心定位**

Unleashed 是这 4 套里最像"官方固件增强版"的一套：它的核心竞争力不是花哨主题，而是协议、Sub-GHz、外部模块和稳定兼容。

如果你要学"尽量贴近官方但把协议层做强"，Unleashed 是第一参考。

**仓库骨架与构建链路**

它仍然是标准的 Flipper 固件构建体系：
- `SConstruct`
- `firmware.scons`
- `fbt_options.py`
- `applications/`
- `lib/`
- `targets/`

`fbt_options.py` 里直接把固件身份写成了：
- `FIRMWARE_ORIGIN = "Unleashed"`

并且默认：
- `TARGET_HW = 7`
- `DEBUG = 1`

说明它保留了比较友好的调试取向，而不是只追求极限压缩。

**相对官方固件最明显的模块扩展**

#### Sub-GHz 是真正的核心战场

从 README 到文档，再到源码结构，最明显的主题都是：
- 更多协议
- 更多频率
- 额外的频率 hopper 配置
- 外置 CC1101 支持
- 主 App UI 增强

高价值入口：
- `documentation/SubGHzSettings.md`
- `documentation/SubGHzRemotePlugin.md`
- `applications/main/subghz`
- `applications/debug/subghz_test`
- `applications/drivers/subghz/cc1101_ext`
- `lib/subghz`

#### 名称修改被做成启动服务

关键文件：
- `applications/services/namechanger/application.fam`
- `applications/services/namechanger/namechanger.c`

这不是普通外部 App，而是 `STARTUP` 类型服务。它在开机后等待：
- CLI
- BT
- Storage

都准备好，再去改设备名称并刷新蓝牙侧表现。

这说明 Unleashed 更偏向"系统增强"，不是单独做一个菜单功能。

#### 文档驱动非常强

这套仓库有非常多面向使用与维护的文档：
- 安装
- FAQ
- Sub-GHz 设置
- Sub-GHz Remote
- Unit Tests
- 额外模块

这说明 Unleashed 的思路不是只追求源码炫技，而是希望把协议增强做成"用户可理解、维护者可跟进"的体系。

**菜单 / UI / 协议 / 插件层面的改动模式**

#### 菜单与 UI

Unleashed 也有很多体验增强，但不是以大规模换皮为核心。

它更像：
- 在官方 UI 上补好用功能
- 在输入、桌面、锁定、状态显示上做务实增强

从 README 能看到：
- 可改 Flipper 名称
- 文本输入支持光标
- 桌面时钟
- 电池百分比显示
- 更多游戏入口
- 坏 USB / BadKB 相关集成

#### 协议

这里才是 Unleashed 的主场。

它把增强集中在：
- Sub-GHz 协议数量
- 频率范围
- 外置 CC1101
- 手动协议构造
- 调试模式
- Raw / 协议工具链

#### 插件与外设

它支持外部硬件和插件，但不是像 RogueMaster 那样往仓库里塞上百个第三方 App，而是围绕协议和常用增强做体系化扩展。

**维护风险 / 兼容性风险 / 技术债**

**风险 1：协议增强越多，回归测试成本越高**

只要增加：
- 协议
- 频率
- 外置模块
- 更多发送 / 读写场景

测试矩阵就会迅速爆炸。

**风险 2：启动服务式 NameChanger 代码本身就承认"写得不漂亮"**

`namechanger.c` 里开发者自己就留下了非常直白的注释，说明这段实现带有：
- 等待轮询
- 服务就绪探测
- VCP 关开
- BT 恢复

它能工作，但工程味上属于"补丁式系统服务"，不是最优雅的设计。

**风险 3：协议能力越强，越依赖底层 HAL 与目标硬件稳定**

外置 CC1101、扩展频率、额外模块支持，本质上都会把风险往：
- `targets/`
- `applications/drivers/`
- `lib/subghz/`

这些低层区域推。

**最值得注意的实现**

#### `namechanger`

它是非常典型的"系统级增强而非普通 App"：
- 启动即生效
- 直接触达 BT 与 CLI
- 会处理 SD 就绪时机

这块适合学习"Flipper 服务之间如何互相等记录、互相触发"。

#### `subghz_test`

关键目录：`applications/debug/subghz_test`

它体现了这套固件不是只追求"功能有了"，还在给协议层做测试与调试面板。

**这套源码最适合学什么**

1. 如何增强协议栈而尽量不把 UI 改成另一个系统
2. 如何做外部模块支持
3. 如何把协议增强配套文档一起做起来

**最值得继续深挖的 10 个文件 / 目录**

1. `fbt_options.py`
2. `README.md`
3. `applications/services/namechanger/namechanger.c`
4. `applications/services/namechanger/application.fam`
5. `applications/main/subghz`
6. `applications/debug/subghz_test`
7. `applications/drivers/subghz/cc1101_ext`
8. `lib/subghz`
9. `documentation/SubGHzSettings.md`
10. `documentation/SubGHzRemotePlugin.md`

---

### 3. Xtreme：祖先型深改固件

**身份**
- 本地目录：`vendor_firmware/xtreme`
- 分支：`dev`
- 提交：`54619d013a120897eeade491decf4d1e95217c06`
- 上游状态：已归档

**核心定位**

Xtreme 是一套"把 Flipper UI、设置、主题资产、快捷配置做得非常激进"的历史性固件。现在它虽然不适合作为长期主线，但仍然是学习 Flipper 深度 UX 改造的高价值样本。

**仓库骨架与构建链路**

它仍然遵守 Flipper 固件标准结构：
- `SConstruct`
- `firmware.scons`
- `fbt_options.py`
- `applications/`
- `lib/`
- `furi/`
- `targets/`

但是它的关键自定义不是散落式的，而是收束在：
- `lib/xtreme`
- `applications/main/xtreme_app`

这和后来的 Momentum 非常像，说明 Momentum 在工程组织上明显继承了 Xtreme。

**相对官方固件最明显的模块 / 功能扩展**

#### 启动阶段加载 Xtreme Settings 与 Xtreme Assets

关键文件：`furi/flipper.c`

这里最关键的一点是，它在启动过程中明确写出：
- `Loading Xtreme Settings`
- `Loading Xtreme Assets`

并且在启动页直接显示 `Xtreme is Booting`。

这说明 Xtreme 不是"外挂几个 App"，而是正式把自己做成独立发行版层。

#### `lib/xtreme` 是真正的核心

关键目录：`lib/xtreme`

这里面最重要的是两类实现：
- `settings.c`
- `assets.c`

`settings.c` 把一大堆行为做成配置：
- 菜单风格
- 锁屏
- 状态栏时钟
- 显示隐藏文件
- BadBT / BadKB 相关
- RGB 背光
- 充电上限
- UART / SPI 分配

`assets.c` 则把动画图标、静态图标、字体做成可以替换的运行时资产系统。

#### `Xtreme App` 是前台控制中心

关键文件：
- `applications/main/xtreme_app/application.fam`
- `applications/main/xtreme_app`

它承担了：
- 设置入口
- 自定义行为开关
- 资产包选择

这套结构后来在 Momentum 里被进一步正规化。

#### `BadKB` 很能代表 Xtreme 的思路

关键目录：`applications/main/bad_kb`

从场景文件能看到它提供了很多配置面：
- BT 名称
- BT MAC
- USB 名称
- USB VID/PID
- 键盘布局

这说明 Xtreme 的风格就是：把"社区里大家想要的高级选项"前移到可操作 UI。

**菜单 / UI / 协议 / 无线 / 插件层面的改动模式**

#### 菜单

- 可切换菜单风格
- 主菜单组织更自由
- 状态栏时钟、电池样式等都可调

#### UI

这是 Xtreme 最强的部分：
- 资产包
- 图标替换
- 字体替换
- 动画风格
- 锁屏外观
- 暗色模式

#### 协议 / 无线

Xtreme 也吸收了 Unleashed 一些协议向增强，但相比 Unleashed，它的真正重心还是"功能前台化 + 体验强化"。

#### 插件思路

Xtreme 不是 RogueMaster 那种"塞满外部 App"，而是"在系统里预留高级功能入口，让用户直接配置"。

**维护风险 / 兼容性风险 / 技术债**

**风险 1：上游已经归档**

这意味着：
- 你可以学
- 你可以读
- 但不适合继续作为未来主线长期追进

**风险 2：资产系统里有大量手动指针替换**

`lib/xtreme/assets.c` 里明显存在：
- 分配 frames
- 复制原始 icon
- 替换原始指针
- 手动恢复

这种代码很强，但最怕边界条件：
- 文件不完整
- 中途加载失败
- 部分成功部分失败
- 释放顺序不一致

**风险 3：设置项非常多，耦合面很广**

设置覆盖了：
- UI
- 文件浏览
- 串口
- 外部模块
- 电源
- BadKB

这意味着官方任何一层接口变化，都可能牵动这套大配置系统。

**风险 4：深改越多，后续合并官方主线越痛苦**

Xtreme 读起来很爽，但站在维护者角度，最大问题是：
- 你几乎每个面都动了
- 以后每次跟官方同步都要重新消解冲突

这也是为什么后来更成熟的路线会往 Momentum 那种更体系化的封装方向走。

**最值得注意的实现**

#### `xtreme_settings`

是一个非常典型的"社区固件控制平面"。

#### `xtreme_assets`

是它最值得学的代码，因为这里能看到：
- 资源如何被动态替换
- 资源如何在运行时恢复
- Flipper UI 资产如何被扩展成主题系统

#### `bad_kb`

它最能代表 Xtreme 的设计哲学：把高级玩法做成普通用户能点出来的 UI。

**这套源码最适合学什么**

1. 如何做 Flipper 的深度 UI/资产系统
2. 如何把高级功能塞进一个统一配置入口
3. 为什么激进魔改最终会演化成更重视工程收束的后继方案

**最值得继续深挖的 10 个文件 / 目录**

1. `furi/flipper.c`
2. `lib/xtreme/settings.c`
3. `lib/xtreme/assets.c`
4. `lib/xtreme/xtreme.h`
5. `applications/main/xtreme_app`
6. `applications/main/bad_kb`
7. `applications/services/gui/modules/menu.c`
8. `targets/f7/furi_hal/furi_hal_light.c`
9. `assets/SConscript`
10. `ReadMe.md`

---

### 4. RogueMaster：超大聚合仓

**身份**
- 本地目录：`vendor_firmware/roguemaster`
- 分支：`420`
- 提交：`a2fcf04c1371bc534c121cc6f13dff59e492afb3`

**核心定位**

RogueMaster 不是"普通社区固件"，而是一套超大型聚合仓：它把大量社区 App、插件、菜单体系、自定义资源都卷进一个仓里。它最值得学的不是某个单点功能，而是"超大型聚合固件会长成什么样，以及为什么维护会越来越难"。

**仓库骨架与构建链路**

它依然保留 Flipper 的标准构建体系：
- `SConstruct`
- `firmware.scons`
- `fbt`
- `applications/`
- `lib/`
- `targets/`

但和另外三套不同的是，它在 `applications` 这层已经发生了质变：
- `applications/external` 里本地统计有 `611` 个带 `application.fam` 的外部目录

这不再是"固件里附带一些工具"，而是"整套 App 生态都被往仓库里卷"。

**相对官方固件最明显的模块 / 功能扩展**

#### `CFW Settings` 是它的中控台

关键目录：
- `applications/settings/cfw_app`
- `lib/cfw`

这里你会看到它的核心思想：
- 不只是一个主菜单
- 还有一套游戏菜单
- 主菜单和游戏菜单都可重新排序
- 可以改显示、颜色、背光、串口、外设、菜单起点

相比 Momentum / Xtreme，RogueMaster 的设置中心更像"发行版控制台"。

#### 双菜单体系是非常鲜明的特征

关键头文件：`lib/cfw/cfw.h`

它直接定义了：
- `CFW_MENU_PATH`
- `CFW_MENU_GAMESMODE_PATH`

而且 `CfwSettings` 里同时存在：
- `menu_style`
- `game_menu_style`
- `start_point`
- `game_start_point`

这说明 RogueMaster 不是只想"给你更多 App"，而是想把"主功能"和"游戏/娱乐"彻底拆成两套入口逻辑。

#### 外部 App 聚合是它最大的结构特征

本地统计：
- `applications/external` 下有 `611` 个带 `application.fam` 的目录

这意味着：
- 仓库极度庞大
- 来源极其混杂
- 版本节奏不统一
- 每次同步官方主线都会非常重

#### 大量功能不是自己原创，而是整合与再分发

从 README 和 `application.fam` 注释里可以直接看到：
- 各种第三方项目链接
- merged / refactored / original by 的来源说明

也就是说，RogueMaster 的主要能力不是"自己发明所有模块"，而是"把社区成果尽可能并仓"。

**菜单 / UI / 协议 / 插件层面的改动模式**

#### 菜单

这是 RogueMaster 的一大主轴：
- 主菜单可配置
- 游戏菜单可配置
- 菜单项目可增删排序
- 起始点可定制

#### UI

它也有颜色、LCD 风格、RGB 背光等设置，但 UI 改造不是它最核心的竞争力。

#### 协议

它吸收很多协议型和工具型项目，但它最大的源码特征不是"某一个协议层特别深"，而是"协议类 App 很多，来源很多，版本很多"。

#### 插件

RogueMaster 最大的结构风险和价值都在这里：
- 它让你看到一个 Flipper 固件仓如何被做成"超大插件集市"

**最值得注意的实现**

#### `cfw.h` / `settings.c`

关键文件：
- `lib/cfw/cfw.h`
- `lib/cfw/settings.c`

你能看到 RogueMaster 真正的控制平面：
- 主菜单
- 游戏菜单
- 可见文件策略
- RGB 背光
- LCD 风格
- 颜色模式
- 外设串口
- 颜色伪装

#### `cfw_app`

关键目录：`applications/settings/cfw_app`

这块非常适合深读，因为它不是简单的"变量项列表"，而是直接把：
- 主菜单编辑
- 游戏菜单编辑
- 顺序调整
- 协议设置
- 屏幕设置

都做成了场景系统。

#### `applications/external`

这是整个仓最特殊的地方。

它更像一个"集成分发层"，不是单一项目源码。

**维护风险 / 兼容性风险 / 技术债**

**风险 1：来源过杂**

当一个仓库集成 600+ 外部 App 时，最大的敌人不是编译，而是：
- 你已经很难保证每个来源都还活着
- 你很难统一代码风格
- 你很难确认每个 App 的 API 漂移情况

**风险 2：版本节奏完全不统一**

官方主线、Unleashed、各种外部社区 App、各自修 bug 的节奏都不同。

整合仓的维护成本会持续上涨。

**风险 3：仓库越大，越不适合做"精准根因修复"**

你如果只想修你设备上几个常用功能，RogueMaster 并不是最理想的工作母仓，因为它太杂。

**风险 4：菜单体系和外部 App 体系互相耦合**

菜单越可配置，外部 App 越多，越容易出现：
- 菜单指针失效
- 目录漂移
- manifest 变化
- 图标与分类错位

**风险 5：这类仓库最容易出现"装得上，不一定长期稳"**

因为集成广度太大，稳定性会更依赖：
- 个别 App 的质量
- App 更新是否同步
- 菜单数据与 manifest 是否持续匹配

**这套源码最适合学什么**

1. 如何做一个超大型聚合发行版
2. 大规模 App intake 会带来哪些维护问题
3. 为什么"功能全"不等于"适合长期维护"

**最值得继续深挖的 10 个文件 / 目录**

1. `ReadMe.md`
2. `lib/cfw/cfw.h`
3. `lib/cfw/settings.c`
4. `applications/settings/cfw_app`
5. `applications/external`
6. `applications/external/subghz_remote`
7. `applications/external/namechanger`
8. `CHANGELOG.md`
9. `RoadMap.md`
10. `documentation`

---

## 核心实现模式与源码参考

### 一眼看懂：4 套固件最核心的写法差异

#### Momentum

核心套路是：
- 用 `lib/momentum/settings.c` 做 **表驱动配置读写**
- 用 `momentum_app_apply()` 做 **统一控制平面**
- 用 `furi/flipper.c` 做 **启动迁移 + 初始化注入**
- 用 `lib/momentum/asset_packs.c` 做 **运行时图标/字体替换**

它最像"发行版内核"。

#### Unleashed

核心套路是：
- 尽量不自己造太大中间层
- 直接改官方主链模块
- 用 `namechanger` 这种 **系统启动服务** 做补丁式增强
- 用 `find_my_flipper` 这种 **状态驱动 UI App** 做单点功能

它最像"增强版 OFW"。

#### Xtreme

核心套路是：
- `lib/xtreme/settings.c` 做 **表驱动配置系统**
- `xtreme_app_apply()` 做 **总控设置入口**
- `lib/xtreme/assets.c` 做 **直接替换全局图标/字体**

它最像"体验层总控台"。

#### RogueMaster

核心套路是：
- `lib/cfw/settings.c` 做 **大而平的配置落盘**
- `cfw_app_apply()` 做 **双菜单 + 批量配置写入**
- `loader.c` 做 **外部 App 分发和报错 UX**
- 真正的大头在 `applications/external`

它最像"巨型发行版聚合器"。

### 模式 1：配置系统是怎么写的

#### A. Momentum / Xtreme：表驱动配置序列化

它们最值钱的地方，不是字段多，而是把配置读写做成了 **统一元数据表**。

核心入口：
- Momentum：`lib/momentum/settings.c:126`
- Xtreme：`lib/xtreme/settings.c:119`

Momentum 的典型写法：

```c
static const struct {
    momentum_settings_type type;
    const char* key;
    void* val;
    union { ... };
} momentum_settings_entries[] = {
    {setting_str(asset_pack)},
    {setting_uint(anim_speed, 25, 300)},
    {setting_int(cycle_anims, -1, 86400)},
    {setting_bool(unlock_anims)},
    {setting_enum(menu_style, MenuStyleCount)},
    ...
};
```

这段代码的意义很大：
- 每个配置项都带 `key + 类型 + 地址 + 边界`
- `load()` 和 `save()` 不需要给每个字段单独写重复逻辑
- 配置项增加时，只要补元数据表，维护成本低很多

#### B. RogueMaster：大平铺配置读写

核心入口：
- `load`：`lib/cfw/settings.c:34`
- `save`：`lib/cfw/settings.c:100`

它不是表驱动，而是逐项手写：

```c
flipper_format_read_uint32(file, "menu_style", (uint32_t*)&x->menu_style, 1);
flipper_format_read_uint32(file, "game_menu_style", (uint32_t*)&x->game_menu_style, 1);
flipper_format_read_bool(file, "show_hidden_files", &x->show_hidden_files, 1);
flipper_format_read_uint32(file, "charge_cap", &x->charge_cap, 1);
```

这类写法的特点：
- 好懂
- 改一个字段很直接
- 但字段一多就会变得很长、很散
- 后期更容易出现"漏改 load/save 两边之一"的问题

**结论**：Momentum / Xtreme 更工程化，RogueMaster 更像"快速扩字段"。

### 模式 2：设置 App 不是设置页，而是"控制平面"

这 3 套固件最重要的代码之一，不是某个协议模块，而是它们的 `*_app_apply()`。

#### Momentum：一次 Apply 写很多系统文件

入口：`applications/main/momentum_app/momentum_app.c:16`

核心代码模式：

```c
if(app->save_mainmenu_apps) { ... 写 mainmenu_apps.txt ... }
if(app->save_desktop) { ... 写 desktop settings ... }
if(app->save_subghz_freqs) { ... 写 setting_user ... }
if(app->save_subghz) { ... 写 extend_range.txt ... }
if(app->save_name) { ... 写 name spoof file ... }
if(app->save_dolphin) { ... 改 dolphin state ... }
if(app->save_backlight) { rgb_backlight_save_settings(); }
if(app->save_settings) { momentum_settings_save(); }
```

这就是它的本质：
- `momentum_app` 不是普通 App
- 它是一个 **把 UI 选择翻译成多个系统配置文件/状态更新** 的总控台

#### Xtreme：几乎同一套控制平面设计

入口：`applications/main/xtreme_app/xtreme_app.c:14`

最关键的相似点：

```c
if(app->save_mainmenu_apps) { ... "MenuAppList Version 0" ... }
if(app->save_subghz_freqs) { ... }
if(app->save_subghz) { ... }
if(app->save_name) { ... }
if(app->save_backlight) { ... }
if(app->save_settings) { xtreme_settings_save(); }
```

这说明 Momentum 不是凭空新设计，而是明显继承了 Xtreme 的总控思路，再做了整理和升级。

#### RogueMaster：双菜单控制平面

入口：`applications/settings/cfw_app/cfw_app.c:14`

它最特别的地方是同时写两套菜单：

```c
if(app->save_mainmenu_apps) {
    stream_write_format(stream, "MainMenuList Version %u\n", 0);
}

if(app->save_gamemenu_apps) {
    stream_write_format(stream, "GamesMenuList Version %u\n", 0);
}
```

这解释了为什么 RogueMaster 的菜单系统会比别家更重：
- 它不是单菜单
- 它是主菜单 / 游戏菜单双体系
- 配置分叉更大，维护复杂度自然更高

### 模式 3：启动时就注入逻辑

#### Momentum：启动迁移是固件级功能

核心入口：
- `migrate`：`furi/flipper.c:58`
- `init`：`furi/flipper.c:169`

最关键的不是一句 `load settings`，而是它在开机时先做 **文件迁移**：

```c
const struct {
    const char* src;
    const char* dst;
} renames[] = {
    {EXT_PATH(".config/favorites.txt"), ARCHIVE_FAV_PATH},
    {EXT_PATH(".config/xtreme_menu.txt"), MAINMENU_APPS_PATH},
    {EXT_PATH(".config/xtreme_settings.txt"), MOMENTUM_SETTINGS_PATH},
    ...
};
```

这段很有代表性：
- Momentum 明确考虑从旧布局升级过来
- 它兼容 OFW / Unleashed / Xtreme 的旧路径
- 所以它更像"迁移友好的发行版"，不是纯净新仓

#### Unleashed：启动服务式补丁

核心入口：
- `init`：`applications/services/namechanger/namechanger.c:11`
- `system start`：`applications/services/namechanger/namechanger.c:73`

最关键的代码模式：

```c
while(!furi_record_exists(RECORD_CLI_VCP) ||
      !furi_record_exists(RECORD_BT) ||
      !furi_record_exists(RECORD_STORAGE)) {
    ...
}

if(namechanger_init()) {
    cli_vcp_disable(cli);
    cli_vcp_enable(cli);
    bt_profile_restore_default(bt);
}
```

这个实现说明：
- 它不是干净优雅的统一架构层
- 而是很典型的"系统启动后补一刀"
- 先等服务起来，再去碰 CLI 和 BT，逼设备把新名字刷新出去

这种写法很实用，但技术债味道也很重。

### 模式 4：资产包怎么做

#### Momentum：保留替换列表，不直接改原图标对象

入口：
- `animated`：`lib/momentum/asset_packs.c:34`
- `static`：`lib/momentum/asset_packs.c:98`
- `init`：`lib/momentum/asset_packs.c:179`

它的核心是构造一个替换表：

```c
IconSwapList_push_back(
    asset_packs->icons,
    (IconSwap){
        .original = original,
        .replaced = &swap->icon,
    });
```

这类写法的特点：
- 原始图标对象不直接被就地改烂
- 用一张 `original -> replaced` 映射表管理替换
- 回滚和释放逻辑更可控

#### Xtreme：直接修改全局图标对象

入口：
- `animated`：`lib/xtreme/assets.c:23`
- `init`：`lib/xtreme/assets.c:152`
- `free`：`lib/xtreme/assets.c:185`

它的写法更猛：

```c
Icon* original = malloc(sizeof(Icon));
memcpy(original, replace, sizeof(Icon));
FURI_CONST_ASSIGN_PTR(replace->original, original);
FURI_CONST_ASSIGN(replace->width, icon_width);
FURI_CONST_ASSIGN_PTR(replace->frames, frames);
```

这意味着：
- 它直接改 `replace` 指向的全局 icon
- 先备份原值到 `original`
- 退出时再 `memcpy` 回去

优点：
- 运行时替换非常直接

风险：
- 一旦释放或回滚顺序错了，就容易炸
- 这比 Momentum 的替换表方案边界更脆

### BLE 主链（四固件共享）

```
bt_service
→ furi_hal_bt_start_app(...)
→ serial_profile / serial_service
→ bt_service 把 BLE 串口字节喂给 rpc_session_feed(...)
```

**关键入口**：
| 固件 | 启动位置 | RPC 喂数点 |
|------|----------|-----------|
| Momentum | `furi_hal_bt.c:165` | `bt.c:200` |
| Unleashed | `furi_hal_bt.c:165` | `bt.c:202` |
| Xtreme | `furi_hal_bt.c:166` | `bt.c:189` |
| RogueMaster | `furi_hal_bt.c:165` | `bt.c:186` |

### BLE HAL 代际差异

**新签名**（Momentum / Unleashed）：
```c
FuriHalBleProfileBase* furi_hal_bt_start_app(
    const FuriHalBleProfileTemplate* profile_template,
    FuriHalBleProfileParams params,
    const GapRootSecurityKeys* root_keys,  // ← 新参数
    GapEventCallback event_cb,
    void* context)
```

**旧签名**（Xtreme / RogueMaster）：
```c
FuriHalBleProfileBase* furi_hal_bt_start_app(
    const FuriHalBleProfileTemplate* profile_template,
    FuriHalBleProfileParams params,
    GapEventCallback event_cb,
    void* context)
```

**结论**：Momentum/Unleashed 更接近较新的 BLE 安全上下文接口。

### Find My 集成差异

| 固件 | 挂载位置 | 启动注入 | 风险等级 |
|------|----------|----------|----------|
| Momentum | `applications/system/findmy` | 系统内建 | 低 |
| Unleashed | `applications/system/find_my_flipper` | 系统内建 | 低 |
| Xtreme | `applications/system/find_my_flipper` | 系统内建 | 低 |
| RogueMaster | `applications/external/find_my_flipper` | 外部化 | 高 |

**关键差异**：RogueMaster 把 Find My 放到 external，影响开机注入稳定性。

### Sub-GHz 差异

| 维度 | Momentum | Unleashed | Xtreme | RogueMaster |
|------|----------|-----------|--------|-------------|
| `setting_user` 路径 | `setting_user` | `setting_user` | `setting_user` | `setting_user.txt`（分叉） |
| `extend_range` 控制面 | `momentum_app` 集成 | 未见统一控制面 | `xtreme_app` 集成 | `cfw_app` + external |
| async TX 骨架 | 同源 | 同源 | 同源 | 同源 |

**关键结论**：
- 真正"吐脉冲"的 HAL/DMA/TIM 机制 **没有分叉**
- 差异主要在 **谁来触发、谁来写配置、谁来暴露 UI**

---

## 最值得抄的无线核心源码片段索引

### 原则

"最值得抄"不是指整文件复制，而是指：
- 调用链最清晰
- 抽象边界最干净
- 能解释 80% 问题的关键入口

所以这里优先选：
- `Momentum` 主读
- `Unleashed` 做稳定对照
- `Xtreme` 看 API 代际
- `RogueMaster` 看大生态和漂移风险

### BLE：自定义 Profile / Companion / 测试模式

#### 最值得抄：BLE App 启动骨架

**用途**
- 学怎么从系统服务拉起 BLE profile
- 学 `GAP/GATT/profile` 的启动顺序

**主参考**
- Momentum：`targets/f7/furi_hal/furi_hal_bt.c:165`
- Unleashed：`targets/f7/furi_hal/furi_hal_bt.c:165`

**对照组**
- Xtreme：`targets/f7/furi_hal/furi_hal_bt.c:166`
- RogueMaster：`targets/f7/furi_hal/furi_hal_bt.c:165`

**为什么值钱**
- 这是 BLE 业务层进入 radio stack 的总闸门
- 你以后看"为什么 profile 起不来""为什么 GAP init 失败"，都要回到这里
- 还能直接看出 API 世代差异

#### 最值得抄：Companion 蓝牙串口桥

**用途**
- 学 Flipper Companion 的 BLE 串口桥到底怎么喂 RPC
- 学会话为什么会断、为什么 decode error 会出现

**主参考**
- Momentum：`applications/services/bt/bt_service/bt.c:200`
- Momentum：`applications/services/rpc/rpc.c:167`

**对照组**
- Unleashed：`applications/services/bt/bt_service/bt.c:202`
- Xtreme：`applications/services/bt/bt_service/bt.c:189`
- RogueMaster：`applications/services/bt/bt_service/bt.c:186`

**为什么值钱**
- Companion 本质不是"神秘蓝牙协议"
- 它本质上就是 `serial_profile + serial_service + rpc_session_feed()`
- 你只要吃透这段，Companion 这一整块就不神秘了

#### 最值得抄：BLE 测试发射入口

**用途**
- 学测试模式怎么从 CLI 下沉到 HCI test mode
- 学真正发射测试 tone / packet 的 HAL 入口

**主参考**
- Momentum：`applications/services/bt/bt_cli.c:44`
- Momentum：`targets/f7/furi_hal/furi_hal_bt.c:340`
- Momentum：`targets/f7/furi_hal/furi_hal_bt.c:350`

**为什么值钱**
- 这条链最适合学"CLI 只是入口，HAL 才是真发射"
- 以后要看自测、校准、carrier test，都先回这里

### extra_beacon / Find My / 名字广播

#### 最值得抄：`extra_beacon` HAL 底座

**用途**
- 学如何在正常 BLE profile 旁边挂额外广告
- 学系统级 beacon 是怎么被初始化和启动的

**主参考**
- Momentum：`targets/f7/furi_hal/furi_hal_bt.c:131`
- Momentum：`targets/f7/ble_glue/extra_beacon.c:25`
- Momentum：`targets/f7/furi_hal/furi_hal_bt.c:416`
- Momentum：`targets/f7/furi_hal/furi_hal_bt.c:432`

**为什么值钱**
- 这是所有 "额外挂广告 / beacon" 功能的系统底座
- 不管上层名字叫什么，最后都得回到这组 API

#### 最值得抄：Find My 启动注入

**用途**
- 学 SD 卡挂载后如何自动把 beacon 状态恢复到运行态
- 学"用户配置文件 -> 启动时自动应用"这类模式

**主参考**
- Momentum：`applications/system/findmy/findmy_startup.c:9`
- Momentum：`applications/system/findmy/findmy_state.c:115`

**对照组**
- Unleashed：`applications/system/find_my_flipper/findmy_startup.c:9`
- Xtreme：`applications/system/find_my_flipper/findmy_startup.c:5`
- RogueMaster：`applications/external/find_my_flipper/findmy_startup.c:5`

**为什么值钱**
- 这里不是在讲某个 Find My 业务，而是在讲一个更通用的模式：
  - `storage mount`
  - `load state`
  - `apply state`
  - `run_parallel`
- 这套模式以后做任何"开机恢复无线状态"的功能都很好用

### Sub-GHz：频率策略、门控、异步发射

#### 最值得抄：频率配置从文件进系统的入口

**用途**
- 学 `setting_user` 是怎么被加载的
- 学自定义频点为什么会出现在 UI 列表里

**主参考**
- Momentum：`applications/main/subghz/helpers/subghz_txrx.c:29`
- Momentum：`lib/subghz/subghz_setting.c:201`

**为什么值钱**
- 频率问题第一现场不在 UI，而在这里
- 看懂这一层，才知道"哪些频点是默认表、哪些是用户表"

#### 最值得抄：`extend_range` 控制面

**用途**
- 学设置 App 怎么把 UI 选择落成实际无线配置文件
- 学"控制平面"和"无线底座"怎么解耦

**主参考**
- Momentum：`applications/main/momentum_app/momentum_app.c:69`
- Xtreme：`applications/main/xtreme_app/xtreme_app.c:67`
- RogueMaster：`applications/settings/cfw_app/cfw_app.c:81`

**为什么值钱**
- 这几段代码非常适合学"设置 App 并不直接发射，它只是写控制文件"
- 如果你后面自己做大一点的设置面板，这就是最像样的模板

#### 最值得抄：发送总入口 `subghz_txrx_tx_start()`

**用途**
- 学一个 `.sub` / key file 是怎样进入发射链的
- 学 UI 层什么时候切到 radio device

**主参考**
- Momentum：`applications/main/subghz/helpers/subghz_txrx.c:304`

**对照组**
- Unleashed：`applications/main/subghz/helpers/subghz_txrx.c:289`
- Xtreme：`applications/main/subghz/helpers/subghz_txrx.c:245`
- RogueMaster：`applications/main/subghz/helpers/subghz_txrx.c:243`

**为什么值钱**
- 这是 UI 层和底层 TX 真正接上的地方
- 很多"为什么点发送没反应"的问题，都要沿着这条链排查

#### 最值得抄：分发器 `subghz_devices_start_async_tx()`

**用途**
- 学同一个上层发射入口如何同时支持内置和外置无线芯片
- 学 interconnect 抽象是怎么搭起来的

**主参考**
- Momentum：`lib/subghz/devices/devices.c:145`

**为什么值钱**
- 它本身不发脉冲
- 但它是"内置 CC1101 / 外置 CC1101"切换的总开关

#### 最值得抄：内置 CC1101 async TX

**用途**
- 学真正的 DMA/TIM 发射链
- 学为什么 `yield()` 只产出 `LevelDuration`，不直接打 GPIO

**主参考**
- Momentum：`lib/subghz/devices/cc1101_int/cc1101_int_interconnect.c:20`
- Momentum：`targets/f7/furi_hal/furi_hal_subghz.c:767`
- Momentum：`targets/f7/furi_hal/furi_hal_subghz.c:704`

**为什么值钱**
- 这是 Sub-GHz 最底层、最"硬核"的那一段
- 你只要读懂这里，就能解释：
  - 谁在驱动脉冲
  - 为什么 DMA HT/TC 中断只负责 refill
  - 为什么 `RESET` 才代表结束，`WAIT` 不是

#### 最值得抄：`subghz_transmitter_yield()` 和 `LevelDuration`

**用途**
- 学协议 encoder 怎样把业务数据变成脉冲序列
- 学上层和底层之间的最关键中间表示

**主参考**
- Momentum：`lib/subghz/transmitter.c:61`
- Momentum：`lib/toolbox/level_duration.h:15`

**为什么值钱**
- 它是所有协议和 DMA/TIM 发射层之间的"契约"
- 不懂这里，就看不懂异步 TX 为什么能复用那么多协议

### Momentum（优先级最高）

| 文件 | 学习价值 |
|------|----------|
| `furi/flipper.c` | 启动迁移逻辑，兼容旧配置 |
| `lib/momentum/settings.c` | 统一配置系统实现 |
| `lib/momentum/asset_packs.c` | 资产包热替换机制 |
| `lib/momentum/namespoof.c` | 设备身份伪装 |
| `applications/main/momentum_app/` | 发行版控制中心 |
| `applications/services/gui/canvas.c` | UI 基础设施改造 |
| `applications/services/loader/loader.c` | App 生命周期管理 |

### Unleashed（协议参考）

| 文件 | 学习价值 |
|------|----------|
| `applications/services/namechanger/` | 系统级服务实现 |
| `lib/subghz/devices/devices.c` | 内外置分发器 |
| `applications/main/subghz/helpers/subghz_txrx.c` | Sub-GHz 发射主链 |

### 无线核心（四固件同源）

| 文件 | 学习价值 |
|------|----------|
| `targets/f7/ble_glue/extra_beacon.c` | BLE 额外广播机制 |
| `targets/f7/furi_hal/furi_hal_subghz.c` | Sub-GHz HAL 实现 |
| `lib/subghz/devices/cc1101_int/cc1101_int_interconnect.c` | 内置 CC1101 驱动 |
| `applications/services/bt/bt_service/bt.c` | BLE 服务主链 |

---

## 无线改造优先级与移植路线图

### 总判断

以这次本地 4 套源码树来看，**最适合当无线主基线的是 Momentum**。

原因不是它"功能最多"，而是它这几条线最集中：
- `BLE start_app`
- `serial_profile / Companion bridge`
- `FindMy / extra_beacon`
- `subghz_txrx`
- `extend_range` 控制面

它们大多还在主树里，不是散在一堆 external helper 里。

如果以后要从另外 3 套里继续抽无线能力，建议顺序是：
1. Unleashed
2. Xtreme
3. RogueMaster

这不是"谁强谁弱"的排序，而是 **移植风险从低到高** 的排序。

### 为什么 Momentum 最适合当母版

#### BLE 主链集中

关键入口都在主树：
- `furi_hal_bt_start_app()`：`targets/f7/furi_hal/furi_hal_bt.c:165`
- Companion bridge 喂 RPC：`applications/services/bt/bt_service/bt.c:200`
- BLE 测试发射：`applications/services/bt/bt_cli.c:44`

#### FindMy 是系统级挂载，不是散装 external

- `findmy_startup()`：`applications/system/findmy/findmy_startup.c:9`
- `findmy_state_apply()`：`applications/system/findmy/findmy_state.c:115`

#### Sub-GHz 控制面和发送面都在主链

- `subghz_txrx_tx_start()`：`applications/main/subghz/helpers/subghz_txrx.c:304`
- `subghz_devices_start_async_tx()`：`lib/subghz/devices/devices.c:145`
- `momentum_app_apply()` 写 `extend_range.txt`：`applications/main/momentum_app/momentum_app.c:69`

一句话说就是：**Momentum 最像一个已经整理好的"无线发行版骨架"。**

### 推荐移植顺序

#### 第一批：先看 Unleashed

**适合先迁什么**
- `find_my_flipper`
- `namechanger`
- 少量系统服务型增强

**关键入口**
- `findmy_startup()`：`applications/system/find_my_flipper/findmy_startup.c:9`
- `findmy_state_apply()`：`applications/system/find_my_flipper/findmy_state.c:115`
- `namechanger_on_system_start()`：`applications/services/namechanger/namechanger.c:73`

**为什么先迁它**
- 跟 Momentum 一样偏系统服务 / 启动注入
- 没把同类能力拆成一大堆 external app
- BLE 主链接口代际跟 Momentum 接近

#### 第二批：再看 Xtreme

**适合迁什么**
- `xtreme_app` 的设置控制面
- `subghz_extended_freq`
- 一些"统一设置 -> 控制文件落盘"的写法

**关键入口**
- `xtreme_app_apply()`：`applications/main/xtreme_app/xtreme_app.c:14`
- `subghz_extended_freq()`：`applications/main/subghz/subghz_extended_freq.c:7`

**为什么排第二**
- 它和 Momentum 的控制平面哲学非常接近
- 但它的 BLE 接口还是旧代际

所以 Xtreme 最适合拿来学：
- 设置总控怎么写
- 主菜单/协议开关怎么统一落盘

但不适合"整块照抄 BLE 相关代码"。

#### 第三批：最后才看 RogueMaster

**适合迁什么**
- 只迁 **点状功能**
- 只迁 **上游没有等价实现** 的能力
- 不要整块搬它的 wireless helper

**关键入口**
- `cfw_app_apply()`：`applications/settings/cfw_app/cfw_app.c:14`
- `findmy_startup()`：`applications/external/find_my_flipper/findmy_startup.c:5`
- `namechanger_name_write()`：`applications/external/namechanger/namechanger.c:105`

**为什么最后再看**
- 它的 external app 池太大
- 同类 helper 分散
- `setting_user` 路径都已经出现漂移
- 很容易搬着搬着把主链也污染了

### 最容易炸的 4 个断点

#### 断点 1：`furi_hal_bt_start_app()` 签名代际

**新接口**（Momentum / Unleashed）

带 `const GapRootSecurityKeys* root_keys`

**旧接口**（Xtreme / RogueMaster）

没有 `root_keys`

**为什么这是第一爆点**

任何跨仓搬运 BLE profile / service / startup 代码，只要碰到：
- `gap_init`
- `profile start`
- `bt service start`

基本都会先撞到这个签名代际差异。

**结论**：从 Xtreme / RogueMaster 往 Momentum 搬 BLE 代码时，**先适配 HAL 接口，再谈业务逻辑**

#### 断点 2：FindMy 挂载层级

**系统内建型**
- Momentum：`applications/system/findmy/findmy_startup.c:9`
- Unleashed：`applications/system/find_my_flipper/findmy_startup.c:9`

**较旧系统型**
- Xtreme：`applications/system/find_my_flipper/findmy_startup.c:5`

**external 型**
- RogueMaster：`applications/external/find_my_flipper/findmy_startup.c:5`

**为什么会炸**

同一个 `findmy_state_apply()` 逻辑，放在：
- system service
- startup service
- external app

它的生命周期、挂载时机、依赖关系都不一样。

所以：RogueMaster 的版本不能直接当 Momentum 的系统服务照搬，先要把挂载位置改回系统层。

#### 断点 3：`setting_user` vs `setting_user.txt`

**Momentum / Unleashed / Xtreme**

都偏向：`EXT_PATH("subghz/assets/setting_user")`

**RogueMaster**

主链偏向：`EXT_PATH("subghz/assets/setting_user.txt")`

但 external 池又混用：
- `setting_user`
- `setting_user.txt`
- `setting_user.pocsag`

**为什么会炸**

你看起来移植的是一个 UI App，实际上顺手把配置文件命名规则也带过来了。结果就是：
- 主链读一种
- external helper 读另一种
- 用户改了设置却不生效

#### 断点 4：external helper 漂移

RogueMaster 里大量 external app 自带：
- `subghz_txrx`
- `subghz_signal`
- `ble_serial`

**为什么会炸**

这些 helper 往往：
- 看起来很方便
- 实际依赖自己的目录结构和配置命名
- 还可能偷偷跟主链 helper 版本不一样

**结论**
- 不要搬 helper 本体
- 只抽"模式"
- 主链里继续维持一套统一 helper

### Sub-GHz 放行策略其实分 3 条路线

#### 路线 A：`extend_range + ignore_default_tx_region`

这条路线最明确的代表是：Momentum、RogueMaster

关键点：
- Momentum 读写：`applications/main/subghz/subghz_extended_freq.c:19`
- Momentum 控制面：`applications/main/momentum_app/momentum_app.c:69`
- RogueMaster 启用：`applications/main/subghz/subghz_extended_freq.c:13`
- RogueMaster 控制面：`applications/settings/cfw_app/cfw_app.c:81`

#### 路线 B：`dangerous_frequency`

这条路线这次最清楚出现在：Unleashed

关键点：
- 状态位：`targets/f7/furi_hal/furi_hal_subghz.c:56`
- 设置函数：`targets/f7/furi_hal/furi_hal_subghz.c:76`
- 检查点：`targets/f7/furi_hal/furi_hal_subghz.c:397`
- UI 入口：`applications/main/subghz/subghz_dangerous_freq.c:21`

#### 路线 C：`extended_frequency`

这条路线最清楚出现在：Xtreme

关键点：
- 状态位：`targets/f7/furi_hal/furi_hal_subghz.c:56`
- 设置函数：`targets/f7/furi_hal/furi_hal_subghz.c:76`
- 检查点：`targets/f7/furi_hal/furi_hal_subghz.c:384`
- 启动挂载：`applications/main/subghz/subghz_extended_freq.c:16`

**这里真正该怎么迁**

不要试图把 3 条路线糊成一锅。

更合理的办法是：
1. 在 Momentum 里保留它现有的 `extend_range + bypass` 文件控制面
2. 从 Unleashed / Xtreme 学 **HAL 开关形态**
3. 不直接把它们的 UI / 状态名原样搬过来

### 真正可执行的移植路线

#### 第 1 步：先锁主链，不碰 external

只围绕 Momentum 现有这三条主链做：
- BLE 启动：`targets/f7/furi_hal/furi_hal_bt.c:165`
- Companion bridge：`applications/services/bt/bt_service/bt.c:200`
- Sub-GHz 发射入口：`applications/main/subghz/helpers/subghz_txrx.c:352`

也就是说先保证：
- 主链清楚
- 控制面清楚
- 配置文件命名清楚

#### 第 2 步：迁 Unleashed 的系统服务逻辑

优先迁：
- `findmy_state`
- `namechanger`

理由：
- 它和 Momentum 的系统层组织最接近
- 移植范围小
- 不需要先拆 external

#### 第 3 步：迁 Xtreme 的控制平面模式

重点不是搬 BLE，而是搬：
- `xtreme_app_apply()` 的"UI 选项 -> 写控制文件"套路

迁的时候要先做：
- BLE HAL 签名适配
- `extended_frequency` 语义映射

#### 第 4 步：最后才从 RogueMaster 挑点状功能

规则很简单：
- 只挑没有现成上游对照物的功能
- 只抄入口模式，不抄 external helper 整包
- 迁之前先统一配置文件命名

### 一句压缩结论

如果你后面真的要继续"改造无线"，最佳策略不是四套一起搬，而是：
- **Momentum 当母版**
- **Unleashed 补系统服务**
- **Xtreme 补设置控制面**
- **RogueMaster 只挖点状功能**

如果只记一句：**先守住 Momentum 主链，再吸收别家的模式，不要反过来。**

### 路线 1：全量总览（推荐）

1. 阅读本章的"一句话结论"和"本质区别"
2. 对比阅读 Momentum 和 Unleashed 的关键文件
3. 查看"无线实现差异矩阵"理解分叉点
4. 最后看 RogueMaster 理解维护风险

### 路线 2：无线主链（专攻 BLE/Sub-GHz）

1. 理解四固件共享的 BLE 主链
2. 对比 `furi_hal_bt_start_app()` 代际差异
3. 深挖 `extra_beacon.c` 实现
4. 学习 Sub-GHz async TX 机制
5. 查看 Find My 的不同挂载方式

### 路线 3：移植与改造（实战导向）

1. 以 Momentum 为主样本
2. 用 Unleashed 当稳定对照组
3. 需要历史背景时查 Xtreme
4. 需要功能灵感时翻 RogueMaster 的 external 池

---

## 维护风险评估

| 固件 | 风险点 | 建议 |
|------|--------|------|
| **Momentum** | UI 深改面大（canvas/gui/menu/loader），官方升级可能破坏自定义钩子 | 关注官方 GUI 层更新 |
| **Unleashed** | 风险较低，但协议增强可能随官方更新需调整 | 保持与官方基线同步 |
| **Xtreme** | 已归档，无持续维护 | 只学思路，不当基线 |
| **RogueMaster** | external 池极大（611+），配置文件名分叉，来源追踪困难 | 当资源库用，不当唯一基线 |

---

## 关键判断总结

1. **Momentum 最适合当无线主基线** —— 体系化、接口整、external 噪音少
2. **Unleashed 最适合补系统服务** —— 克制、稳定、协议能力强
3. **Xtreme 最适合补控制平面** —— 历史演化样本
4. **RogueMaster 更适合当功能灵感池** —— 代码多不等于适合当主线

---

## 继续阅读

- [上一章：09. 固件参考 2025-2026](09-Firmware-Reference-2025.md) — 功能层面的固件对比
- [中文主知识库](../FlipperZero-Master-CN.md) — 回到平台总览
- [趣味 App 完全收录](../Apps/趣味App完全收录.md) — 社区应用实践

[返回中文教学导航](README.md) | [上一章：09. 固件参考](09-Firmware-Reference-2025.md) | [返回中文入口](../README.md)
