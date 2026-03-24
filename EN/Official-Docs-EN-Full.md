# Flipper Zero Official Docs Deep Guide (English)

Updated: 2026-03-24

This file is not a mirror of the official site. It is a structured, human-readable and AI-friendly guide to the official Flipper Zero documentation stack.

Best for:

- beginners who need a clean starting order
- users who already know the device and want to start building apps
- developers moving toward firmware, debugging, and hardware work
- anyone building a long-term Flipper knowledge base

## 1. How to use this file

Recommended reading path:

1. Start with `Section 3` for the learning order
2. Read `Section 4` for device, ecosystem, and hardware pages
3. Read `Section 5` for the developer docs
4. Use `Section 6` and `Section 7` for hidden high-value pages and official repos

If you want to feed this into AI:

- treat each `page` as a knowledge node
- treat `why it matters` as the short summary
- treat `high-value points` as tags and retrieval hints
- treat `best knowledge-base location` as the category field

## 2. The official documentation has three layers

### 2.1 User and device documentation

Main entry:

- `https://docs.flipper.net/`

This layer explains:

- how to use the device
- how the menu and data flow work
- how desktop and mobile tools fit together
- what the hardware boundaries are
- what the official protocol and module domains are

### 2.2 Developer documentation

Main entry:

- `https://developer.flipper.net/flipperzero/doxygen/`

This layer explains:

- how apps are built
- how `application.fam` works
- how `.fap` packages are delivered
- how `FBT`, `uFBT`, VS Code, and Dev Boards fit together
- how the JavaScript path works
- how file formats, system programming, and hardware abstraction are organized

### 2.3 Official GitHub repositories

High-value official repos:

- `https://github.com/flipperdevices/flipperzero-firmware`
- `https://github.com/flipperdevices/flipperzero-ufbt`
- `https://github.com/flipperdevices/flipper-application-catalog`
- `https://github.com/flipperdevices/flipperzero-good-faps`
- `https://github.com/flipperdevices/qFlipper`

These repos are not optional add-ons:

- the docs provide the structure
- the repos provide the real implementation and workflow

## 3. Official reading order from zero to real development

### Stage 0: Understand the device first

Read:

1. `https://docs.flipper.net/basics/desktop`
2. `https://docs.flipper.net/zero/development/hardware/tech-specs`
3. `https://docs.flipper.net/gpio-and-modules`

Goal:

- understand the menu and data entry points
- understand the hardware limits before reading community claims
- understand GPIO, power, modules, and serial reality

### Stage 1: Understand the official ecosystem layer

Read:

1. `https://docs.flipper.net/qflipper`
2. `https://docs.flipper.net/mobile-app`
3. `https://docs.flipper.net/apps`
4. `https://docs.flipper.net/zero/development/cli`

Goal:

- update, back up, restore, transfer files, and inspect logs
- understand what desktop and mobile tools each do
- understand how the Apps ecosystem installs, updates, and publishes software

### Stage 2: Understand the capability domains

Read:

1. `https://docs.flipper.net/nfc`
2. `https://docs.flipper.net/sub-ghz`
3. `https://docs.flipper.net/ibutton`
4. `https://docs.flipper.net/zero/u2f`

Goal:

- understand how the official docs separate the device into protocol domains
- understand what is native capability versus what needs apps, scripts, or modules
- use protocol domains as a primary knowledge-base taxonomy

### Stage 3: Start the official development path

Read:

1. `https://developer.flipper.net/flipperzero/doxygen/`
2. `https://developer.flipper.net/flipperzero/doxygen/applications.html`
3. `https://developer.flipper.net/flipperzero/doxygen/app_manifests.html`
4. `https://developer.flipper.net/flipperzero/doxygen/apps_on_sd_card.html`
5. `https://developer.flipper.net/flipperzero/doxygen/app_examples.html`

Goal:

- understand that most development starts with apps, not firmware forks
- understand that `FAM` is the declaration layer and `FAP` is the delivery layer
- understand that official examples are patterns, not toy snippets

### Stage 4: Learn build and debugging workflow

Read:

1. `https://developer.flipper.net/flipperzero/doxygen/dev_tools.html`
2. `https://developer.flipper.net/flipperzero/doxygen/fbt.html`
3. `https://developer.flipper.net/flipperzero/doxygen/vscode.html`
4. `https://developer.flipper.net/flipperzero/doxygen/dev_board.html`
5. `https://developer.flipper.net/flipperzero/doxygen/ota_updates.html`

Goal:

- use the official build chain
- use the VS Code workspace flow
- understand Dev Board and OTA mechanisms

### Stage 5: Add scripting, system programming, and file formats

Read:

1. `https://developer.flipper.net/flipperzero/doxygen/js.html`
2. `https://developer.flipper.net/flipperzero/doxygen/system.html`
3. `https://developer.flipper.net/flipperzero/doxygen/file_formats.html`
4. `https://developer.flipper.net/flipperzero/doxygen/files.html`
5. `https://developer.flipper.net/flipperzero/doxygen/annotated.html`

