# NFC/RFID 技术详解

> Flipper Zero NFC (13.56MHz) 和 RFID (125kHz) 功能完整指南

---

## 125 kHz RFID (低频)

### 支持的卡片类型

| 类型 | 特点 | 读写能力 |
|-----|------|---------|
| **EM4100** | 最常见只读卡 | 只读，可模拟 |
| **EM4200** | EM4100升级版 | 只读 |
| **T5577** | 可读写，可改写ID | 读写 |
| **EM4305** | 可读写 | 读写 |
| **H10301** | HID Prox卡片 | 只读，可模拟 |
| **Indala** | 加密低频卡 | 只读 |
| **AWID** | 门禁常用 | 只读，可模拟 |
| **FDX-B** | 动物标签(ISO 11784/11785) | 只读 |
| **IO Prox** | HID iCLASS低频 | 只读 |

### EM4100 数据结构
```
[Header] [Customer ID] [ID Data] [Column Parity] [Row Parity] [Stop Bit]

Header:     9 bits (全1)
Customer:   8 bits (版本/客户码)
Data:       32 bits (卡号，分为4个字节)
Col Parity: 4 bits (每列奇偶校验)
Row Parity: 4 bits (每行偶校验)
Stop Bit:   1 bit (0)
```

### Flipper RFID 文件格式 (.rfid)
```
Filetype: Flipper RFID key
Version: 1
Key type: EM4100
Data: 3C 00 6F 4E 1B
```

### 写入T5577卡示例
```
1. 读取原卡获取ID
2. 准备T5577可写卡
3. 使用 "Write" 功能
4. 输入目标ID或选择已保存卡片
5. 将T5577卡放置在设备背面
6. 确认写入
```

---

## 13.56 MHz NFC (高频)

### 支持的卡片类型

#### MIFARE Classic
| 类型 | 容量 | 扇区数 | 块数 |
|-----|------|-------|------|
| MIFARE Classic 1K | 1024 bytes | 16 | 64 |
| MIFARE Classic 4K | 4096 bytes | 40 | 256 |
| MIFARE Mini | 320 bytes | 5 | 20 |

#### MIFARE Classic 数据结构
```
每个扇区 (Sector):
├── 块0-2: 数据块 (16 bytes each)
└── 块3: 控制块 (Key A + Access Bits + Key B)

控制块结构:
[Key A: 6 bytes][Access Bits: 4 bytes][Key B: 6 bytes]

访问位 (Access Bits):
- 控制每个块的读写权限
- 默认值: FF 07 80 (Key A可读写)
```

#### 默认密钥
```
FFFFFFFFFFFF  (最常见)
000000000000
A0A1A2A3A4A5  (MIFARE Classic默认)
D3F7D3F7D3F7
AABBCCDDEEFF
B0B1B2B3B4B5
```

### MIFARE Ultralight
| 类型 | 容量 | 特点 |
|-----|------|------|
| Ultralight | 512 bits | 只读OTP区域 |
| Ultralight C | 1536 bits | 3DES认证 |
| Ultralight EV1 | 640 bits | 计数器功能 |
| NTAG213 | 144 bytes | 可读写 |
| NTAG215 | 504 bytes | 可读写 |
| NTAG216 | 888 bytes | 可读写 |

### NTAG 数据结构
```
[UID: 7 bytes][Internal: 1 byte][Lock: 2 bytes][Capability Container: 4 bytes][User Data: ...]

CC (Capability Container):
- 定义卡片的NFC Forum类型和容量
- 例如: E1 10 12 00 (Type 2, 1K, 无安全)
```

### Flipper NFC 文件格式 (.nfc)
```json
{
  "Filetype": "Flipper NFC device",
  "Version": 3,
  "Device type": "Mifare Classic",
  "UID": "A1 B2 C3 D4",
  "ATQA": "00 04",
  "SAK": "08",
  "Mifare Classic": {
    "Data format version": 2,
    "Key A map": "FFFFFFFF",
    "Key B map": "FFFFFFFF",
    "Blocks": {
      "0": "A1 B2 C3 D4..."
    }
  }
}
```

---

## 密钥破解方法 (仅用于合法研究)

### 1. 已知密钥攻击
```
使用默认密钥字典尝试认证
```

### 2. 嵌套认证攻击 (Nested Authentication)
```
原理: 利用已知的扇区密钥获取其他扇区密钥
条件: 至少知道一个扇区的密钥
工具: mfoc, MIFARE Classic Tool
```

### 3. 黑暗面攻击 (Darkside Attack)
```
原理: 利用PRNG弱点，无需已知密钥
适用: 弱随机数生成的卡片
工具: mfcuk
```

### Flipper 的破解流程
```
1. 读取卡片获取UID/ATQA/SAK
2. 加载密钥字典
3. 尝试认证每个扇区
4. 成功后保存完整dump
```

---

## 门禁卡复制流程

### 复制到空白卡

#### MIFARE Classic 1K
```
1. 读取原卡 (Read)
2. 检查是否为加密卡
3. 如有需要，使用密钥破解
4. 准备CUID卡 (可改写UID)
5. 写入数据 (Write)
6. 验证复制结果
```

#### UID卡类型
| 类型 | 特点 | 可用性 |
|-----|------|--------|
| UID卡 | 可改写0块一次 | 低 |
| CUID卡 | 可重复改写0块 | 高 |
| FUID卡 | 固化UID，一次性 | 中 |
| UFUID卡 | 可锁定的UID卡 | 中 |
| Gen1A | 后门指令改写 | 高 |
| Gen2 | 直接改写0块 | 高 |

---

## NFC Forum Type 标签

| 类型 | 标准 | 容量范围 |
|-----|------|---------|
| Type 1 | ISO14443A | 96-2K bytes |
| Type 2 | ISO14443A | 48-2K bytes |
| Type 3 | Sony FeliCa | 1-4K bytes |
| Type 4 | ISO14443A/B | 高达32K bytes |
| Type 5 | ISO15693 | 高达64K bytes |

---

## 安全研究资源

### 公开工具
- **mfoc**: MIFARE Classic离线破解
- **mfcuk**: 黑暗面攻击实现
- **MIFARE Classic Tool (Android)**: 手机端NFC工具
- **Proxmark3**: 专业RFID/NFC研究设备

### 密钥字典来源
```
- 公开默认密钥
- 已泄露的系统密钥
- 针对特定系统的定制字典
```

---

## 合法使用声明

**复制门禁卡仅用于以下合法场景:**
1. 备份自己的门禁卡
2. 在授权下测试系统安全性
3. 替换损坏的合法卡片

**禁止行为:**
- 复制他人门禁卡进行未授权访问
- 破解不属于你的系统
- 制作伪卡进行欺诈活动

---

*技术文档供学习研究使用*
*更新日期: 2026-03-27*
