# Flipper Zero IR Database Guide

> Compared: Lucaslhm/Flipper-IRDB · heytem/Flipper-Zero-IR-DataBase · external IR resources
> Last updated: 2026-04-05
> Goal: One page that answers *where to get `.ir` files, how to organize them, and how to push them to Flipper*.

---

## 1. `.ir` file format primer

A Flipper `.ir` file is plain text in the `.flipper` format:

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

### 1.1 Two entry types

| type | Use | Produced when |
|---|---|---|
| `parsed` | Known protocols (NEC / NECext / RC5 / Samsung32 / Sony / Kaseikyo) | Flipper could decode the protocol at learn time |
| `raw` | Unknown / learn-failure fallback | Raw pulse train recorded verbatim |

**Practical lessons:**
- `parsed` is drastically smaller (~30 bytes vs raw's several KB)
- `parsed` is more robust across receiver instances because Flipper regenerates canonical waveforms
- `raw` inherits any noise from the original learn — may not work on other devices

### 1.2 Naming convention (community-de-facto)

```
ACs/                        # category
├── Daikin/                 # brand
│   ├── Daikin_ARC433.ir    # <Brand>_<Model>.ir
│   └── Daikin_ARC470.ir
TVs/
├── Samsung/
│   ├── Samsung_UN55.ir
│   └── Samsung_QLED_Q70.ir
```

Flipper categories: `TVs/`, `ACs/`, `Audio_Receivers/`, `Projectors/`, `DVD_Players/`, `Cable_Boxes/`, `Streaming_Devices/`, `Fans/`, `Cameras/`, `Heaters/`, `Car_Multimedia/`, `Fireplaces/`, `Misc/`

---

## 2. Head-to-head: the two main repos

### 2.1 Lucaslhm/Flipper-IRDB

- **URL**: https://github.com/Lucaslhm/Flipper-IRDB
- **Stars**: 3k+ (as of 2026-04, largest)
- **Files**: 3500+ `.ir` files
- **Layout**: 3-level `Category/Brand/Model.ir`
- **Update cadence**: weekly PR merges
- **Naming**: enforced `Brand_Model.ir`
- **QA**: CI format validation + duplicate detection

**Strengths:**
- Largest coverage, reaches obscure brands
- Well-maintained PR templates
- Prefers `parsed` over `raw` where possible
- Linked from UberGuidoZ and awesome-flipperzero

**Weaknesses:**
- Flat enough that picking one of the 4 Samsung entries is confusing
- Button-name drift (`Power` / `Pwr` / `POWER`) remains
- English-only; Asian brands (Haier, Hisense, Midea) harder to discover

### 2.2 heytem/Flipper-Zero-IR-DataBase

- **URL**: https://github.com/heytem/Flipper-Zero-IR-DataBase
- **Stars**: ~200
- **Files**: 1500+
- **Layout**: 2-level (no Brand directory)
- **Update cadence**: few per month
- **Naming**: brand baked into filename `SamsungUN55.ir`

**Strengths:**
- Shallow layout drops straight onto Flipper SD
- 200+ AC files, strong regional focus (MENA brands)
- Coverage for Arab / African brands that Lucaslhm misses

**Weaknesses:**
- Half the size of Lucaslhm
- Looser format validation
- No brand directories → harder to browse sibling models

### 2.3 Side-by-side

| Aspect | Lucaslhm | heytem |
|---|---|---|
| File count | ~3500 | ~1500 |
| Hierarchy | 3-level | 2-level |
| Regional coverage | US/EU/JP | MENA / Africa |
| Updates | ◎ weekly | △ monthly |
| Validation | CI | none |
| Teachability | ◎ clean | △ name drift |
| SD-drop ease | needs flatten | drop-in ready |

### 2.4 Selection strategy

- **Start with Lucaslhm** — best coverage, best QA
- **Fall back to heytem** for regional brands
- **Last resort**: learn on the device itself (`Learn New Remote`)

---

## 3. Other external IR resources

### 3.1 Native `.ir` resources

| Source | URL | Content | Portability |
|---|---|---|---|
| UberGuidoZ/Flipper | https://github.com/UberGuidoZ/Flipper | IR / SubGHz / NFC / BadUSB bundle | drop-in |
| UberGuidoZ/Infrared | https://github.com/UberGuidoZ/Flipper/tree/main/Infrared | curated | drop-in |
| djsime1/awesome-flipperzero | https://github.com/djsime1/awesome-flipperzero | link index | discovery layer |
| flipper-irdb.org | https://flipper-irdb.org | web UI search | download via webUI |

### 3.2 Converting from Pronto / LIRC

| Resource | Format | Converter |
|---|---|---|
| RemoteCentral.com | Pronto Hex | `pronto2flipper` scripts |
| LIRC Remotes DB | LIRC config | `lirc2flipper` |
| Global Caché Control Tower | GC TCP strings | roll your own |

### 3.3 Brand-specific sources

| Brand | Source |
|---|---|
| Panasonic | https://github.com/probonopd/irdb (LIRC) |
| Samsung Smart TV | Wi-Fi only, not IR |
| LG | aiopylgtv (network control) |
| Sony | public IRP protocol spec |

### 3.4 Academic / spec sources

- **IRP Protocol Library**: https://github.com/bengtmartensson/IrpTransmogrifier — 500+ protocol definitions
- **DecodeIR / AnalyzeIR**: protocol auto-detection tools

---

## 4. Getting `.ir` onto Flipper

### 4.1 Bulk import (recommended flow)

```bash
# 1. Clone Lucaslhm
git clone --depth 1 https://github.com/Lucaslhm/Flipper-IRDB.git /tmp/irdb

# 2. Push via this workspace's sync script
py scripts/dataset_sync.py --protocol ir --source /tmp/irdb --report-only
py scripts/dataset_sync.py --protocol ir --source /tmp/irdb

# 3. For huge packs, drag-drop is faster (see feedback memory in CLAUDE.md)
#    Eject SD → PC reader → copy → reinsert
```

### 4.2 Device paths

```
/ext/infrared/                  # Flipper built-in IR (read-only feel)
/ext/infrared/assets_user/      # user-added .ir files
/ext/infrared/assets_user/TVs/Samsung/Samsung_UN55.ir
```

### 4.3 Keeping it searchable

The on-device IR menu respects folder hierarchy; use `_pinned/` prefix to keep favorites at top:

```
/ext/infrared/assets_user/
├── _pinned/
│   ├── home_AC.ir
│   └── home_TV.ir
├── ACs/
├── TVs/
```

---

## 5. How this site treats IR (policy)

This knowledge base is not an IR-code mirror. Instead:

- **Guide**: where to source, how to organize (this doc)
- **Scripts**: `dataset_sync.py` for bulk transfer
- **Links**: outbound routing to canonical repos
- **QA notes**: runtime verification logs, broken-signal blacklists

---

## 6. Summary (3 lines)

- **Use Lucaslhm/Flipper-IRDB as your primary**, it's maintained and CI-validated.
- heytem is the regional-brand complement.
- For large transfers, combine `dataset_sync.py` with drag-drop; serial is too slow.