Goal:

- learn the JS rapid-development path
- understand system-level and hardware-abstraction pages
- treat file formats as a first-class part of the platform

## 4. Device, ecosystem, and hardware pages

### 4.1 Desktop

- Page: `Desktop`
- URL: `https://docs.flipper.net/basics/desktop`
- Purpose: official entry for desktop, status bar, main menu, Archive, Device Info, Quick Access Apps, and Lock Menu
- Why it matters: this is the interaction map of the entire device
- High-value points:
- the status bar exposes BLE, SD card, `qFlipper` or `Flipper Lab` connection, external module connection, and background app state
- `Archive` is a data-asset entry point, not just a folder
- the page routes directly into `Sub-GHz`, `NFC`, `GPIO & modules`, `iButton`, `U2F`, and `Apps`
- Best knowledge-base location: `UI / menu map / data entry points`

### 4.2 Tech specs of Flipper Zero

- Page: `Tech specs of Flipper Zero`
- URL: `https://docs.flipper.net/zero/development/hardware/tech-specs`
- Purpose: official hardware specification baseline
- Why it matters: this is the source of truth for what the device can actually do
- High-value points:
- MCU: `STM32WB55RG`
- application core: `ARM Cortex-M4 64 MHz`
- radio core: `ARM Cortex-M0+ 32 MHz`
- Sub-GHz chip: `CC1101`
- NFC chip: `ST25R3916`
- GPIO: `13` user-accessible I/O pins, `3.3V CMOS`, `5V tolerant` inputs
- official BLE version is `Bluetooth LE 5.4`
- microSD up to `256 GB`, with `2-32 GB` recommended
- Best knowledge-base location: `hardware specs / capability boundaries / fact baseline`

### 4.3 GPIO & Modules

- Page: `GPIO & Modules`
- URL: `https://docs.flipper.net/gpio-and-modules`
- Purpose: GPIO pins, power pins, USB-UART bridge behavior, and module connection guidance
- Why it matters: this is the bridge from “using the device” to “building with the device”
- High-value points:
- the top header has `18` pins with both power and I/O roles
- `+3.3V` is available by default but can briefly power down during some flows
- `+5V` is not enabled by default and must be turned on in the `GPIO` app
- Flipper can act as a `USB to UART / SPI / I2C` bridge
- power and mechanical insertion details matter in real troubleshooting
- Best knowledge-base location: `GPIO / power / module connection / hardware experimentation`

### 4.4 qFlipper

- Page: `qFlipper`
- URL: `https://docs.flipper.net/qflipper`
- Purpose: official desktop management tool
- Why it matters: long-term use and serious development both depend on it
- High-value points:
- firmware update, database update, and file management live here
- `Advanced controls` handles `backup / restore / reset`
- it can remotely control the device, take screenshots, and show logs
- official update channels include `dev / rc / release`
- Linux-specific AppImage permission and `udev rules` details are real setup knowledge
- Best knowledge-base location: `desktop operations / updates / backup and restore / file management`

### 4.5 Flipper Mobile App

- Page: `Flipper Mobile App`
- URL: `https://docs.flipper.net/mobile-app`
- Purpose: official mobile management and app-installation workflow
- Why it matters: it is a first-class part of the official ecosystem
- High-value points:
- firmware updates over BLE
- sync, archive management, and backups
- `Apps` tab for browsing and installing apps
- `Tools` page links into official team-maintained utilities and libraries
- the docs include concrete sync troubleshooting details
- Best knowledge-base location: `mobile operations / BLE update / ecosystem entry`

### 4.6 Apps

- Page: `Apps`
- URL: `https://docs.flipper.net/apps`
- Purpose: official Apps ecosystem landing page
- Why it matters: this is both the user install entry and the developer distribution entry
- High-value points:
- official install paths are `Flipper Mobile App` and `Flipper Lab`
- app detail pages expose description, size, version, changelog, manifest, and repository
- app submission routes back to the official catalog repo
- older references often say `apps-catalog`; the current official user-facing entry is `apps`
- Best knowledge-base location: `Apps ecosystem / distribution / install flow`

### 4.7 Command-line interface

- Page: `Command-line interface`
- URL: `https://docs.flipper.net/zero/development/cli`
- Purpose: official entry for CLI, logs, and subsystem shells
- Why it matters: this is a core debugging and automation page
- High-value points:
- the docs list browser, Web Serial, and local serial terminal access methods
- supported log levels include `error / warn / info / debug / trace`
- `nfc`, `gpio`, `storage`, `subghz`, `input`, and `ir` all have relevant commands or shells
- this is the page that moves you from simple usage to real debug visibility
- Best knowledge-base location: `CLI / automation / logs / debugging`

### 4.8 NFC

