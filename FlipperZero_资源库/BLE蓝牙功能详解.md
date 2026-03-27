# BLE 蓝牙功能详解

> Flipper Zero BLE 功能技术文档

---

## BLE 基础

### 工作频率
- **频段**: 2.400 - 2.4835 GHz (ISM频段)
- **信道**: 40个信道，每个2MHz
  - 广播信道: 37, 38, 39
  - 数据信道: 0-36

### BLE 广播包结构
```
[前导码][访问地址][PDU][CRC]

PDU结构:
[Header][Payload]

Header:
- PDU Type (4 bits)
- RFU (1 bit)
- TxAdd (1 bit)
- RxAdd (1 bit)
- Length (8 bits)

Payload:
- AdvA (6 bytes) - 广播者地址
- AdvData (0-31 bytes) - 广播数据
```

---

## BLE 广播类型

### 常见的 BLE 广播类型

#### 1. Apple iBeacon
```c
// iBeacon 广播数据结构
uint8_t ibeacon_data[] = {
    0x02, 0x01, 0x06,                    // Flags
    0x1A, 0xFF, 0x4C, 0x00,              // Manufacturer (Apple)
    0x02, 0x15,                          // iBeacon indicator
    0x00, 0x00, 0x00, 0x00,              // UUID (16 bytes)
    0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00,
    0x00, 0x00,                          // Major
    0x00, 0x00,                          // Minor
    0xC5                                 // TX Power
};
```

#### 2. Eddystone (Google)
```c
// Eddystone-UID
uint8_t eddystone_uid[] = {
    0x02, 0x01, 0x06,                    // Flags
    0x03, 0x03, 0xAA, 0xFE,              // Service UUID
    0x17, 0x16, 0xAA, 0xFE,              // Service Data
    0x00,                                // Eddystone Frame Type (UID)
    0x00,                                // TX Power
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // NID
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00  // BID
};
```

#### 3. AirPods 广播
```c
// Apple AirPods 广播数据
uint8_t airpods_data[] = {
    0x1e,                                // Length
    0xff,                                // Manufacturer Specific
    0x4c, 0x00,                          // Company ID (Apple)
    0x07,                                // Type
    0x19,                                // Length
    0x07,                                // AirPods type
    // ... 设备特定数据
};
```

---

## Company ID 列表

| 公司 | ID (Hex) |
|-----|---------|
| Apple Inc. | 0x004C |
| Microsoft | 0x0006 |
| Samsung Electronics | 0x0075 |
| Google Inc. | 0x00E0 |
| Huawei | 0x007D |
| Xiaomi | 0x038F |
| Sony Ericsson | 0x00D3 |
| Nintendo | 0x0105 |
| Amazon | 0x00FC |
| Fitbit | 0x00FB |

---

## BLE 应用开发示例

### 基础 BLE 应用代码
```c
// ble_app.c
#include <furi.h>
#include <ble/ble.h>
#include <gui/gui.h>

typedef struct {
    FuriMutex* mutex;
    FuriThread* thread;
    bool running;
} BleApp;

static BleApp* app = NULL;

static int32_t ble_worker(void* context) {
    BleApp* app = context;

    while(app->running) {
        furi_mutex_acquire(app->mutex, FuriWaitForever);

        // BLE 广播逻辑
        // 设置广播参数
        // 发送广播包

        furi_mutex_release(app->mutex);
        furi_delay_ms(100);
    }

    return 0;
}

int32_t ble_app_main(void* p) {
    UNUSED(p);

    app = malloc(sizeof(BleApp));
    app->mutex = furi_mutex_alloc(FuriMutexTypeNormal);
    app->running = true;

    app->thread = furi_thread_alloc();
    furi_thread_set_name(app->thread, "BleWorker");
    furi_thread_set_stack_size(app->thread, 2048);
    furi_thread_set_callback(app->thread, ble_worker);
    furi_thread_set_context(app->thread, app);
    furi_thread_start(app->thread);

    // 主循环
    while(app->running) {
        furi_delay_ms(100);
    }

    // 清理
    furi_thread_join(app->thread);
    furi_thread_free(app->thread);
    furi_mutex_free(app->mutex);
    free(app);

    return 0;
}
```

### 应用清单 (application.fam)
```python
App(
    appid="ble_app",
    name="BLE App",
    apptype=FlipperAppType.EXTERNAL,
    entry_point="ble_app_main",
    cdefines=["APP_BLE"],
    requires=["gui", "ble"],
    stack_size=4 * 1024,
    fap_category="Bluetooth",
    fap_icon="ble_icon.png",
)
```

---

## BLE 攻击面 (用于安全研究)

### 1. BLE 广播分析
- 抓取广播包分析设备类型
- 识别Manufacturer Specific Data
- 追踪设备MAC地址

### 2. BLE 配对安全
- Just Works 配对漏洞
- Passkey Entry 中间人攻击
- Legacy Pairing 弱点

### 3. BLE 连接安全
- 未加密连接嗅探
- 重放攻击
- 数据包伪造

---

## 合法使用警告

**BLE广播干扰在某些地区可能是非法的。**

允许的使用场景:
- 测试自己设备的BLE安全性
- 研究BLE协议实现
- 开发BLE应用

禁止的行为:
- 干扰公共BLE设备
- 冒充他人设备
- 未授权访问BLE设备数据

---

*技术文档供学习参考*
*更新日期: 2026-03-27*
