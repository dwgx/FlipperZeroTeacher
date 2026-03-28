# 10. Firmware Source Code Deep Analysis

[Return to English Guide](README.md) | [Previous: 09. Firmware Reference](09-Firmware-Reference-2025.md) | [Return to English Entry](../README.md)

## Chapter Purpose

This chapter differs from [09. Firmware Reference](09-Firmware-Reference-2025.md):
- **Chapter 09**: User-oriented, introducing firmware features and selection advice
- **This chapter**: Developer-oriented, deep source-level analysis of 4 mainstream community firmware architectures, implementation mechanisms, and learning paths

If you need to **port code**, **understand底层机制**, or **maintain custom firmware**, this chapter is required reading.

---

## Local Corpus Location

This chapter is based on locally archived firmware source code analysis:

| Firmware | Local Directory | Branch | Status |
|----------|-----------------|--------|--------|
| **Momentum** | `vendor_firmware/momentum` | `dev` | Active, recommended main baseline |
| **Unleashed** | `vendor_firmware/unleashed` | `dev` | Active, protocol enhancement type |
| **Xtreme** | `vendor_firmware/xtreme` | `dev` | Archived, historical reference |
| **RogueMaster** | `vendor_firmware/roguemaster` | `420` | Active, mega aggregation repo |

---

## One-Sentence Conclusions

| Firmware | Core Positioning | Best for Learning |
|----------|------------------|-------------------|
| **Momentum** | Making "community firmware" into a mature distribution | Systematic customization, theme assets, boot migration |
| **Unleashed** | Protocol capability enhancement priority | How to enhance protocol stack on stable baseline |
| **Xtreme** | Ancestor-type deep customization firmware | Large-scale UX transformation historical evolution |
| **RogueMaster** | Mega external app aggregation | Anti-pattern of large repo maintenance |

**Learning Priority**: Momentum → Unleashed → Xtreme → RogueMaster

---

## Essential Differences of the Four Firmware

### 1. Momentum: Systematic Distribution

**Not** "adding a few more features", but **systematic transformation**:

- **Boot Migration**: Automatic compatibility with old configs (Xtreme → Momentum)
- **Asset Pack System**: External packaging system for animations/icons/fonts
- **UI Infrastructure**: Deep hooks into canvas/gui/menu/loader
- **Unified Settings Layer**: `lib/momentum` + `momentum_app`

**Key Files**:
```
furi/flipper.c                    # Boot migration logic
lib/momentum/settings.c           # Unified configuration system
lib/momentum/asset_packs.c        # Asset pack core
applications/main/momentum_app/   # Settings control center
```

**Core Design Philosophy**: Converge deep customization into independent namespace rather than scattering everywhere.

---

### 2. Unleashed: Protocol Capability Enhancement

**Focus is not fancy interfaces, but protocol stack**:

- **Sub-GHz Extension**: More frequencies, more protocols
- **External CC1101**: Complete internal/external dispatcher
- **Name Modification Service**: System-level `namechanger`
- **Documentation and toolchain stability**

**Key Files**:
```
applications/services/namechanger/     # Device name modification service
lib/subghz/devices/devices.c           # Internal/external dispatcher
applications/main/subghz/              # Sub-GHz main application
```

**Core Design Philosophy**: Stay close to official, enhance on protocol and hardware support.

---

### 3. Xtreme: Ancestor-Type Deep Customization Firmware

Historically significant firmware, **upstream archived**:

- `Xtreme Settings` control plane
- Asset pack hot-swap mechanism
- BadKB feature origin
- Menu/status bar/lock screen/dark mode transformation

**Learning Value**: See evolution path of UI/asset system from radical transformation to mature integration.

**Note**: Suitable for learning ideas, **not suitable** as long-term maintenance baseline.

---

### 4. RogueMaster: Mega Aggregation Repository

**Not deep customization, but massive aggregation**:

- `applications/external` has **611** directories with `application.fam`
- `CFW Settings` + main menu/game menu dual system
- Multiple implementation versions for same feature

**Risks**:
- Configuration filename divergence (`setting_user` vs `setting_user.txt`)
- High maintenance cost of external app pool
- Difficult source tracking

**Learning Value**: Understanding "why mega-integration brings exponential maintenance costs".

---

## Wireless Implementation Difference Matrix

### BLE Main Chain (Shared by Four Firmware)

```
bt_service
→ furi_hal_bt_start_app(...)
→ serial_profile / serial_service
→ bt_service feeds BLE serial bytes to rpc_session_feed(...)
```

**Key Entry Points**:
| Firmware | Startup Location | RPC Feed Point |
|----------|------------------|----------------|
| Momentum | `furi_hal_bt.c:165` | `bt.c:200` |
| Unleashed | `furi_hal_bt.c:165` | `bt.c:202` |
| Xtreme | `furi_hal_bt.c:166` | `bt.c:189` |
| RogueMaster | `furi_hal_bt.c:165` | `bt.c:186` |

### BLE HAL Generation Differences

**New Signature** (Momentum / Unleashed):
```c
FuriHalBleProfileBase* furi_hal_bt_start_app(
    const FuriHalBleProfileTemplate* profile_template,
    FuriHalBleProfileParams params,
    const GapRootSecurityKeys* root_keys,  // ← New parameter
    GapEventCallback event_cb,
    void* context)
```