- Page: `NFC`
- URL: `https://docs.flipper.net/nfc`
- Purpose: official NFC domain overview
- Why it matters: this is one of the most important native capability pages
- High-value points:
- the page is not just about reading and saving cards; it also includes `Analyze reader`
- it routes to advanced official subpages like `mfkey32`, password unlocking, magic cards, and manual card creation
- these pages belong in a serious knowledge base, but should be framed with lawful and authorized-use boundaries
- Best knowledge-base location: `NFC / domain overview / advanced subpage map`

### 4.9 Sub-GHz

- Page: `Sub-GHz`
- URL: `https://docs.flipper.net/sub-ghz`
- Purpose: sub-1 GHz wireless capability overview
- Why it matters: it defines the official starting point for signal reading, RAW reading, frequencies, and region constraints
- High-value points:
- the docs explicitly distinguish `Read` from `Read RAW`
- `Region information` is a core concept
- official support includes external `CC1101`-based modules
- the page routes into frequency, vendors, and new remote creation subpages
- Best knowledge-base location: `Sub-GHz / wireless remotes / frequency boundaries`

### 4.10 iButton

- Page: `iButton`
- URL: `https://docs.flipper.net/ibutton`
- Purpose: 1-Wire and iButton capability overview
- Why it matters: it is a native feature area that is often under-documented outside the official docs
- High-value points:
- official support includes `read / save / edit / write / emulate`
- supported families include `Dallas`, `Cyfral`, and `Metakom`
- the docs explain the physical role of the pogo pins
- the page also explains the difference between the flat and raised contact parts
- Best knowledge-base location: `iButton / 1-Wire / contact key systems`

### 4.11 U2F

- Page: `U2F`
- URL: `https://docs.flipper.net/zero/u2f`
- Purpose: using Flipper as a USB U2F security key
- Why it matters: this is an underrated native security feature
- High-value points:
- the official docs explicitly require closing `qFlipper` during registration and login
- the usage flow is simple, but the operational detail matters
- this proves Flipper is not only a protocol-learning device but also part of an identity-security workflow
- Best knowledge-base location: `U2F / identity security / native features`

### 4.12 Schematics of Flipper Zero

- Page: `Schematics of Flipper Zero`
- URL: `https://docs.flipper.net/development/hardware/schematic`
- Purpose: official schematics for the main board and supporting PCBs
- Why it matters: this is a high-value reference for hardware development and low-level debugging
- High-value points:
- useful for tracing power, MCU, LCD, CC1101, and NFC/RFID relationships
- much closer to the real electrical structure than the spec sheet
- the docs explicitly position it for module development and low-level debugging
- Best knowledge-base location: `schematics / low-level debugging / reference design`

### 4.13 Blueprints of Flipper Zero

- Page: `Blueprints of Flipper Zero`
- URL: `https://docs.flipper.net/zero/development/hardware/flipper-blueprints`
- Purpose: external dimensions and 3D-model entry for the main device
- Why it matters: essential for mounts, cases, fixtures, and physical accessories
- High-value points:
- this is mechanical knowledge, not electrical knowledge
- it should be read together with `modules-blueprints`
- this kind of page is easy to ignore until a real hardware project depends on it
- Best knowledge-base location: `mechanical design / device dimensions / accessory development`

### 4.14 External modules blueprints

- Page: `External modules blueprints`
- URL: `https://docs.flipper.net/development/hardware/modules-blueprints`
- Purpose: geometry, sizing, and 3D guidance for external modules
- Why it matters: physical compatibility depends on it
- High-value points:
- distinguishes `regular` and `small` module formats
- useful for PCB outlines, enclosures, and 3D-printed accessories
- Best knowledge-base location: `module form-factor standards / mechanical compatibility`

### 4.15 ST-Link V3 Developer Board

- Page: `ST-Link V3 Developer Board`
- URL: `https://docs.flipper.net/development/hardware/devboard-stlinkv3`
- Purpose: official advanced debug-board reference
- Why it matters: this is an important hardware entry for flashing, in-circuit debug, and UART-to-USB
- High-value points:
- based on `STLINK-V3MODS`
- links to `schematic / BOM / Altium project`
- useful when moving into real bring-up and hardware-level debugging
- Best knowledge-base location: `debug hardware / firmware flashing / debug boards`

### 4.16 Wi-Fi Developer Board schematics

- Page: `Wi-Fi Developer Board schematics`
- URL: `https://docs.flipper.net/zero/development/hardware/devboard-schematics`
- Purpose: schematics and assembly views for the official Wi-Fi Dev Board
- Why it matters: useful when understanding the official board implementation
- High-value points:
- explicitly identifies `ESP32-S2-WROVER-N4R2`
- useful for checking power, connector, and board-level structure
- Best knowledge-base location: `dev-board schematics / ESP32-S2 / external board reference`

## 5. Developer docs deep guide

### 5.1 Flipper Developer Docs index

