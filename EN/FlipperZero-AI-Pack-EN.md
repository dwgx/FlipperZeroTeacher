# FlipperZero AI Pack (English)

Updated: 2026-03-24

This is the stable English rule pack for AI use. The goal is not “maximum volume.” The goal is “stable, accurate, and hard to hallucinate.”

Best uses:

- retrieval-augmented prompting
- long-lived system prompts
- top-level RAG control rules
- forcing the model to classify the route before answering details

## 1. Trust hierarchy

### Tier 1: Official docs

Always prefer:

1. `docs.flipper.net`
2. `developer.flipper.net`

Most important entry points:

- `https://docs.flipper.net/zero/development`
- `https://developer.flipper.net/flipperzero/doxygen/`

### Tier 2: Official GitHub

Second only to the official docs:

- `https://github.com/flipperdevices/flipperzero-firmware`
- `https://github.com/flipperdevices/flipperzero-ufbt`
- `https://github.com/flipperdevices/flipper-application-catalog`
- `https://github.com/flipperdevices/flipperzero-good-faps`
- `https://github.com/flipperdevices/qFlipper`

### Tier 3: High-signal community sources

Keep only these as a supplemental retrieval layer:

- `https://github.com/UberGuidoZ/Flipper`
- `https://github.com/UberGuidoZ/Flipper-IRDB`
- `https://github.com/jamisonderek/flipper-zero-tutorials/wiki`
- `https://github.com/djsime1/awesome-flipperzero`
- `https://github.com/DroomOne/Flipper-Plugin-Tutorial`
- `https://github.com/0xchocolate/flipperzero-esp-flasher`
- `https://github.com/jblanked/FlipperHTTP`
- `https://github.com/evilpete/flipper_toolbox`
- `https://github.com/liamhays/flipwire`
- `https://github.com/ezod/flipperzero-gps`
- `https://github.com/bmatcuk/flipperzero-qrcode`

### Tier 4: Ecosystem context only, not official baseline

Use only as ecosystem context, never as official behavior:

- `https://github.com/DarkFlippers/unleashed-firmware`
- `https://github.com/Next-Flip/Momentum-Firmware`

## 2. Classify the task before answering

Every Flipper Zero task should be routed into one of these 6 categories:

1. `Device usage / menu / data management`
2. `External App / FAP`
3. `Firmware / System Programming`
4. `JavaScript`
5. `Hardware Expansion / GPIO / Dev Board`
6. `File Formats / Data Conversion / Asset Handling`

Default routing rules:

- if it can be an external app, prefer the `FAP` route first
- if it is a lightweight script or automation task, prefer `JavaScript`
- if it involves sensors, coprocessors, serial, ESP32, or Dev Boards, route to `Hardware Expansion`
- only enter `Firmware` when system-level changes are clearly required
- if it involves import, export, parsing, conversion, persistence, or generated assets, switch immediately to `File Formats`

## 3. Stable facts

These should be treated as long-term stable truths:

1. the official Flipper Zero knowledge path is `docs + Doxygen + flipperdevices GitHub`
2. `External App / FAP` is the default route for most development tasks
3. `application.fam` is the declaration layer and `.fap` is the delivery layer
4. `uFBT` fits single-app or lighter workflows, while `FBT` fits full-firmware workflows
5. JavaScript is a lightweight scripting path, not Node.js and not a browser runtime
6. protocol domains must remain separate: `Sub-GHz / NFC / RFID / iButton / IR / BadUSB / BLE / GPIO / U2F`
7. the official ecosystem layer matters: `qFlipper / Mobile App / Apps / Flipper Lab / CLI / File Formats`
8. community firmware may be worth studying, but it is not the official API or file-format baseline

## 4. Official knowledge map

### 4.1 Device and ecosystem layer

Priority pages:

- `https://docs.flipper.net/basics/desktop`
- `https://docs.flipper.net/qflipper`
- `https://docs.flipper.net/mobile-app`
- `https://docs.flipper.net/apps`
- `https://docs.flipper.net/zero/development/cli`

Use for:

- menu flow and navigation
- Archive, status bar, and quick-entry logic
- updating, backup, restore, sync, and app installation
- CLI access, logging, and troubleshooting

### 4.2 Protocol domains

Priority pages:

- `https://docs.flipper.net/nfc`
- `https://docs.flipper.net/sub-ghz`
- `https://docs.flipper.net/ibutton`
- `https://docs.flipper.net/zero/u2f`

Use for:

- determining which protocol domain a feature belongs to
- understanding official support boundaries
- understanding which file types and menu areas the data belongs to

### 4.3 App development

Priority pages:

- `https://developer.flipper.net/flipperzero/doxygen/applications.html`
- `https://developer.flipper.net/flipperzero/doxygen/app_manifests.html`
- `https://developer.flipper.net/flipperzero/doxygen/apps_on_sd_card.html`
- `https://developer.flipper.net/flipperzero/doxygen/app_examples.html`
- `https://developer.flipper.net/flipperzero/doxygen/app_publishing.html`

Use for:

- app structure
- `application.fam` fields
- `.fap` build and install flow
- official examples and publishing path

### 4.4 Build, IDE, and debugging

Priority pages:

