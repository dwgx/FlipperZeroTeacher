# FlipperZero Master Knowledge Base (English)

This is the main English guide for humans first, while still being structured enough for AI ingestion later.

## 1. What Flipper Zero really is

The cleanest description is not “magic hacker gadget.” It is better understood as:

- a portable multi-interface experimentation platform
- a physical-world protocol learning device
- a programmable handheld terminal
- a front-end device that works with external modules and desktop tools

## 2. Best overall learning order

1. Understand the desktop, menu, Archive, and status bar
2. Understand hardware boundaries and GPIO reality
3. Learn `qFlipper`, Mobile App, CLI, and Apps workflow
4. Learn the capability domains through `NFC / Sub-GHz / iButton / U2F`
5. Move into `FAP / FAM / App Examples / Publishing`
6. Add `FBT / uFBT / VS Code / Dev Board`
7. Add `JavaScript / File Formats / System Programming`
8. Only then go deeper into source, community essentials, and advanced hardware

## 3. What to read first in this final folder

Read these first:

- `CN/Official-Docs-CN-Full.md`
- `EN/Official-Docs-EN-Full.md`
- `EN/FlipperZero-AI-Pack-EN.md`
- `Official-Docs-Coverage.md`
- `Original-Notes/FlipperZero-Original-Desktop-Notes-All-In-One.md`

## 4. Official baseline

Most important official sources:

- `https://docs.flipper.net/zero/development`
- `https://developer.flipper.net/flipperzero/doxygen/`
- `https://github.com/flipperdevices/flipperzero-firmware`
- `https://github.com/flipperdevices/flipperzero-ufbt`
- `https://github.com/flipperdevices/flipper-application-catalog`

Default development route:

- `FAP` first
- then `uFBT` or `FBT`
- then `JS`
- then `File Formats`
- then `System Programming`
- firmware-wide changes only when clearly necessary

## 5. Core protocol domains

Main domains:

- Sub-GHz
- NFC
- RFID
- iButton
- Infrared
- BadUSB
- BLE
- GPIO
- U2F

For a serious knowledge base, organize around protocol and system layers, not around random flashy tricks.

## 6. Do not ignore the official ecosystem layer

Serious long-term use depends on more than the device itself:

- `qFlipper`
- `Flipper Mobile App`
- `Apps`
- `Flipper Lab`
- `Archive`
- `CLI`
- `File Formats`

These layers decide whether you only know how to “play with it” or whether you can manage, debug, transfer, publish, and troubleshoot.

## 7. Keep only these community essentials

### 7.1 Ecosystem map

- `UberGuidoZ/Flipper`
  URL: `https://github.com/UberGuidoZ/Flipper`
  Why keep it: one of the best curated ecosystem maps for resources, hardware, troubleshooting, tools, and references

- `awesome-flipperzero`
  URL: `https://github.com/djsime1/awesome-flipperzero`
  Why keep it: best discovery-layer repo for finding high-signal ecosystem projects

### 7.2 Developer learning

- `jamisonderek/flipper-zero-tutorials`
  URL: `https://github.com/jamisonderek/flipper-zero-tutorials`
  Wiki: `https://github.com/jamisonderek/flipper-zero-tutorials/wiki`
  Why keep it: one of the best bridges between official docs and real development, especially for debugging, UI, GPIO, and JavaScript

- `DroomOne/Flipper-Plugin-Tutorial`
  URL: `https://github.com/DroomOne/Flipper-Plugin-Tutorial`
  Why keep it: useful for the smallest working plugin/app mental model, but always cross-check with current official docs

### 7.3 Real projects and workflow tools

- `flipperzero-esp-flasher`
  URL: `https://github.com/0xchocolate/flipperzero-esp-flasher`
  Why keep it: strong example of Flipper as a real field tool

- `FlipperHTTP`
  URL: `https://github.com/jblanked/FlipperHTTP`
  Why keep it: useful for learning Flipper-plus-coprocessor architecture patterns

- `flipwire`
  URL: `https://github.com/liamhays/flipwire`
  Why keep it: useful for host-side automation and Bluetooth control workflow

- `flipperzero-gps`
  URL: `https://github.com/ezod/flipperzero-gps`
  Why keep it: good UART-peripheral example with solid compatibility discipline

- `flipperzero-qrcode`
  URL: `https://github.com/bmatcuk/flipperzero-qrcode`
  Why keep it: small and clean example of what a tidy external app repo looks like

### 7.4 Data and asset libraries

- `Flipper-IRDB`
  URL: `https://github.com/UberGuidoZ/Flipper-IRDB`
  Why keep it: one of the de facto standard IR libraries in the ecosystem

## 8. Bad starting paths

These are not always wrong, but they are poor default starting points:

- jumping straight to third-party firmware
- modifying full firmware before understanding app architecture
- chasing community tricks before reading official docs
- collecting random repos without building a clean taxonomy

## 9. One rule

- `Official first, community second; external apps before firmware; protocol understanding before flashy tricks.`
