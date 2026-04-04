# Flipper Zero 红外数据库完整指南

> 对比对象：Lucaslhm/Flipper-IRDB · heytem/Flipper-Zero-IR-DataBase · 外部 IR 资源汇总
> 最后更新：2026-04-05
> 目的：把「从哪里拿 `.ir` / 如何整理 / 如何灌进 Flipper」一次性讲清楚

---

## 1. `.ir` 文件格式基础

Flipper Zero 使用的 `.ir` 是纯文本（Flipper 自定义格式）：

```
Filetype: IR signals file
Version: 1
#
name: Power
type: parsed
protocol: NECext
address: 20 DF 00 00
command: 10 EF 00 00
#
name: Vol_up
type: raw
frequency: 38000
duty_cycle: 0.330000
data: 9042 4484 592 533 ...
```

### 1.1 两种信号类型

| type | 适用场景 | 生成方式 |
|---|---|---|
| `parsed` | 已识别协议（NEC / NECext / RC5 / RC6 / Samsung32 / SIRC / Kaseikyo / Pioneer） | Flipper 学习时能自动识别协议就保存成 parsed |
| `raw` | 未知协议 / 学习失败的兜底 | 直接记录脉冲序列 |

**实战教训：**
- `parsed` 体积极小（一条约 30 字节 vs raw 动辄几 KB）
- `parsed` 对目标设备个体差异更鲁棒（按协议规范重新生成波形）
- `raw` 依赖 Flipper 学习质量，有噪声就可能在别的同型号设备上失灵
- 导入社区数据时**优先选 parsed**，raw 只作为补充

### 1.2 命名约定（社区潜规则）

```
ACs/                            ← 类别
├── Daikin/                     ← 品牌
│   ├── Daikin_ARC433.ir        ← <品牌>_<型号>.ir
│   └── Daikin_ARC470.ir
└── ...
TVs/
├── Samsung/
│   └── Samsung_UN50MU6300.ir
```

命名规则总结：类别目录首字母大写复数 → 品牌目录 → `<Brand>_<Model>.ir`。文件名里空格用下划线替代，避免 Flipper 文件名解析出问题。

---

## 2. 主流 IR 数据库资源一览（28 源）

按可靠度和规模分三档，每条都标注：URL / 格式 / 规模 / 转换难度 / 可靠性。

### 2.1 第一档（可直接 drop 到设备 · `.ir` 原生）