- Page: `Flipper Developer Docs`
- URL: `https://developer.flipper.net/flipperzero/doxygen/`
- Purpose: root index for official development documentation
- Why it matters: this is the root of the developer knowledge tree
- High-value points:
- the docs are explicitly split into `Developer Tools`, `System Programming`, `App Development`, `JavaScript`, `Expansion Modules`, and `File Formats`
- `Data Structures` and `Files` are generated indexes that matter for advanced work
- your knowledge base should use this structure as its top-level map
- Best knowledge-base location: `developer map / top-level taxonomy`

### 5.2 App Development

- Page: `App Development`
- URL: `https://developer.flipper.net/flipperzero/doxygen/applications.html`
- Purpose: official entry for app development
- Why it matters: most developers should start here rather than with firmware-wide changes
- High-value points:
- the page frames `FAP`, `FAM`, `App Examples`, and `Publishing` as the main path
- the real value is the official flow map it gives you
- Best knowledge-base location: `app development / main entry`

### 5.3 Flipper App Manifests

- Page: `FAM`
- URL: `https://developer.flipper.net/flipperzero/doxygen/app_manifests.html`
- Purpose: the `application.fam` declaration system
- Why it matters: if you do not understand FAM, you do not yet understand Flipper app architecture
- High-value points:
- core fields include `appid`, `apptype`, `entry_point`, `requires`, `conflicts`, `stack_size`, `targets`, and `resources`
- external apps add fields like `sources`, `fap_version`, `fap_icon`, `fap_category`, `fap_description`, `fap_author`, and `fap_weburl`
- advanced fields include `fap_private_libs` and `fap_extbuild`
- Best knowledge-base location: `app architecture / manifests / declaration layer`

### 5.4 Flipper App Package

- Page: `FAP`
- URL: `https://developer.flipper.net/flipperzero/doxygen/apps_on_sd_card.html`
- Purpose: `.fap` external app packages
- Why it matters: this is the delivery layer for real device-side app distribution
- High-value points:
- `.fap` is effectively an `.elf` with additional metadata and resources
- it can be loaded from the SD card
- compatibility is governed by API versioning, not just a raw firmware version string
- external apps normally live under `applications_user`
- Best knowledge-base location: `FAP / delivery / external apps`

### 5.5 App Examples

- Page: `App Examples`
- URL: `https://developer.flipper.net/flipperzero/doxygen/app_examples.html`
- Purpose: official example index
- Why it matters: this is the smallest practical pattern library in the official docs
- High-value points:
- covers numeric input, icons, assets folder, data folder, and 1-Wire examples
- should be treated as a pattern library, not just a tutorial page
- this page is ideal for splitting into small knowledge cards
- Best knowledge-base location: `examples / GUI / assets / data / hardware interfaces`

### 5.6 Key example pages

- `Number Input`
- URL: `https://developer.flipper.net/flipperzero/doxygen/example_number_input.html`
- Value: learn basic GUI input, limits, and user interaction patterns

- `Application icons / Apps data`
- URL: `https://developer.flipper.net/flipperzero/doxygen/example_apps_data.html`
- Value: understand icon and data-folder basics

- `Apps Assets folder Example`
- URL: `https://developer.flipper.net/flipperzero/doxygen/example_assets.html`
- Value: learn resource packaging and resource loading

- `1-Wire Thermometer`
- URL: `https://developer.flipper.net/flipperzero/doxygen/example_onewire.html`
- Value: learn how an app meets a hardware interface

### 5.7 Official example pattern cards (first batch)

#### 5.7.1 Number Input

- Best for learning:
- the smallest interactive input UI pattern
- how bounds, confirmation, and returning a final value fit into a GUI flow
- Best KB role: `minimal input-control pattern`

#### 5.7.2 Application icons / Apps data

- Best for learning:
- app icons and app data are not the same thing
- resources are more about build-time packaging, while app data is more about runtime directories and persistence
- Best KB role: minimal example for `resources vs data`

#### 5.7.3 Apps Assets folder Example

- Best for learning:
- how app-owned resources are organized
- how an assets folder becomes part of app structure
- Best KB role: `asset packaging and reference template`

#### 5.7.4 1-Wire Thermometer

- Best for learning:
- how an app actually connects to a hardware bus
- how peripheral access, reading logic, and app-layer presentation fit together
- Best KB role: `official minimal app + hardware-interface pattern`

#### 5.7.5 Why this example group matters

- these are not toy pages; they are the official minimal pattern library
- for AI knowledge bases, these examples should become individual cards instead of one shared link dump
- the right way to read them is to extract “what pattern does this example teach?”

### 5.8 Publishing to the Apps Catalog

- Page: `Publishing to the Apps Catalog`
- URL: `https://developer.flipper.net/flipperzero/doxygen/app_publishing.html`
- Purpose: the bridge from “I can write an app” to “I can distribute an app”
- Why it matters: distribution is part of the official workflow, not an afterthought
- High-value points:
- the official distribution path runs through Apps Catalog, mobile, and `Flipper Lab`
- the real submission structure lives in the official catalog repo
- Best knowledge-base location: `app publishing / catalog / distribution`