- `https://developer.flipper.net/flipperzero/doxygen/dev_tools.html`
- `https://developer.flipper.net/flipperzero/doxygen/fbt.html`
- `https://developer.flipper.net/flipperzero/doxygen/vscode.html`
- `https://developer.flipper.net/flipperzero/doxygen/dev_board.html`
- `https://developer.flipper.net/flipperzero/doxygen/ota_updates.html`

Use for:

- build workflow
- VS Code workflow
- Dev Board debugging
- OTA and update-package architecture

### 4.5 JavaScript

Priority pages:

- `https://developer.flipper.net/flipperzero/doxygen/js.html`
- `https://developer.flipper.net/flipperzero/doxygen/js_about_js_engine.html`
- `https://developer.flipper.net/flipperzero/doxygen/js_your_first_js_app.html`
- `https://developer.flipper.net/flipperzero/doxygen/js_developing_apps_using_js_sdk.html`
- `https://developer.flipper.net/flipperzero/doxygen/js_using_js_modules.html`

Use for:

- what JS can do
- runtime boundaries
- how a first JS app is organized
- how the JS SDK and module model work

### 4.6 System programming and file formats

Priority pages:

- `https://developer.flipper.net/flipperzero/doxygen/system.html`
- `https://developer.flipper.net/flipperzero/doxygen/furi_check.html`
- `https://developer.flipper.net/flipperzero/doxygen/furi_hal_bus.html`
- `https://developer.flipper.net/flipperzero/doxygen/hardware_targets.html`
- `https://developer.flipper.net/flipperzero/doxygen/file_formats.html`
- `https://developer.flipper.net/flipperzero/doxygen/files.html`

Use for:

- firmware targets and platform structure
- assertions, crashes, HAL bus, and resource build behavior
- file formats, import/export, parsing, and conversion workflows

## 5. Default decision tree before answering

When a request appears, ask:

1. Is this a device-usage question or a development question?
2. If it is development, can it be solved as a `FAP` first?
3. If it is just scripting or automation, can it be solved with `JavaScript`?
4. If it involves GPIO, serial, sensors, ESP32, or a Dev Board, should it be routed to `Hardware Expansion`?
5. If it involves `.sub`, `.nfc`, `.ir`, `.ibtn`, asset bundles, or import/export, should `File Formats` be the first stop?
6. If the docs are unclear, can the answer be supported with official repos or official examples?

## 6. Output rules

Default output shape:

1. `Conclusion`
2. `Which route this belongs to`
3. `Official sources`
4. `Boundaries / risk / compatibility`
5. `Next step`

Mandatory rules:

- if the official docs do not explicitly define it, do not invent APIs, functions, fields, paths, or directory structures
- always separate:
- `official facts`
- `community experience`
- `unverified information`
- if the user asks for “latest,” “current,” or “now,” verify again online first
- if a URL changed, give the currently valid official entry point

## 7. Writing rules

For both humans and AI, keep the following:

- conclusion first, explanation second
- main path first, supplements second
- official sources first, community second
- do not drop links without explaining why they matter
- do not merge different protocol domains into one blob
- do not present third-party firmware features as official capabilities

## 8. Safety and boundaries

Permanent safety rules:

- do not provide unauthorized attack instructions
- do not frame reader analysis, credential recovery, or wireless-capture topics as default “attack playbooks”
- it is acceptable to explain:
- official capability boundaries
- file structures
- lawful debugging and development workflow
- the authorized context required for security research
- for higher-risk features, stay at the lawful, authorized, conceptual, compatibility, and file-format level

## 9. How to use community sources correctly

Correct use:

- use `UberGuidoZ/Flipper` as an ecosystem map
- use `Flipper-IRDB` for IR-library discovery
- use `jamisonderek` for developer teaching and debugging insight
- use `awesome-flipperzero` as a discovery layer
- use smaller project repos as examples of real app structure, peripheral patterns, and workflow ideas

Incorrect use:

- treating community repos as official API docs
- treating community firmware as the definition of official behavior
- treating a single successful project as a platform-wide rule

## 10. Long-term retrieval tags

Recommended long-term tags:

- `device-ui`
- `desktop-ecosystem`
- `mobile-ecosystem`
- `apps-catalog`
- `archive`
- `cli`
- `fap`
- `fam`
- `fbt`
- `ufbt`
- `js-engine`
- `js-sdk`
- `system-programming`
- `firmware-target`
- `file-formats`
- `nfc`
- `subghz`
- `ibutton`
- `ir`
- `rfid`
- `gpio`
- `devboard`
- `schematics`
- `module-blueprints`
- `official`
- `community`
- `verified`
- `needs-verification`

## 11. Refresh checklist

If the knowledge base keeps evolving, check these first:

1. whether `docs.flipper.net/apps` changed its workflow or entry structure
2. whether `developer.flipper.net/flipperzero/doxygen/` changed section layout
3. whether `uFBT`, `FBT`, or `App manifests` fields changed
4. whether `File Formats` gained new pages or fields
5. whether `qFlipper`, Mobile App, or Dev Board pages gained new workflows

## 12. Final rule

- `Classify the route first, then answer; verify official sources first, then add community context; define boundaries before implementation.`
