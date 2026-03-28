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

**不是**"多加几个功能"，而是**系统化改造**：

- **启动迁移**：自动兼容旧配置（Xtreme → Momentum）
- **资产包系统**：动画/图标/字体的外部打包体系
- **UI 基础设施**：canvas/gui/menu/loader 的深度钩子
- **统一设置层**：`lib/momentum` + `momentum_app`

**关键文件**：
```
furi/flipper.c                    # 启动迁移逻辑
lib/momentum/settings.c           # 统一配置系统
lib/momentum/asset_packs.c        # 资产包核心
applications/main/momentum_app/   # 设置控制中心
```

**核心设计哲学**：把深度自定义收敛进独立命名空间，而不是散落各处。

---

### 2. Unleashed：协议能力增强

**重心不是花哨界面，而是协议栈**：

- **Sub-GHz 扩展**：更多频率、更多协议
- **外置 CC1101**：完整的内外置分发器
- **名称修改服务**：系统级 `namechanger`
- **文档与工具链稳定**

**关键文件**：
```
applications/services/namechanger/     # 设备名改写服务
lib/subghz/devices/devices.c           # 内外置分发器
applications/main/subghz/              # Sub-GHz 主应用
```

**核心设计哲学**：尽量贴近官方，在协议和硬件支持上做增强。

---

### 3. Xtreme：祖先型深改固件

历史上影响巨大的固件，**上游已归档**：

- `Xtreme Settings` 控制平面
- 资产包热替换机制
- BadKB 功能起源
- 菜单/状态栏/锁屏/暗色模式改造

**学习价值**：看 UI/资产系统从激进改造到成熟整合的演化路径。

**注意**：适合学习思路，**不适合**再当长期维护基线。

---

### 4. RogueMaster：超大聚合仓

**不是深改，是海量聚合**：

- `applications/external` 下有 **611** 个带 `application.fam` 的目录
- `CFW Settings` + 主菜单/游戏菜单双体系
- 同一功能可能有多个实现版本

**风险**：
- 配置文件名分叉（`setting_user` vs `setting_user.txt`）
- 外部 App 池维护成本高
- 来源追踪困难

**学习价值**：理解"为什么超大整合会带来指数级维护成本"。

---

## 无线实现差异矩阵

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

## 最值得深挖的源码文件

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

## 源码学习路线

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