### 5.9 Developer Tools

- Page: `Developer Tools`
- URL: `https://developer.flipper.net/flipperzero/doxygen/dev_tools.html`
- Purpose: official toolchain overview
- Why it matters: reading `FBT` alone can hide the bigger debugging and OTA picture
- High-value points:
- ties together `FBT`, VS Code, Wi-Fi Dev Board, and OTA
- useful as the central map for build and debug tooling
- Best knowledge-base location: `toolchain / debugging / IDE / OTA`

### 5.10 Flipper Build Tool

- Page: `FBT`
- URL: `https://developer.flipper.net/flipperzero/doxygen/fbt.html`
- Purpose: official native build system
- Why it matters: firmware work, built-in apps, and deep debug workflows all depend on it
- High-value points:
- the entry point is `./fbt` from the repo root
- it wraps `scons`
- important environment variables include `FBT_NOENV`, `FBT_NO_SYNC`, `FBT_TOOLCHAIN_PATH`, and `FBT_VERBOSE`
- `build/latest` and `compile_commands.json` are important for IDE workflows
- Best knowledge-base location: `build system / FBT / IDE support`

### 5.11 Visual Studio Code workspace

- Page: `Visual Studio Code workspace for Flipper Zero`
- URL: `https://developer.flipper.net/flipperzero/doxygen/vscode.html`
- Purpose: official IDE workflow
- Why it matters: turns command-line build flow into a reproducible workspace
- High-value points:
- generated with `./fbt vscode_dist`
- the attach, debug, rebuild, and reflash order matters in practice
- Best knowledge-base location: `IDE / VS Code / debug workflow`

### 5.12 Wi-Fi Developer Board

- Page: `Wi-Fi Developer Board`
- URL: `https://developer.flipper.net/flipperzero/doxygen/dev_board.html`
- Purpose: official Wi-Fi Dev Board and debugging entry
- Why it matters: this is the center of the official hardware-debug path
- High-value points:
- built around `ESP32-S2`
- integrates `Black Magic Debug` and `CMSIS-DAP`
- routes into getting started, firmware update, USB connection, Wi-Fi connection, debugging, and log reading
- Best knowledge-base location: `dev boards / debugging / logs`

### 5.13 Key Dev Board subpages

- `Get started with the Devboard`
- URL: `https://developer.flipper.net/flipperzero/doxygen/dev_board_get_started.html`
- Value: official setup order that avoids common connection and mode mistakes

- `Firmware update on Developer Board`
- URL: `https://developer.flipper.net/flipperzero/doxygen/dev_board_fw_update.html`
- Value: old board firmware is a real failure source

- `USB connection to the Devboard`
- URL: `https://developer.flipper.net/flipperzero/doxygen/dev_board_usb_uart.html`
- Value: the most stable connection method

- `Wi-Fi connection to the Devboard`
- URL: `https://developer.flipper.net/flipperzero/doxygen/dev_board_wifi.html`
- Value: wireless debugging and deployment workflow

- `Debugging via the Devboard`
- URL: `https://developer.flipper.net/flipperzero/doxygen/dev_board_debugging_guide.html`
- Value: real breakpoint, stepping, and register-level debug entry

- `Devboard debug modes`
- URL: `https://developer.flipper.net/flipperzero/doxygen/dev_board_debug_modes.html`
- Value: the chosen mode affects how you connect and debug

- `Reading logs via the Devboard`
- URL: `https://developer.flipper.net/flipperzero/doxygen/dev_board_reading_logs.html`
- Value: some failures are easier to diagnose here than through standard CLI logging

### 5.14 OTA update process

- Page: `Flipper Zero OTA update process`
- URL: `https://developer.flipper.net/flipperzero/doxygen/ota_updates.html`
- Purpose: official OTA architecture
- Why it matters: this is the architecture page for update packages, resource packages, and recovery behavior
- High-value points:
- includes concepts like updater-in-RAM, `/int` backup, flashing, and internal-storage restore
- belongs in any serious section about update mechanisms and packaging
- Best knowledge-base location: `OTA / update architecture / recovery`

### 5.15 JavaScript

- Page: `JavaScript`
- URL: `https://developer.flipper.net/flipperzero/doxygen/js.html`
- Purpose: Flipper JS path overview
- Why it matters: this is the lowest-friction official development path
- High-value points:
- scripts can run directly without full-firmware builds
- the page routes into engine details, first app, SDK, modules, and module docs
- ideal for rapid prototypes and script tooling
- Best knowledge-base location: `JavaScript / rapid development`

### 5.16 About the JavaScript engine

- Page: `About the JavaScript engine`
- URL: `https://developer.flipper.net/flipperzero/doxygen/js_about_js_engine.html`
- Purpose: JS engine design and limits
- Why it matters: it sets the right expectations
- High-value points:
- based on `mJS`
- intentionally small for embedded use
- can access GUI, buttons, USB-HID, GPIO, UART, and more
- should not be mistaken for a full modern desktop JS runtime
- Best knowledge-base location: `JS engine / capability boundaries / runtime model`