| # | 资源 | 规模 | 可靠性 | 备注 |
|---|---|---|---|---|
| 1 | [Lucaslhm/Flipper-IRDB](https://github.com/Lucaslhm/Flipper-IRDB) | 3500+ 文件 · 800+ 品牌 | ★★★★★ | 事实标准，社区 PR 流水线活跃 |
| 2 | [UberGuidoZ/Flipper-IRDB](https://github.com/UberGuidoZ/Flipper) (`Infrared/` 子目录) | 2000+ | ★★★★★ | UberGuidoZ 聚合仓，多维资源总入口 |
| 3 | [heytem/Flipper-Zero-IR-DataBase](https://github.com/heytem/Flipper-Zero-IR-DataBase) | 800+ | ★★★★ | 结构独立，有 Lucaslhm 没有的老机型 |
| 4 | [logickworkshop/Flipper-IRDB](https://github.com/logickworkshop/Flipper-IRDB) | 1500+ | ★★★★ | Lucaslhm 分支，某些品牌补全更全 |
| 5 | [probonopd/irdb-to-flipper](https://github.com/probonopd/irdb-to-flipper) | 自动生成 7000+ | ★★★ | 从 LIRC 转换，质量参差需抽样验证 |
| 6 | Momentum Firmware `assets/resources/infrared/` | 固件内置 ~200 | ★★★★★ | 每次 OTA 自带，通用遥控器够用 |
| 7 | Xtreme Firmware `assets/infrared/` | 固件内置 ~300 | ★★★★★ | 同上，Xtreme 补得更全 |
| 8 | [Amec0e/Flipper-IRDB](https://github.com/Amec0e/Flipper-IRDB) | 500+ | ★★★ | Universal 万能遥控收集癖 |
| 9 | [theAlexes/Flipper-Zero-IR-Files](https://github.com/theAlexes/Flipper-Zero-IR-Files) | 200+ | ★★★ | 欧洲家电偏多 |
| 10 | [dimtass/flipper-zero-infrared-databases-compiled](https://github.com/dimtass/flipper-zero-infrared-databases-compiled) | 合并版 5000+ | ★★★ | 把多仓合并去重，适合一键部署 |

### 2.2 第二档（需要转换 · LIRC / Pronto / CCF）

| # | 资源 | 格式 | 规模 | 转换难度 | 备注 |
|---|---|---|---|---|---|
| 11 | [LIRC remotes database](http://lirc-remotes.sourceforge.net/remotes-table.html) | LIRC conf | 2500+ | 中 | LIRC 格式，需脚本转 `.ir` |
| 12 | [probonopd/irdb](https://github.com/probonopd/irdb) | CSV (Pronto) | 7000+ | 中 | 来自 Global Cache，工业级规模 |
| 13 | [Global Caché Control Tower](https://irdb.globalcache.com/) | Pronto / CCF | 商业库 20 万+ | 中 | 老牌 IR 厂商，覆盖极广 |
| 14 | [RemoteCentral Pronto](http://www.remotecentral.com/files/) | Pronto CCF | 10000+ | 高 | 老站点，需手动下载 |
| 15 | [IRremote-Arduino examples](https://github.com/Arduino-IRremote/Arduino-IRremote) | hex code | - | 低（直接参考协议） | 不是数据库，是协议参考 |
| 16 | [eHomeRC](https://ehomerc.com/) | 各种格式 | 大量 | 高 | 商业遥控器数据 |
| 17 | [IRDB on SourceForge](http://irdb.tk/) | 各式 | - | 中 | IR 研究老圈子 |
| 18 | [Logitech Harmony](https://myharmony.com/) | 云端专有 | 27 万+设备 | 高（需抓包） | 数据库最大但不开放 |

### 2.3 第三档（专项 / 小众 / 社区散件）

| # | 资源 | 方向 | 备注 |
|---|---|---|---|
| 19 | r/flipperzero Reddit 置顶 | 资源汇总 | 每月更新的社区索引 |
| 20 | Flipper Discord `#ir-channel` | 实时求助 | 冷门型号可在这里喊 |
| 21 | [awesome-flipperzero](https://github.com/djsime1/awesome-flipperzero) | 资源索引 | 所有 Flipper 相关资源入口 |
| 22 | Flipper 官方 Discord | 官方社区 | 有 IR 专门 channel |
| 23 | Telegram @flipperzero_rus | 俄语社区 | 有独立收藏 |
| 24 | [Flipper-Xtreme 官方资源](https://github.com/Flipper-XFW/Xtreme-Firmware) | 固件附带 | |
| 25 | [Momentum-Firmware 资源](https://github.com/Next-Flip/Momentum-Firmware) | 固件附带 | |
| 26 | [dcpplusplus/Flipper_Toys](https://github.com/dcpplusplus/flipper-irdb-extras) | 玩具 / 特殊设备 | 相机、投影仪等冷门 |
| 27 | 厂商官方（三菱/大金/日立 service manuals） | 权威底层 | 日本家电 AC 特别推荐 |
| 28 | 个人博客 / Gist 碎片 | 长尾 | 搜 `site:gist.github.com flipper .ir` |

---

## 3. 分类别资源评价

### 3.1 电视 / 机顶盒（TVs / Set-top Boxes）
覆盖最完整。Lucaslhm + Momentum 内置已能覆盖三星、LG、索尼、小米、TCL、创维等 95% 常见型号。查不到就试 Universal 码表。

### 3.2 空调（ACs）
最麻烦的类别。因为空调 IR 会把「温度/模式/风速/定时」全压缩在一条 80+ 字节的 raw 里，很多 IRDB 条目只记录了「固定 24℃制冷」这一个态。**要做到完整控制需要自己学习整台遥控器的每个按键组合。** 日系（大金、三菱、日立、松下）参考原厂 service manual 最稳。

### 3.3 音响 / 功放（Audio & Receivers）
YAMAHA、Denon、Onkyo、Marantz 覆盖好。Bose 老型号偶尔缺。

### 3.4 投影仪（Projectors）
EPSON、BenQ、Optoma 基本全，国产（极米/坚果/当贝）要看 Lucaslhm 最近的 PR。

### 3.5 相机快门（Cameras）
Canon / Nikon / Sony 单反快门码稳定，在 Lucaslhm 的 `Cameras/` 目录。

### 3.6 机器人吸尘器 / 智能家居
iRobot Roomba 较全。米家生态（小米/石头/追觅）碎片化严重。

### 3.7 LED 灯带 / 氛围灯
Universal 24 键 / 44 键 IR 码表高度标准化，固件自带够用。

### 3.8 玩具 / 特殊
直升机、遥控车、Air Mouse 等在 `Miscellaneous/` 和 `Toys/` 下，heytem 库收录得意外地全。

---

## 4. 三档可靠度分级

- **★★★★★（可直接部署）**：Lucaslhm / UberGuidoZ / 固件内置 / 厂商官方
- **★★★★（抽样验证后部署）**：heytem / logickworkshop / dimtass 合并版
- **★★★（必须单个验证）**：自动转换仓（probonopd/irdb-to-flipper、LIRC 转换产物）

---

## 5. 最短获取路径（3 步搞定 90% 需求）

**目标：手边的电视/空调/机顶盒能遥控**

1. **Step 1：部署 Lucaslhm 全库**
   ```bash
   git clone --depth 1 https://github.com/Lucaslhm/Flipper-IRDB.git
   # 用 qFlipper / 拔 SD 卡 / dataset_sync.py
   # 放到 /ext/infrared/assets_user/
   ```
2. **Step 2：固件内置库不要删**，它是 Universal Remote 的数据源
3. **Step 3：查不到的冷门型号** → r/flipperzero 搜品牌 + 型号，95% 概率有人发过 gist

**补充：**如果是空调，直接用自己的遥控器学（Infrared → Learn New Remote），IRDB 很难完整覆盖单个机型的所有状态。

---

## 6. 格式转换工具表

| 工具 | 输入 | 输出 | 链接 |
|---|---|---|---|
| `irdb-to-flipper` | LIRC conf | `.ir` | https://github.com/probonopd/irdb-to-flipper |
| `pronto2flipper` | Pronto hex | `.ir` | Gist 搜 pronto2flipper |
| `ccf-to-flipper.py` | CCF (Pronto) | `.ir` | 社区脚本 |
| `RMIR` | Pronto ↔ LIRC ↔ CCF | 多种 | https://sourceforge.net/projects/controlremote/ |
| `IrpTransmogrifier` | IRP 协议描述 | 任意 | https://github.com/bengtmartensson/IrpTransmogrifier |
| `flipper_ir_merge.py` (自制) | 多个 `.ir` | 合并 `.ir` | 自己写一个 dedup + merge |
| `IRremote` (Arduino 调试) | 抓包 | hex → 手编 `.ir` | 用 Arduino 当抓包器 |

---

## 7. 已知空白区（建议社区补位）

1. **中国本土品牌空调** 完整态仍稀缺（格力、美的、海尔虽有但不全）
2. **日系老款电视** 2000-2010 年代机型散落在厂商 service manual 里，没人系统化
3. **工业遥控器**（起重机、叉车、门禁）几乎没有
4. **汽车启动 / 车库门 IR 触发器**（有合法性问题，社区主动回避）
5. **医疗设备 IR**（伦理+合法性回避）

---

## 8. 验证方法论

拿到陌生 `.ir` 先做三步：

1. **看 type**：parsed 优先部署，raw 标 `[需验证]`
2. **对比同品牌已知良品**：把要验证的文件和 Lucaslhm 的同品牌 parsed 条目对比 protocol/address，主地址一致的 90% 能用
3. **小功率测试**：用设备发 `Power` 键测试一次，再发 `Volume Up`。两个都成功才算这份 `.ir` 有效

---

## 9. 部署到设备

- qFlipper 拖拽到 `/ext/infrared/`
- 项目脚本：`py scripts/dataset_sync.py --protocol ir`
- 路径约定：`/ext/infrared/assets_user/` 放社区数据，`/ext/infrared/` 根下放自己学的

---

## 10. 参考链接

- 格式定义：[flipperdevices/flipperzero-firmware `applications/main/infrared/`](https://github.com/flipperdevices/flipperzero-firmware/tree/dev/applications/main/infrared)
- 协议参考：https://www.sbprojects.net/knowledge/ir/
- 官方文档：https://docs.flipper.net/infrared

---

*本文由 Flipper Zero Teacher 知识库整理，合并自 Lucaslhm、heytem、UberGuidoZ、Momentum、Xtreme 等公开资源及社区讨论。*