**Old Signature** (Xtreme / RogueMaster):
```c
FuriHalBleProfileBase* furi_hal_bt_start_app(
    const FuriHalBleProfileTemplate* profile_template,
    FuriHalBleProfileParams params,
    GapEventCallback event_cb,
    void* context)
```

**Conclusion**: Momentum/Unleashed are closer to newer BLE security context interface.

### Find My Integration Differences

| Firmware | Mount Location | Boot Injection | Risk Level |
|----------|----------------|----------------|------------|
| Momentum | `applications/system/findmy` | Built-in system | Low |
| Unleashed | `applications/system/find_my_flipper` | Built-in system | Low |
| Xtreme | `applications/system/find_my_flipper` | Built-in system | Low |
| RogueMaster | `applications/external/find_my_flipper` | Externalized | High |

**Key Difference**: RogueMaster puts Find My in external, affecting boot injection stability.

### Sub-GHz Differences

| Dimension | Momentum | Unleashed | Xtreme | RogueMaster |
|-----------|----------|-----------|--------|-------------|
| `setting_user` path | `setting_user` | `setting_user` | `setting_user` | `setting_user.txt` (diverged) |
| `extend_range` control plane | `momentum_app` integrated | No unified control plane seen | `xtreme_app` integrated | `cfw_app` + external |
| async TX skeleton | Same source | Same source | Same source | Same source |

**Key Conclusion**:
- The actual HAL/DMA/TIM mechanism that "spits pulses" **has not diverged**
- Differences mainly in **who triggers it, who writes config, who exposes UI**

---

## Most Worthwhile Source Files to Deep Dive

### Momentum (Highest Priority)

| File | Learning Value |
|------|----------------|
| `furi/flipper.c` | Boot migration logic, compatible with old configs |
| `lib/momentum/settings.c` | Unified configuration system implementation |
| `lib/momentum/asset_packs.c` | Asset pack hot-swap mechanism |
| `lib/momentum/namespoof.c` | Device identity spoofing |
| `applications/main/momentum_app/` | Distribution control center |
| `applications/services/gui/canvas.c` | UI infrastructure transformation |
| `applications/services/loader/loader.c` | App lifecycle management |

### Unleashed (Protocol Reference)

| File | Learning Value |
|------|----------------|
| `applications/services/namechanger/` | System-level service implementation |
| `lib/subghz/devices/devices.c` | Internal/external dispatcher |
| `applications/main/subghz/helpers/subghz_txrx.c` | Sub-GHz transmission main chain |

### Wireless Core (Same Source for Four Firmware)

| File | Learning Value |
|------|----------------|
| `targets/f7/ble_glue/extra_beacon.c` | BLE extra beacon mechanism |
| `targets/f7/furi_hal/furi_hal_subghz.c` | Sub-GHz HAL implementation |
| `lib/subghz/devices/cc1101_int/cc1101_int_interconnect.c` | Built-in CC1101 driver |
| `applications/services/bt/bt_service/bt.c` | BLE service main chain |

---

## Source Code Learning Paths

### Path 1: Full Overview (Recommended)

1. Read "One-Sentence Conclusions" and "Essential Differences" in this chapter
2. Comparative reading of Momentum and Unleashed key files
3. Review "Wireless Implementation Difference Matrix" to understand divergence points
4. Finally examine RogueMaster to understand maintenance risks

### Path 2: Wireless Main Chain (BLE/Sub-GHz Focus)

1. Understand BLE main chain shared by four firmware
2. Compare `furi_hal_bt_start_app()` generation differences
3. Deep dive into `extra_beacon.c` implementation
4. Learn Sub-GHz async TX mechanism
5. Review different mount methods for Find My

### Path 3: Porting and Customization (Practice-Oriented)

1. Use Momentum as main sample
2. Use Unleashed as stable control group
3. Check Xtreme when historical context needed
4. Browse RogueMaster's external pool for feature inspiration

---

## Maintenance Risk Assessment

| Firmware | Risk Points | Recommendation |
|----------|-------------|----------------|
| **Momentum** | Large UI customization surface (canvas/gui/menu/loader), official updates may break custom hooks | Monitor official GUI layer updates |
| **Unleashed** | Lower risk, but protocol enhancements may need adjustment with official updates | Keep synchronized with official baseline |
| **Xtreme** | Archived, no continuous maintenance | Learn ideas only, don't use as baseline |
| **RogueMaster** | Mega external pool (611+), configuration filename divergence, difficult source tracking | Use as resource library, not as sole baseline |

---

## Key Judgment Summary

1. **Momentum best for wireless main baseline** — systematic, clean interfaces, less external noise
2. **Unleashed best for supplementing system services** — restrained, stable, strong protocol capabilities
3. **Xtreme best for supplementing control plane** — historical evolution sample
4. **RogueMaster better as feature inspiration pool** — more code doesn't mean suitable as mainline

---

## Continue Reading

- [Previous: 09. Firmware Reference 2025-2026](09-Firmware-Reference-2025.md) — Feature-level firmware comparison
- [English Master Knowledge Base](../FlipperZero-Master-EN.md) — Return to platform overview
- [Fun Apps Collection](../Apps/Fun-Apps-Collection.md) — Community app practice

[Return to English Guide](README.md) | [Previous: 09. Firmware Reference](09-Firmware-Reference-2025.md) | [Return to English Entry](../README.md)