### 5.17 JavaScript SDK and modules

- `Your first JavaScript app`
- URL: `https://developer.flipper.net/flipperzero/doxygen/js_your_first_js_app.html`
- Value: first official JS end-to-end path

- `Developing apps using JavaScript SDK`
- URL: `https://developer.flipper.net/flipperzero/doxygen/js_developing_apps_using_js_sdk.html`
- Value: official NPM and TypeScript path for more structured JS projects

- `Using JavaScript modules`
- URL: `https://developer.flipper.net/flipperzero/doxygen/js_using_js_modules.html`
- Value: understand `require()`, modularization, and memory-conscious loading

### 5.18 Key JavaScript modules

Important module pages:

- `https://developer.flipper.net/flipperzero/doxygen/js_badusb.html`
- `https://developer.flipper.net/flipperzero/doxygen/js_event_loop.html`
- `https://developer.flipper.net/flipperzero/doxygen/js_flipper.html`
- `https://developer.flipper.net/flipperzero/doxygen/js_gpio.html`
- `https://developer.flipper.net/flipperzero/doxygen/js_gui.html`
- `https://developer.flipper.net/flipperzero/doxygen/js_notification.html`
- `https://developer.flipper.net/flipperzero/doxygen/js_serial.html`
- `https://developer.flipper.net/flipperzero/doxygen/js_storage.html`

Knowledge-base value:

- `GPIO / Serial / Storage` are core for peripherals, files, and data flow
- `GUI / Notification / Event Loop` matter for interactive scripts
- the `Flipper` module matters for device-state awareness

### 5.19 System Programming

- Page: `System Programming`
- URL: `https://developer.flipper.net/flipperzero/doxygen/system.html`
- Purpose: lower-level platform programming entry
- Why it matters: this is the threshold between app development and platform understanding
- High-value points:
- routes into unit tests, runtime checks, FuriHalBus, HAL debugging, firmware targets, firmware assets, and Dolphin assets
- essential for advanced developers, but not the right first page for beginners
- Best knowledge-base location: `system programming / platform layer / low-level abstractions`

### 5.20 Key System Programming pages

- `Unit tests`
- URL: `https://developer.flipper.net/flipperzero/doxygen/unit_tests.html`
- Value: official way to think about tests on device

- `Run time checks and forced system crash`
- URL: `https://developer.flipper.net/flipperzero/doxygen/furi_check.html`
- Value: explains `furi_assert`, `furi_check`, and `furi_crash` behavior and philosophy

- `Using FuriHalBus API`
- URL: `https://developer.flipper.net/flipperzero/doxygen/furi_hal_bus.html`
- Value: critical for low-level hardware work; misuse causes real failures

- `Furi HAL Debugging`
- URL: `https://developer.flipper.net/flipperzero/doxygen/furi_hal_debug.html`
- Value: needed when troubleshooting near the HAL layer

- `What a Firmware Target is`
- URL: `https://developer.flipper.net/flipperzero/doxygen/hardware_targets.html`
- Value: explains `target.json`, hardware adaptation, link scripts, and symbol export

- `Firmware Assets`
- URL: `https://developer.flipper.net/flipperzero/doxygen/firmware_assets.html`
- Value: resource build rules, naming, and packaging

- `Dolphin assets`
- URL: `https://developer.flipper.net/flipperzero/doxygen/dolphin_assets.html`
- Value: system-experience and UI asset layer

### 5.21 File Formats

- Page: `File Formats`
- URL: `https://developer.flipper.net/flipperzero/doxygen/file_formats.html`
- Purpose: official file-format overview
- Why it matters: platform data storage, exchange, import, and export all depend on it
- High-value points:
- this deserves its own major knowledge-base section
- toolchains, converters, batch workflows, and AI parsing all depend on the format layer
- Best knowledge-base location: `file formats / data exchange / device data assets`

### 5.22 Key File Format pages

- `BadUSB File Format`
- URL: `https://developer.flipper.net/flipperzero/doxygen/badusb_file_format.html`
- Value: explains the text script format and platform-specific syntax extensions

- `iButton key file format`
- URL: `https://developer.flipper.net/flipperzero/doxygen/ibutton_file_format.html`
- Value: explains iButton data-file structure

- `Infrared Flipper File Formats`
- URL: `https://developer.flipper.net/flipperzero/doxygen/infrared_file_format.html`
- Value: baseline for IR data import/export and library building

- `LF RFID key file format`
- URL: `https://developer.flipper.net/flipperzero/doxygen/lfrfid_file_format.html`
- Value: baseline for low-frequency RFID data structure

- `NFC Flipper File Formats`
- URL: `https://developer.flipper.net/flipperzero/doxygen/nfc_file_format.html`
- Value: explains NFC file structure and versioned sections

