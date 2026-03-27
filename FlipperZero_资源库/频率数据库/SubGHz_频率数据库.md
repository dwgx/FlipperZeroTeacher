# SubGHz 频率数据库

> 收集自全球各地常见无线设备频率
> **免责声明**: 仅用于合法的安全研究和教育目的

---

## 亚洲地区常用频率

### 中国
| 频率 | 用途 | 协议 |
|-----|------|------|
| 315.000 MHz | 汽车遥控钥匙 | ASK/OOK |
| 433.920 MHz | 门禁系统、报警器 | ASK/OOK |
| 430.000-440.000 MHz | 业余无线电 | FM |
| 470.000-510.000 MHz | 对讲机 | FM |

### 日本
| 频率 | 用途 | 协议 |
|-----|------|------|
| 312.000 MHz | 汽车遥控 | ASK |
| 315.000 MHz | 汽车遥控 | ASK |
| 426.000 MHz | 玩具遥控 | ASK |
| 429.000 MHz | 玩具遥控 | ASK |

### 韩国
| 频率 | 用途 | 协议 |
|-----|------|------|
| 314.900 MHz | 汽车遥控 | ASK |
| 433.920 MHz | 门禁系统 | ASK |

---

## 欧美地区常用频率

### 美国 (FCC)
| 频率 | 用途 | 协议 |
|-----|------|------|
| 300.000-348.000 MHz | ISM 设备 | 多种 |
| 387.000-464.000 MHz | ISM 设备 | 多种 |
| 779.000-928.000 MHz | ISM 设备 | 多种 |
| 315.000 MHz | 汽车遥控、车库门 | OOK/ASK |
| 433.920 MHz | 无线传感器 | FSK |
| 915.000 MHz | 智能家居 | FSK |

### 欧洲 (CE)
| 频率 | 用途 | 协议 |
|-----|------|------|
| 433.050-434.790 MHz | ISM 频段 | 多种 |
| 868.000-868.600 MHz | 智能家居、报警 | 多种 |
| 868.700-869.200 MHz | 无线麦克风 | FM |
| 869.400-869.650 MHz | 无线耳机 | FM |

---

## 设备专用频率

### 汽车遥控
| 品牌 | 频率 | 备注 |
|-----|------|------|
| 丰田 | 315 MHz, 433.92 MHz | 地区差异 |
| 本田 | 313.8 MHz, 433.92 MHz | 双向遥控 |
| 日产 | 315 MHz, 433.92 MHz | |
| 大众 | 433.92 MHz, 868 MHz | 欧洲车型 |
| 宝马 | 315 MHz, 433.92 MHz, 868 MHz | |
| 奔驰 | 433.92 MHz, 868 MHz | |
| 奥迪 | 433.92 MHz, 868 MHz | |
| 福特 | 315 MHz, 433.92 MHz | |
| 通用 | 315 MHz, 433.92 MHz | |

### 车库门遥控器
| 品牌 | 频率 | 编码方式 |
|-----|------|---------|
| LiftMaster | 310 MHz, 315 MHz, 390 MHz | Rolling Code |
| Chamberlain | 315 MHz, 390 MHz | Rolling Code |
| Genie | 315 MHz, 390 MHz | Intellicode |
| Craftsman | 315 MHz, 390 MHz | Rolling Code |
| Stanley | 310 MHz, 315 MHz | Fixed Code |
| Linear | 318 MHz, 310 MHz | MegaCode |

### 门禁系统
| 品牌 | 频率 | 备注 |
|-----|------|------|
| HID Prox | 125 kHz (RFID) | 低频感应 |
| EM4100 | 125 kHz | 只读卡 |
| MIFARE | 13.56 MHz (NFC) | 高频加密 |
| Kantech | 125 kHz | 门禁卡 |
| Indala | 125 kHz | 低频加密 |

### 智能家居
| 设备类型 | 频率 | 协议 |
|---------|------|------|
| 温湿度传感器 | 433.92 MHz | Oregon Scientific |
| 无线门铃 | 433.92 MHz, 315 MHz | 固定码 |
| 智能插座 | 433.92 MHz, 315 MHz | 学习码 |
| 报警主机 | 433.92 MHz, 315 MHz | 滚动码 |
| 无线摄像头 | 2.4 GHz, 5.8 GHz | 模拟/数字 |

---

## Flipper Zero SubGHz 文件示例

### 简单捕获文件 (.sub)
```
Filetype: Flipper SubGHz Key File
Version: 1
Frequency: 433920000
Preset: FuriHalSubGhzPresetOok650Async
Protocol: Princeton
Bit: 24
Key: 00 00 00 00 55 01 10
```

### RAW 捕获文件 (.sub)
```
Filetype: Flipper SubGHz Raw File
Version: 1
Frequency: 433920000
Preset: FuriHalSubGhzPresetOok650Async
Protocol: RAW
RAW_Data: 650 -400 650 -400 650 -400 ...
```

### 遥控文件 (.sub) - 用于重放
```
Filetype: Flipper SubGHz Key File
Version: 1
Frequency: 433920000
Preset: FuriHalSubGhzPresetOok650Async
Protocol: KeeLoq
Bit: 64
Key: 12 34 56 78 9A BC DE F0
Seed: 12345678
```

---

## 解码参数设置

### 常用 Preset 配置
| Preset 名称 | 用途 |
|------------|------|
| FuriHalSubGhzPresetOok650Async | OOK 调制，650kHz 带宽 |
| FuriHalSubGhzPresetOok270Async | OOK 调制，270kHz 带宽 |
| FuriHalSubGhzPreset2FSKDev238Async | 2FSK，238kHz 频偏 |
| FuriHalSubGhzPreset2FSKDev476Async | 2FSK，476kHz 频偏 |
| FuriHalSubGhzPresetCustom | 自定义配置 |

---

## 合法使用说明

1. **仅在授权设备上测试** - 确保你拥有设备所有权或明确授权
2. **遵守当地法规** - 不同地区对无线频率使用有不同规定
3. **不得用于非法入侵** - 禁止未经授权访问他人财产
4. **安全研究目的** - 用于漏洞发现和防御加固

---

*数据来源: Flipper Zero 社区、公开技术文档*
*更新日期: 2026-03-27*
