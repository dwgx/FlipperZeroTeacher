# Topics — Deep Dives

The main guide walks Flipper Zero's device, protocols, app dev, and toolchain. This folder collects **deep-dive topics** — each one "one thing, told thoroughly" — out of main-line sequence.

## Current topics

| Topic | Summary |
|---|---|
| [BLE Implementation — X-BLE Spam / X-FindMy](./BLE-Implementation.md) | 39 device types reproduced via the single public `furi_hal_bt_extra_beacon_*` API. Intended as OSS-ready reference. |
| [IR Database Guide](./IR-Database-Guide.md) | Lucaslhm vs heytem comparison · Pronto/LIRC conversion · bulk import workflow. |

## Planned

- Sub-GHz rolling-code analysis notes
- NFC MFC dictionary builder guide (mf_classic_dict_user.nfc)
- Sleep Saver `.ssbg` binary format spec (128x64 custom wallpaper)
- BadUSB / Rubber Ducky cross-reference

Criteria for a new topic:
- Depth the main guide can't carry
- Verified on real hardware
- Reproducible procedure documented