- `SubGhz Subsystem File Formats`
- URL: `https://developer.flipper.net/flipperzero/doxygen/subghz_file_format.html`
- Value: explains `.sub` files, RAW vs protocol-specific files, and related user config formats

- `Heatshrink-compressed Tarball Format`
- URL: `https://developer.flipper.net/flipperzero/doxygen/heatshrink_tar_format.html`
- Value: hidden advanced page for resources, update bundles, and compressed distribution

### 5.23 First field-level file format summaries

This section is not a full mirror. It extracts the first batch of high-value field structures that humans and AI most often confuse.

#### 5.22.1 `.sub` / SubGhz

- Page: `SubGhz Subsystem File Formats`
- URL: `https://developer.flipper.net/flipperzero/doxygen/subghz_file_format.html`
- Key conclusions:
- `.sub` files are split into 3 parts: `header`, `preset information`, and `protocol/data`
- the normal header fields are `Filetype`, `Version`, and `Frequency`
- preset configuration includes `Preset`
- custom presets also require `Custom_preset_module` and `Custom_preset_data`
- protocol-style key files commonly add `Protocol`, `Bit`, `Key`, and `TE`
- RAW files require `Protocol: RAW` and `RAW_Data`
- `BinRAW` commonly uses `Protocol`, `Bit`, `TE`, `Bit_RAW`, and `Data_RAW`
- Most important KB insight:
- a `.sub` file is not just waveform data; it also carries frequency, radio preset context, and protocol payload information
- RAW and protocol-style key files are different mental models and should not be merged
- `Frequency` and `Preset` are often the context fields that converters and AI summaries miss

#### 5.22.2 NFC common header and device families

- Page: `NFC Flipper File Formats`
- URL: `https://developer.flipper.net/flipperzero/doxygen/nfc_file_format.html`
- Key conclusions:
- NFC files share a common header with at least `Filetype`, `Version`, `Device type`, and `UID`
- the current official examples commonly use `Version: 4`
- `Device type` determines which device-specific fields follow
- Most important KB insight:
- NFC is not one single format; it is a family of formats built as “shared header + device-specific section”
- if AI does not identify `Device type` first, the rest of the fields will be interpreted incorrectly

#### 5.22.3 NFC common device-specific fields

- `ISO14443-3A`
- Common fields: `ATQA`, `SAK`
- Role: basic 3A identification data

- `ISO14443-3B`
- Common fields: `Application data`, `Protocol info`
- Role: core 3B identification data

- `ISO14443-4A`
- Common fields: `ATQA`, `SAK`, `ATS`
- Role: 3A identification plus `ATS`

- `NTAG/Ultralight`
- Common fields: `Data format version`, `NTAG/Ultralight type`, `Signature`, `Mifare version`, `Counter n`, `Tearing n`, `Pages total`, `Pages read`, `Page n`
- Role: closer to a full internal card-state snapshot

- `Mifare Classic`
- Common fields: `Mifare Classic type`, `Data format version`, `Block n`
- Role: block-mapped storage of card content, including unknown areas when needed

- Most important KB insight:
- the core NFC pattern is not “one template,” but “identify the card family first, then interpret the fields”
- `Page n` and `Block n` are device-state mappings, not ordinary human-style key/value pairs

#### 5.22.4 `.ibtn` / iButton

- Page: `iButton key file format`
- URL: `https://developer.flipper.net/flipperzero/doxygen/ibutton_file_format.html`
- Key conclusions:
- file extension is `.ibtn`
- current official version is `Version: 2`
- the main shared field is `Protocol`
- protocol-dependent fields vary by family:
- Dallas-family data commonly uses `Rom Data`
- `DS1992` and `DS1996` can include `Sram Data`
- `DS1971` can include `Eeprom Data`
- `Cyfral` and `Metakom` commonly use `Data`
- Most important KB insight:
- the iButton file format is not a rigid fixed table; it is a protocol-led structure
- `Protocol` decides whether the next payload is ROM, SRAM, EEPROM, or generic key data

#### 5.22.5 `.rfid` / LF RFID

- Page: `LF RFID key file format`
- URL: `https://developer.flipper.net/flipperzero/doxygen/lfrfid_file_format.html`
- Key conclusions:
- file extension is `.rfid`
- the base structure is very compact: `Filetype`, `Version`, `Key type`, `Data`
- `Key type` determines the protocol family, such as `EM4100`, `H10301`, `Indala26`, `AWID`, and `Gallagher`
- Most important KB insight:
- the LF RFID format page is short, but it is extremely useful for converters and standardized templates
- this format is ideal for a KB pattern of “protocol name -> raw hex data”

#### 5.22.6 BadUSB text scripts

