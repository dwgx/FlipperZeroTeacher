# Flipper Zero (小海豚) 完整技术资源指南

> 文档创建日期: 2026-03-27
> 用途: 收集 Flipper Zero 开源资源、频率数据库、应用开发指南

---

## 目录

1. [设备概述](#设备概述)
2. [自定义固件对比](#自定义固件对比)
3. [SubGHz 频率数据库](#subghz-频率数据库)
4. [BLE 蓝牙功能](#ble-蓝牙功能)
5. [RFID/NFC 功能](#rfidnfc-功能)
6. [BadUSB 功能](#badusb-功能)
7. [红外数据库](#红外数据库)
8. [应用开发指南](#应用开发指南)
9. [重要资源仓库](#重要资源仓库)

---

## 设备概述

Flipper Zero 是一款便携式多功能黑客工具，具有以下硬件特性：

| 功能模块 | 规格 |
|---------|------|
| SubGHz | 300-348 MHz, 387-464 MHz, 779-928 MHz (CC1101) |
| RFID LF | 125 kHz |
| NFC | 13.56 MHz |
| 蓝牙 | BLE 5.0 (Nordic 52840) |
| 红外 | 38 kHz 收发器 |
| GPIO | 18pin 扩展接口 |
| 显示屏 | 128x64 LCD 单色 |
| 电池 | 2000 mAh LiPo |

---

## 自定义固件对比

### 1. Momentum Firmware (推荐)
- **GitHub**: `https://github.com/Next-Flip/Momentum-Firmware`
- **特点**: 官方固件增强版，稳定性好，功能丰富
- **优势**: 应用商店集成、更好的UI、持续更新

### 2. Unleashed Firmware
- **GitHub**: `https://github.com/DarkFlippers/unleashed-firmware`
- **特点**: 解锁了地区限制频率，功能最全
- **优势**: 支持更多SubGHz频率、去限制

### 3. Xtreme Firmware (已合并到Momentum)
- ~~原Xtreme功能已整合进Momentum~~

### 刷机命令
```bash
# 使用 qFlipper 桌面应用刷机
# 或命令行方式
wget https://update.flipperzero.one/builds/momentum-firmware/...
# 拖拽到qFlipper或放入SD卡更新
```

---

## SubGHz 频率数据库

### 常见频率列表

| 频率 | 用途 | 地区 |
|-----|------|------|
| 315.00 MHz | 汽车遥控、车库门 | 美国/亚洲 |
| 433.92 MHz | 门禁、报警器、遥控 | 欧洲/全球 |
| 868.35 MHz | 智能家居、IoT | 欧洲 |
| 915.00 MHz | ISM频段设备 | 美国 |
| 390.00 MHz | 汽车遥控 | 日本 |
| 418.00 MHz | 遥控玩具 | 全球 |
| 303.80 MHz | 汽车遥控 | 美国 |

### 信号捕获命令
```
# Flipper CLI 命令
subghz rx 433920000
subghz rx 315000000
```

### 文件保存路径
```
/sdcard/subghz/
  ├── captured/
  ├── db/
  └── settings.ini
```

### SubGHz 文件格式 (.sub)
```javascript
Filetype: Flipper SubGHz Key File
Version: 1
Frequency: 433920000
Preset: FuriHalSubGhzPresetOok650Async
Protocol: Princeton
Bit: 24
Key: 00 00 00 00 55 01 10
```

---

## BLE 蓝牙功能

### BLE 广播功能

#### 1. BLE Spam (蓝牙广播干扰)
- **功能**: 模拟各种BLE设备广播
- **用途**: 测试设备响应、安全研究
- **支持的设备类型**:
  - Apple AirPods / AirPods Pro / AirPods Max
  - Apple Watch / iPhone / iPad
  - Samsung Buds / Galaxy Watch
  - Google Pixel Buds
  - Microsoft Surface

#### 相关应用代码结构
```c
// BLE 应用基本结构 (Furi HAL)
#include <furi.h>
#include <gui/gui.h>
#include <gui/elements.h>
#include <ble/ble.h>

// BLE 广播参数设置
typedef struct {
    uint8_t mac_address[6];
    uint16_t company_id;
    uint8_t* data;
    size_t data_len;
} BleSpamConfig;

// 常用Company ID
#define COMPANY_ID_APPLE 0x004C
#define COMPANY_ID_SAMSUNG 0x0075
#define COMPANY_ID_GOOGLE 0x00E0
#define COMPANY_ID_MICROSOFT 0x0006
```

### BLE 频率
- 2.400 - 2.4835 GHz (2.4GHz ISM频段)
- 40个信道，3个广播信道 (37, 38, 39)

---

## RFID/NFC 功能

### 125 kHz RFID (低频)

#### 支持的卡片类型
| 类型 | 说明 |
|-----|------|
| EM4100 | 最常见只读卡 |
| EM4200 | EM4100升级版 |
| H10301 | HID Prox卡片 |
| Indala | 低频加密卡 |
| AWID | 门禁常用 |
| FDX-B | 动物标签 |

#### RFID读取命令
```
# 125kHz读取
rfid read
rfid save /ext/rfid/my_card.rfid
```

#### RFID 文件格式 (.rfid)
```
Filetype: Flipper RFID key
Version: 1
Key type: EM4100
Data: 3C 00 6F 4E 1B
```

### 13.56 MHz NFC (高频)

#### 支持的卡片类型
| 类型 | 说明 |
|-----|------|
| MIFARE Classic 1K | 最常用门禁卡 |
| MIFARE Classic 4K | 大容量版本 |
| MIFARE Ultralight | 一次性写入 |
| MIFARE DESFire | 高安全性 |
| NTAG213/215/216 | NFC标签 |
| ISO14443-4A | 银行卡等 |
| FeliCa | 日本交通卡 |

#### NFC 文件格式 (.nfc)
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

#### NFC 密钥字典
```
# 默认密钥 (common_keys.txt)
FFFFFFFFFFFF
000000000000
A0A1A2A3A4A5
D3F7D3F7D3F7
AABBCCDDEEFF
```

---

## BadUSB 功能

### Ducky Script 语法

```ducky
REM 注释: 这是一个示例脚本
DELAY 1000
GUI r
DELAY 500
STRING powershell -WindowStyle Hidden -Command "..."
ENTER
DELAY 1000
```

### 常用命令
| 命令 | 说明 |
|-----|------|
| REM | 注释 |
| DELAY ms | 延迟毫秒 |
| STRING text | 输入字符串 |
| ENTER | 回车键 |
| GUI | Win键/Cmd键 |
| CTRL | Ctrl键 |
| SHIFT | Shift键 |
| ALT | Alt键 |
| TAB | Tab键 |
| DOWN/UP/LEFT/RIGHT | 方向键 |
| SPACE | 空格 |
| REPEAT n | 重复上一命令n次 |

### 文件格式 (.txt)
```
REM Flipper Zero BadUSB Script
DELAY 1000
GUI r
DELAY 500
STRING notepad
ENTER
DELAY 1000
STRING Hello from Flipper Zero!
```

---

## 红外数据库

### 红外数据库来源
- IRDB (Infrared Database): 包含数千种设备
- 格式: `.ir` 文件

### IR 文件格式 (.ir)
```
Filetype: IR signals file
Version: 1
#
name: Power
type: parsed
protocol: NEC
address: 04 00 00 00
command: 01 00 00 00
#
name: Vol_up
type: raw
frequency: 38000
duty_cycle: 0.330000
data: 9000 4500 500 ...
```

### 支持的协议
- NEC
- NECext
- NEC42
- NEC42ext
- Samsung32
- RC6
- RC5
- RC5X
- SIRC
- SIRC15
- SIRC20
- Kaseikyo
- Panasonic

---

## 应用开发指南

### FAP (Flipper Application Package) 开发

#### 开发环境设置
```bash
# 1. 克隆固件源码
git clone --recursive https://github.com/flipperdevices/flipperzero-firmware.git
cd flipperzero-firmware

# 2. 安装依赖 (macOS)
brew install protobuf nanopb

# 3. 构建固件
./fbt
```

#### 应用基本结构
```c
// hello_world.c
#include <furi.h>
#include <gui/gui.h>
#include <input/input.h>

typedef struct {
    FuriMessageQueue* input_queue;
    ViewPort* view_port;
    Gui* gui;
} HelloWorldApp;

static void draw_callback(Canvas* canvas, void* ctx) {
    UNUSED(ctx);
    canvas_clear(canvas);
    canvas_set_font(canvas, FontPrimary);
    canvas_draw_str(canvas, 25, 30, "Hello World!");
}

static void input_callback(InputEvent* input_event, void* ctx) {
    HelloWorldApp* app = ctx;
    furi_message_queue_put(app->input_queue, input_event, FuriWaitForever);
}

int32_t hello_world_app(void* p) {
    UNUSED(p);
    HelloWorldApp* app = malloc(sizeof(HelloWorldApp));

    app->input_queue = furi_message_queue_alloc(8, sizeof(InputEvent));
    app->view_port = view_port_alloc();
    view_port_draw_callback_set(app->view_port, draw_callback, app);
    view_port_input_callback_set(app->view_port, input_callback, app);

    app->gui = furi_record_open("gui");
    gui_add_view_port(app->gui, app->view_port, GuiLayerFullscreen);

    InputEvent input;
    bool running = true;
    while(running) {
        if(furi_message_queue_get(app->input_queue, &input, 100) == FuriStatusOk) {
            if(input.type == InputTypePress && input.key == InputKeyBack) {
                running = false;
            }
        }
    }

    gui_remove_view_port(app->gui, app->view_port);
    view_port_free(app->view_port);
    furi_message_queue_free(app->input_queue);
    free(app);

    return 0;
}
```

#### 应用清单文件 (application.fam)
```python
App(
    appid="hello_world",
    name="Hello World",
    apptype=FlipperAppType.EXTERNAL,
    entry_point="hello_world_app",
    cdefines=["APP_HELLO_WORLD"],
    requires=["gui"],
    stack_size=2 * 1024,
    order=10,
    fap_icon="icon.png",
    fap_category="Misc",
)
```

### 编译命令
```bash
# 构建特定应用
./fbt firmware/external_apps

# 构建FAP文件
./fbt fap_hello_world
```

---

## 重要资源仓库

### 官方资源
| 资源 | 链接 |
|-----|------|
| 官方固件 | https://github.com/flipperdevices/flipperzero-firmware |
| 官方文档 | https://docs.flipperzero.net |
| 官方网站 | https://flipperzero.one |
| qFlipper 桌面应用 | https://flipperzero.one/update |

### 社区资源
| 资源 | 链接 | 说明 |
|-----|------|------|
| Momentum Firmware | https://github.com/Next-Flip/Momentum-Firmware | 推荐自定义固件 |
| Unleashed Firmware | https://github.com/DarkFlippers/unleashed-firmware | 解锁频率限制 |
| UberGuidoZ 资源库 | https://github.com/UberGuidoZ/Flipper | 最大的资源集合 |
| Awesome Flipper | https://github.com/djsime1/awesome-flipperzero | 资源汇总 |
| Flipper IRDB | https://github.com/UberGuidoZ/Flipper-IRDB | 红外数据库 |
| Flipper SubGHz | https://github.com/UberGuidoZ/Flipper-SignalDB | SubGHz信号库 |

### 应用商店
| 名称 | 链接 |
|-----|------|
| FlipC.org | https://flipc.org |
| Lab.flipper.net | https://lab.flipper.net |
| Flipper App Store | 内置应用商店 (Momentum) |

---

## 文件路径速查

### SD卡结构
```
/sdcard/
├── apps/               # FAP应用
│   ├── GPIO/
│   ├── Games/
│   ├── Media/
│   ├── NFC/
│   ├── SubGHz/
│   └── Tools/
├── badusb/            # BadUSB脚本
├── infrared/          # 红外信号
│   └── remote/
├── nfc/               # NFC卡片数据
├── rfid/              # RFID卡片数据
├── subghz/            # SubGHz信号
│   ├── captured/
│   └── remote/
├── u2f/               # U2F密钥
├── wav_player/        # 音频文件
└── manifest.txt       # 文件清单
```

---

## 安全声明

**本资源仅用于合法的安全研究、教育和设备测试目的。**

使用 Flipper Zero 进行以下行为可能违反当地法律：
- 未经授权访问他人设备
- 干扰公共或私人通信系统
- 复制门禁卡用于非法进入
- 干扰车辆遥控系统

**使用者需自行承担法律责任，确保所有测试行为获得合法授权。**

---

## 更新日志

| 日期 | 版本 | 更新内容 |
|-----|------|---------|
| 2026-03-27 | v1.0 | 初始文档创建 |

---

*本文档由 Claude 自动生成，供学习研究使用。*