- Page: `BadUSB File Format`
- URL: `https://developer.flipper.net/flipperzero/doxygen/badusb_file_format.html`
- Key conclusions:
- BadUSB uses extended Duckyscript
- the file itself is plain-text `.txt`
- no compilation is required
- common command groups:
- comments and delays: `REM`, `DELAY`, `DEFAULT_DELAY`
- strings: `STRING`, `STRINGLN`
- modifiers: `CTRL`, `SHIFT`, `ALT`, `GUI`
- key hold: `HOLD`, `RELEASE`
- string delays: `STRING_DELAY`, `DEFAULT_STRING_DELAY`
- repetition: `REPEAT`
- ALT Numpad input: `ALTCHAR`, `ALTSTRING`, `ALTCODE`
- system request: `SYSRQ`
- media keys: `MEDIA`
- user-gated continuation: `WAIT_FOR_BUTTON_PRESS`
- custom USB HID identity: `ID VID:PID Manufacturer:Product`
- mouse commands: `LEFTCLICK`, `RIGHTCLICK`, `MOUSEMOVE`, `MOUSESCROLL`
- Most important KB insight:
- BadUSB is best modeled as a command language, not as a passive data file
- for knowledge-base use, it is better represented as “command category -> parameters -> effect”
- in higher-risk contexts, keep explanations at the format and capability-boundary level, not unauthorized use instructions

### 5.24 Files, Data Structures, and Related Pages

- `Files`
- URL: `https://developer.flipper.net/flipperzero/doxygen/files.html`
- Value: extremely useful for API archaeology and source-oriented exploration

- `Data Structures`
- URL: `https://developer.flipper.net/flipperzero/doxygen/annotated.html`
- Value: useful when you know a subsystem or type name but not the file path

- `Related Pages`
- URL: `https://developer.flipper.net/flipperzero/doxygen/pages.html`
- Value: many small but critical advanced pages are easiest to discover here

## 6. Official pages advanced users often miss

These are not always the first pages people click, but they are high-value for a serious long-term knowledge base:

- `https://docs.flipper.net/zero/development/cli`
- `https://docs.flipper.net/zero/development/hardware/flipper-blueprints`
- `https://docs.flipper.net/zero/development/hardware/devboard-schematics`
- `https://developer.flipper.net/flipperzero/doxygen/dev_tools.html`
- `https://developer.flipper.net/flipperzero/doxygen/ota_updates.html`
- `https://developer.flipper.net/flipperzero/doxygen/furi_check.html`
- `https://developer.flipper.net/flipperzero/doxygen/hardware_targets.html`
- `https://developer.flipper.net/flipperzero/doxygen/files.html`
- `https://developer.flipper.net/flipperzero/doxygen/pages.html`

What they have in common:

- they are not always the most popular entry pages
- but they are the pages that make a knowledge base deeper and more technically solid

## 7. What each official repo contributes

### 7.1 flipperzero-firmware

- URL: `https://github.com/flipperdevices/flipperzero-firmware`
- Role: the full official firmware and implementation baseline
- Best place in KB: `source baseline / internal implementation / API truth`

### 7.2 flipperzero-ufbt

- URL: `https://github.com/flipperdevices/flipperzero-ufbt`
- Role: the official simplified route for single-app development
- Best place in KB: `lightweight development / external apps / quick start`

### 7.3 flipper-application-catalog

- URL: `https://github.com/flipperdevices/flipper-application-catalog`
- Role: metadata and build-information backend for the Apps Catalog
- Best place in KB: `publishing / distribution / manifest / catalog`

### 7.4 flipperzero-good-faps

- URL: `https://github.com/flipperdevices/flipperzero-good-faps`
- Role: real apps maintained by the official team and close ecosystem contributors
- Best place in KB: `real project samples / official style references`

### 7.5 qFlipper

- URL: `https://github.com/flipperdevices/qFlipper`
- Role: the implementation of the official desktop management tool
- Best place in KB: `desktop ecosystem / device management / sync and updates`

## 8. Best top-level sections for a human-plus-AI knowledge base

If you want to turn the official sources into a durable knowledge base, the cleanest top-level categories are:

1. `Device UI and menus`
2. `Desktop and mobile ecosystem`
3. `Protocol capability domains`
4. `Hardware specs and boundaries`
5. `GPIO, modules, and peripherals`
6. `CLI, logging, and debugging`
7. `App development`
8. `Build and publishing`
9. `JavaScript`
10. `System programming`
11. `File formats`
12. `Official repos and real implementations`

## 9. Honest current status

This file now does the following:

- organizes the official pages by section and role
- gives a clean reading order
- works for both human reading and AI ingestion
- turns scattered “official links” into a structured guide

This file still does not do the following:

- it does not provide full page-by-page summaries for the entire site
- it only adds a first field-level batch for the highest-value file formats, not the full format catalog
- it does not yet extract every API page item by item

If this keeps expanding, the right next order is:

1. turn every `File Formats` page into a field-level guide
2. split `App Examples` into individual knowledge cards
3. go deeper into `System Programming`, especially HAL and targets
4. expand the important `Files` and headers into source-linked notes
