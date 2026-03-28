# 10. Firmware Source Code Deep Analysis

[Return to English Guide](README.md) | [Previous: 09. Firmware Reference](09-Firmware-Reference-2025.md) | [Return to English Entry](../README.md)

## Chapter Purpose

This chapter differs from [09. Firmware Reference](09-Firmware-Reference-2025.md):
- **Chapter 09**: User-oriented, focused on firmware features and selection guidance
- **This chapter**: Developer-oriented, focused on source-level analysis of four major community firmware codebases, implementation patterns, and study paths

If you need to **port code**, **understand low-level implementation details**, or **maintain custom firmware**, this chapter is required reading.

---

## Local Corpus Location

This chapter is based on locally archived firmware source code analysis:

| Firmware | Local Directory | Branch | Status |
|----------|-----------------|--------|--------|
| **Momentum** | `vendor_firmware/momentum` | `dev` | Active, recommended main baseline |
| **Unleashed** | `vendor_firmware/unleashed` | `dev` | Active, protocol-focused variant |
| **Xtreme** | `vendor_firmware/xtreme` | `dev` | Archived, historical reference |
| **RogueMaster** | `vendor_firmware/roguemaster` | `420` | Active, large aggregation repository |

---

## One-Sentence Conclusions

| Firmware | Core Positioning | Best for Learning |
|----------|------------------|-------------------|
| **Momentum** | Turning community firmware into a maintainable distribution | Systematic customization, theme assets, boot migration |
| **Unleashed** | Protocol capability enhancement priority | How to enhance protocol stack on stable baseline |
| **Xtreme** | Early deep-customization firmware | Historical evolution of large-scale UX modification |
| **RogueMaster** | Massive external-app aggregation | A cautionary example of large-repo maintenance |

**Learning Priority**: Momentum → Unleashed → Xtreme → RogueMaster

---

## Essential Differences of the Four Firmware

### 1. Momentum: Systematic Distribution

**Identity**
- Local Directory: `vendor_firmware/momentum`
- Branch: `dev`
- Commit: `430a3d506ea8c800e66d8b2f3d243631aebbe35c`

**Core Positioning**

Momentum is not a firmware that "adds a few more features", but a deeply modified firmware that systematically implements `theme assets + boot migration + menu reorganization + settings center + compatibility with old configurations`.

Among these four, it is the best example for learning how to maintain a custom Flipper distribution over time.

**Repository Skeleton and Build Chain**

It still uses the standard Flipper firmware skeleton:
- `SConstruct`
- `firmware.scons`
- `fbt`
- `fbt_options.py`
- `applications/`
- `lib/`
- `furi/`
- `targets/`

The key point is not that the build chain has changed, but that it has inserted its own intermediate layer into the official skeleton:
- `lib/momentum`
- `applications/main/momentum_app`

This shows Momentum's design philosophy is not to scatter modifications everywhere, but to converge "custom distribution capabilities" into an independent namespace.

**Most Obvious Modifications Relative to Official Firmware**

#### Boot Phase Migration and Custom Initialization

The most critical file is `furi/flipper.c`, which does several very "distribution-like" things:
- Migrates old paths and old configurations
- Compatible with early `xtreme` configuration filenames
- Migrates U2F, favorites, desktop, notification, power and other configurations
- Loads `momentum_settings` at boot
- Initializes `asset_packs` at boot

This represents Momentum's formal design goal of "users won't break configs when upgrading", rather than a temporary script.

#### Independent Momentum Settings System

Key directories:
- `lib/momentum`
- `applications/main/momentum_app`

In `lib/momentum/settings.c` you can see it parameterizes a large number of behaviors:
- Animation speed
- Menu style
- Lock screen options
- Status bar icons
- File browser display strategy
- Dark mode
- RGB backlight
- External SPI / UART channels
- Color spoofing

This shows Momentum's core is not "hard-coded features", but "making customization items into a unified configuration table".

#### Asset Pack System is Its Most Distinctive Implementation

Key files:
- `lib/momentum/asset_packs.c`
- `lib/momentum/asset_packs.h`
- `scripts/asset_packer.py`
- `documentation/file_formats/AssetPacks.md`

It makes animations, icons, and fonts into an external package system, and provides packaging scripts. This approach is much more advanced than simply replacing images, because it abstracts "art asset replacement" into a distributable format.

#### GUI / Canvas / Loader Have All Taken Over Key Behaviors

High-value files:
- `applications/services/gui/canvas.c`
- `applications/services/gui/gui.c`
- `applications/services/gui/modules/menu.c`
- `applications/services/loader/loader.c`

Here you can see several very critical designs:
- Fonts and icons are not fixed resources, but can be replaced by `asset_packs`
- Menu styles are not limited to one
- Dark mode goes deep into the canvas / gui layer
- loader will unload asset packs before running certain Apps, and restore them after exit

In other words, Momentum's modifications are not "a settings App + some theme skins", but have reached the UI infrastructure layer.

**Most Notable Implementations**

#### `momentum_app`

It is not a simple settings page, but the front-end control center of this distribution. It handles:
- Settings item editing
- Asset pack enumeration
- Configuration saving
- Resource reload triggering

#### `namespoof`

Key files:
- `lib/momentum/namespoof.c`
- `lib/momentum/namespoof.h`

This shows "device identity presentation" has also been incorporated into the unified customization layer, rather than scattered into other services.

#### Boot Migration Logic

The most engineering-flavored part is the migration:
- Compatible with old config names
- Cleans up deprecated paths
- Migrates Xtreme old configs into Momentum new configs

This directly demonstrates: Momentum is designed as a more mature generation after Xtreme.

**Maintenance Risks / Compatibility Risks / Technical Debt**

**Risk 1: UI Deep Modification Surface is Too Large**

It has modified canvas, gui, menu, loader. Any official GUI layer upgrade may cause compatibility issues with these custom hooks.

**Risk 2: Asset Hot Replacement Involves Manual Memory Management**

Icon, font, and animation replacements involve large amounts of malloc/free/raw pointer replacement. Once an exception path is not cleaned up properly, it can easily cause:
- Memory leaks
- Double free
- Failure to restore original resources

**Risk 3: Migration Logic Will Continue to Grow**

The stronger the migration logic, the heavier the historical baggage. Every format adjustment in the future will require maintaining the "old name -> new name" compatibility chain.

**Risk 4: Complex Interaction Between loader and asset pack**

Unloading resources when running Apps and restoring them after exit, this lifecycle management is most afraid of:
- Abnormal App exit
- Recovery path not reached
- Multiple state overlaps

**What This Source Code is Best For Learning**

1. How to unify a bunch of custom features into one configuration system
2. How to make theme assets into package format rather than scattered files
3. How to evolve from radical firmware to "upgradable, migratable, long-term maintainable" firmware

**10 Files / Directories Most Worth Deep Diving**

1. `furi/flipper.c`
2. `lib/momentum/settings.c`
3. `lib/momentum/asset_packs.c`
4. `lib/momentum/namespoof.c`
5. `applications/main/momentum_app/`
6. `applications/services/gui/modules/menu.c`
7. `applications/services/gui/canvas.c`
8. `applications/services/loader/loader.c`
9. `scripts/asset_packer.py`
10. `documentation/file_formats/AssetPacks.md`

---

### 2. Unleashed: Protocol Capability Enhancement

**Identity**
- Local Directory: `vendor_firmware/unleashed`
- Branch: `dev`
- Commit: `a5f6285e917240101bc86444ebf36a6b9f2b7e66`

**Core Positioning**

Unleashed is the most "official firmware enhanced version" of these 4: Its core competitiveness is not fancy themes, but protocols, Sub-GHz, external modules, and stable compatibility.

If you want to learn "how to strengthen the protocol layer while staying close to official", Unleashed is the first reference.

**Repository Skeleton and Build Chain**

It still uses the standard Flipper firmware build system:
- `SConstruct`
- `firmware.scons`
- `fbt_options.py`
- `applications/`
- `lib/`
- `targets/`

`fbt_options.py` directly writes the firmware identity as:
- `FIRMWARE_ORIGIN = "Unleashed"`

And defaults to:
- `TARGET_HW = 7`
- `DEBUG = 1`

This shows it retains a debugging-friendly orientation rather than pursuing extreme compression only.

**Most Obvious Module Extensions Relative to Official Firmware**

#### Sub-GHz is the True Core Battlefield

From README to documentation to source structure, the most obvious themes are:
- More protocols
- More frequencies
- Extra frequency hopper configuration
- External CC1101 support
- Main App UI enhancement

High-value entry points:
- `documentation/SubGHzSettings.md`
- `documentation/SubGHzRemotePlugin.md`
- `applications/main/subghz`
- `applications/debug/subghz_test`
- `applications/drivers/subghz/cc1101_ext`
- `lib/subghz`

#### Name Modification Made into Boot Service

Key files:
- `applications/services/namechanger/application.fam`
- `applications/services/namechanger/namechanger.c`

This is not an ordinary external App, but a `STARTUP` type service. It waits after boot for:
- CLI
- BT
- Storage

All to be ready, then changes the device name and refreshes the Bluetooth side display.

This shows Unleashed leans more toward "system enhancement", not just making a menu function.

#### Very Strong Documentation-Driven Approach

This repository has extensive documentation oriented toward usage and maintenance:
- Installation
- FAQ
- Sub-GHz Settings
- Sub-GHz Remote
- Unit Tests
- Extra Modules

This shows Unleashed's approach is not just showing off source code tricks, but hoping to make protocol enhancements into a "user-understandable, maintainer-followable" system.

**Modification Patterns at Menu / UI / Protocol / Plugin Levels**

#### Menu and UI

Unleashed also has many experience enhancements, but not with large-scale reskinning as the core.

It is more like:
- Adding useful functions on official UI
- Making practical enhancements in input, desktop, lock, and status display

From README you can see:
- Changeable Flipper name
- Text input with cursor support
- Desktop clock
- Battery percentage display
- More game entries
- Bad USB / BadKB related integration

#### Protocol

This is where Unleashed's home field is.

It concentrates enhancements on:
- Sub-GHz protocol quantity
- Frequency range
- External CC1101
- Manual protocol construction
- Debug mode
- Raw / protocol toolchains

#### Plugins and Peripherals

It supports external hardware and plugins, but not like RogueMaster stuffing hundreds of third-party Apps into the repository, rather making systematic expansions around protocols and common enhancements.

**Maintenance Risks / Compatibility Risks / Technical Debt**

**Risk 1: More Protocol Enhancements Mean Higher Regression Testing Costs**

As long as you add:
- Protocols
- Frequencies
- External modules
- More send / read scenarios

The test matrix will explode rapidly.

**Risk 2: Startup Service Style NameChanger Code Itself Admits "Not Written Beautifully"**

In `namechanger.c` the developers themselves left very straightforward comments, explaining this implementation involves:
- Waiting polling
- Service ready detection
- VCP on/off
- BT recovery

It works, but in engineering terms belongs to "patch-style system service", not the most elegant design.

**Risk 3: Stronger Protocol Capabilities Mean More Dependency on Underlying HAL and Target Hardware Stability**

External CC1101, extended frequencies, extra module support, essentially all push risks toward:
- `targets/`
- `applications/drivers/`
- `lib/subghz/`

These lower-level areas.

**Most Notable Implementations**

#### `namechanger`

It is a very typical "system-level enhancement rather than ordinary App":
- Takes effect at startup
- Directly reaches BT and CLI
- Handles SD ready timing

This piece is suitable for learning "how Flipper services wait for and trigger each other".

#### `subghz_test`

Key directory: `applications/debug/subghz_test`

It reflects that this firmware is not just pursuing "having the feature", but also making test and debug panels for the protocol layer.

**What This Source Code is Best For Learning**

1. How to enhance protocol stack without changing UI into another system
2. How to do external module support
3. How to make protocol enhancements with supporting documentation

**10 Files / Directories Most Worth Deep Diving**

1. `fbt_options.py`
2. `README.md`
3. `applications/services/namechanger/namechanger.c`
4. `applications/services/namechanger/application.fam`
5. `applications/main/subghz`
6. `applications/debug/subghz_test`
7. `applications/drivers/subghz/cc1101_ext`
8. `lib/subghz`
9. `documentation/SubGHzSettings.md`
10. `documentation/SubGHzRemotePlugin.md`

---

### 3. Xtreme: Ancestor-Type Deep Customization Firmware

**Identity**
- Local Directory: `vendor_firmware/xtreme`
- Branch: `dev`
- Commit: `54619d013a120897eeade491decf4d1e95217c06`
- Upstream Status: Archived

**Core Positioning**

Xtreme is a historic firmware that "pushes Flipper UI, settings, theme assets, and quick configuration to a very radical position". Although it is no longer suitable as a long-term mainline, it remains a high-value sample for learning Flipper deep UX transformation.

**Repository Skeleton and Build Chain**

It still follows the Flipper firmware standard structure:
- `SConstruct`
- `firmware.scons`
- `fbt_options.py`
- `applications/`
- `lib/`
- `furi/`
- `targets/`

But its key customizations are not scattered, but converged in:
- `lib/xtreme`
- `applications/main/xtreme_app`

This is very similar to later Momentum, showing Momentum clearly inherited Xtreme in engineering organization.

**Most Obvious Module / Feature Extensions Relative to Official Firmware**

#### Boot Phase Loading Xtreme Settings and Xtreme Assets

Key file: `furi/flipper.c`

The most critical point here is that it explicitly writes during boot:
- `Loading Xtreme Settings`
- `Loading Xtreme Assets`

And directly displays `Xtreme is Booting` on the startup page.

This shows Xtreme is not "hanging a few external Apps", but formally making itself an independent distribution layer.

#### `lib/xtreme` is the True Core

Key directory: `lib/xtreme`

The most important implementations here are two types:
- `settings.c`
- `assets.c`

`settings.c` makes a large number of behaviors into configurations:
- Menu style
- Lock screen
- Status bar clock
- Show hidden files
- BadBT / BadKB related
- RGB backlight
- Charge limit
- UART / SPI allocation

`assets.c` then makes animated icons, static icons, and fonts into a replaceable runtime asset system.

#### `Xtreme App` is the Front-End Control Center

Key files:
- `applications/main/xtreme_app/application.fam`
- `applications/main/xtreme_app`

It handles:
- Settings entry
- Custom behavior switches
- Asset pack selection

This structure was later further formalized in Momentum.

#### `BadKB` Well Represents Xtreme's Approach

Key directory: `applications/main/bad_kb`

From scene files you can see it provides many configuration aspects:
- BT name
- BT MAC
- USB name
- USB VID/PID
- Keyboard layout

This shows Xtreme's style is: pushing "advanced options everyone in the community wants" to operable UI.

**Modification Patterns at Menu / UI / Protocol / Wireless / Plugin Levels**

#### Menu

- Switchable menu styles
- More free main menu organization
- Adjustable status bar clock, battery style, etc.

#### UI

This is Xtreme's strongest part:
- Asset packs
- Icon replacement
- Font replacement
- Animation styles
- Lock screen appearance
- Dark mode

#### Protocol / Wireless

Xtreme also absorbed some protocol-oriented enhancements from Unleashed, but compared to Unleashed, its true focus is still "function front-endization + experience strengthening".

#### Plugin Philosophy

Xtreme is not like RogueMaster's "stuff with external Apps", but rather "reserving advanced function entries in the system for users to directly configure".

**Maintenance Risks / Compatibility Risks / Technical Debt**

**Risk 1: Upstream Already Archived**

This means:
- You can learn from it
- You can read it
- But not suitable to continue as future mainline for long-term tracking

**Risk 2: Asset System Has Large Amounts of Manual Pointer Replacement**

In `lib/xtreme/assets.c` there are obvious:
- Frame allocation
- Copying original icons
- Replacing original pointers
- Manual recovery

This code is powerful, but most afraid of boundary conditions:
- Incomplete files
- Mid-load failures
- Partial success partial failure
- Inconsistent release order

**Risk 3: Very Many Settings Items, Wide Coupling Surface**

Settings cover:
- UI
- File browsing
- Serial ports
- External modules
- Power
- BadKB

This means any official interface layer change may affect this large configuration system.

**Risk 4: The Deeper the Modification, the More Painful Subsequent Official Mainline Merging**

Xtreme reads very well, but from a maintainer's perspective, the biggest problem is:
- You've touched almost every aspect
- Every future sync with official requires re-resolving conflicts

This is why later more mature routes evolved toward Momentum's more systematic encapsulation direction.

**Most Notable Implementations**

#### `xtreme_settings`

Is a very typical "community firmware control plane".

#### `xtreme_assets`

Is its most worthwhile code to learn, because here you can see:
- How resources are dynamically replaced
- How resources are recovered at runtime
- How Flipper UI assets are extended into a theme system

#### `bad_kb`

Best represents Xtreme's design philosophy: making advanced tricks into UI that ordinary users can click.

**What This Source Code is Best For Learning**

1. How to do Flipper deep UI/asset system
2. How to stuff advanced functions into a unified configuration entry
3. Why radical hacks eventually evolve into successor schemes that value engineering discipline more

**10 Files / Directories Most Worth Deep Diving**

1. `furi/flipper.c`
2. `lib/xtreme/settings.c`
3. `lib/xtreme/assets.c`
4. `lib/xtreme/xtreme.h`
5. `applications/main/xtreme_app`
6. `applications/main/bad_kb`
7. `applications/services/gui/modules/menu.c`
8. `targets/f7/furi_hal/furi_hal_light.c`
9. `assets/SConscript`
10. `ReadMe.md`

---

### 4. RogueMaster: Mega Aggregation Repository

**Identity**
- Local Directory: `vendor_firmware/roguemaster`
- Branch: `420`
- Commit: `a2fcf04c1371bc534c121cc6f13dff59e492afb3`

**Core Positioning**

RogueMaster is not "ordinary community firmware", but a super-large aggregation warehouse: It rolls a large number of community Apps, plugins, menu systems, and custom resources into one repository. Its most worthwhile learning is not a single point feature, but "what a super-large aggregation firmware grows into, and why maintenance becomes increasingly difficult".

**Repository Skeleton and Build Chain**

It still retains Flipper's standard build system:
- `SConstruct`
- `firmware.scons`
- `fbt`
- `applications/`
- `lib/`
- `targets/`

But unlike the other three, it has undergone qualitative change at the `applications` layer:
- `applications/external` has `611` external directories with `application.fam` locally counted

This is no longer "firmware comes with some tools", but "the entire App ecosystem is rolled into the repository".

**Most Obvious Module / Feature Extensions Relative to Official Firmware**

#### `CFW Settings` is Its Control Center

Key directories:
- `applications/settings/cfw_app`
- `lib/cfw`

Here you will see its core philosophy:
- Not just a main menu
- Also has a game menu
- Both main and game menus can be reordered
- Can change display, colors, backlight, serial ports, peripherals, menu starting points

Compared to Momentum / Xtreme, RogueMaster's settings center is more like a "distribution console".

#### Dual Menu System is a Very Distinctive Feature

Key header file: `lib/cfw/cfw.h`

It directly defines:
- `CFW_MENU_PATH`
- `CFW_MENU_GAMESMODE_PATH`

And in `CfwSettings` there simultaneously exist:
- `menu_style`
- `game_menu_style`
- `start_point`
- `game_start_point`

This shows RogueMaster doesn't just want to "give you more Apps", but wants to completely split "main functions" and "games/entertainment" into two sets of entry logic.

#### External App Aggregation is Its Largest Structural Feature

Local statistics:
- `applications/external` has `611` directories with `application.fam`

This means:
- Repository is extremely large
- Sources are extremely mixed
- Version rhythms are not unified
- Every sync with official mainline will be very heavy

#### Large Amounts of Features Are Not Original, But Integration and Redistribution

From README and `application.fam` comments you can directly see:
- Various third-party project links
- merged / refactored / original by source descriptions

In other words, RogueMaster's main capability is not "inventing all modules itself", but "merging community achievements into the repository as much as possible".

**Modification Patterns at Menu / UI / Protocol / Plugin Levels**

#### Menu

This is one of RogueMaster's main structural themes:
- Main menu configurable
- Game menu configurable
- Menu items can be added, deleted, and reordered
- Starting point customizable

#### UI

It also has colors, LCD styles, RGB backlight and other settings, but UI modification is not its core competitiveness.

#### Protocol

It absorbs many protocol-type and tool-type projects, but its biggest source code characteristic is not "a particular protocol layer is especially deep", but rather "protocol Apps are many, sources are many, versions are many".

#### Plugins

RogueMaster's biggest structural risks and values are both here:
- It lets you see how a Flipper firmware repository can be made into a "super-large plugin marketplace"

**Most Notable Implementations**

#### `cfw.h` / `settings.c`

Key files:
- `lib/cfw/cfw.h`
- `lib/cfw/settings.c`

You can see RogueMaster's true control plane:
- Main menu
- Game menu
- Visible file strategy
- RGB backlight
- LCD style
- Color mode
- Peripheral serial ports
- Color spoofing

#### `cfw_app`

Key directory: `applications/settings/cfw_app`

This piece is very suitable for deep reading, because it is not a simple "variable item list", but directly makes:
- Main menu editing
- Game menu editing
- Order adjustment
- Protocol settings
- Screen settings

All into scene systems.

#### `applications/external`

This is the most special place in the entire repository.

It is more like an "integration distribution layer", not a single project source code.

**Maintenance Risks / Compatibility Risks / Technical Debt**

**Risk 1: Sources Are Too Mixed**

When a repository integrates 600+ external Apps, the biggest enemy is not compilation, but:
- You can hardly guarantee each source is still alive
- You can hardly unify code style
- You can hardly confirm each App's API drift situation

**Risk 2: Version Rhythms Completely Not Unified**

Official mainline, Unleashed, various external community Apps, each with their own bug fix rhythms.

Integration repository maintenance costs will continue to rise.

**Risk 3: The Larger the Repository, the Less Suitable for "Precise Root Cause Fixing"**

If you just want to fix a few commonly used functions on your device, RogueMaster is not the most ideal working mother repository, because it is too messy.

**Risk 4: Menu System and External App System Are Coupled to Each Other**

The more configurable the menu, the more external Apps, the more likely to appear:
- Menu pointer failure
- Directory drift
- manifest changes
- Icon and category misalignment

**Risk 5: This Type of Repository Most Easily Appears "Can Install, But Not Necessarily Stable Long-Term"**

Because integration breadth is too large, stability will more depend on:
- Individual App quality
- Whether App updates are synchronized
- Whether menu data and manifest continue to match

**What This Source Code is Best For Learning**

1. How to make a super-large aggregation distribution
2. What maintenance problems large-scale App intake will bring
3. Why "full features" does not equal "suitable for long-term maintenance"

**10 Files / Directories Most Worth Deep Diving**

1. `ReadMe.md`
2. `lib/cfw/cfw.h`
3. `lib/cfw/settings.c`
4. `applications/settings/cfw_app`
5. `applications/external`
6. `applications/external/subghz_remote`
7. `applications/external/namechanger`
8. `CHANGELOG.md`
9. `RoadMap.md`
10. `documentation`

---

## Core Implementation Patterns and Source Code Reference

### At a Glance: Core Writing Differences of the 4 Firmware

#### Momentum

Core patterns are:
- Use `lib/momentum/settings.c` for **table-driven configuration read/write**
- Use `momentum_app_apply()` for **unified control plane**
- Use `furi/flipper.c` for **boot migration + initialization injection**
- Use `lib/momentum/asset_packs.c` for **runtime icon/font replacement**

It is most like a "distribution kernel".

#### Unleashed

Core patterns are:
- Try not to create too large intermediate layers
- Directly modify official main chain modules
- Use `namechanger` this type of **system boot service** for patch-style enhancement
- Use `find_my_flipper` this type of **state-driven UI App** for single-point functions

It is most like an "enhanced OFW".

#### Xtreme

Core patterns are:
- `lib/xtreme/settings.c` for **table-driven configuration system**
- `xtreme_app_apply()` for **master control settings entry**
- `lib/xtreme/assets.c` for **direct replacement of global icons/fonts**

It is most like an "experience layer master control".

#### RogueMaster

Core patterns are:
- `lib/cfw/settings.c` for **large flat configuration persistence**
- `cfw_app_apply()` for **dual menu + batch configuration writing**
- `loader.c` for **external App distribution and error UX**
- The real bulk is in `applications/external`

It is most like a "giant distribution aggregator".

### Pattern 1: How Configuration Systems Are Written

#### A. Momentum / Xtreme: Table-Driven Configuration Serialization

Their most valuable aspect is not having many fields, but making configuration read/write into a **unified metadata table**.

Core entry points:
- Momentum: `lib/momentum/settings.c:126`
- Xtreme: `lib/xtreme/settings.c:119`

Typical Momentum writing:

```c
static const struct {
    momentum_settings_type type;
    const char* key;
    void* val;
    union { ... };
} momentum_settings_entries[] = {
    {setting_str(asset_pack)},
    {setting_uint(anim_speed, 25, 300)},
    {setting_int(cycle_anims, -1, 86400)},
    {setting_bool(unlock_anims)},
    {setting_enum(menu_style, MenuStyleCount)},
    ...
};
```

This code has great significance:
- Each configuration item carries `key + type + address + boundary`
- `load()` and `save()` don't need to write duplicate logic for each field
- When adding configuration items, just supplement the metadata table, maintenance cost is much lower

#### B. RogueMaster: Large Flat Configuration Read/Write

Core entry points:
- `load`: `lib/cfw/settings.c:34`
- `save`: `lib/cfw/settings.c:100`

It is not table-driven, but handwritten item by item:

```c
flipper_format_read_uint32(file, "menu_style", (uint32_t*)&x->menu_style, 1);
flipper_format_read_uint32(file, "game_menu_style", (uint32_t*)&x->game_menu_style, 1);
flipper_format_read_bool(file, "show_hidden_files", &x->show_hidden_files, 1);
flipper_format_read_uint32(file, "charge_cap", &x->charge_cap, 1);
```

Characteristics of this writing style:
- Easy to understand
- Changing one field is very direct
- But when fields become many, it becomes very long and scattered
- Later more prone to "forgetting to change one side of load/save" problems

**Conclusion**: Momentum / Xtreme are more engineering-oriented, RogueMaster is more like "quick field expansion".

### Pattern 2: Settings App is Not a Settings Page, But a "Control Plane"

One of the most important codes in these 3 firmware is not a certain protocol module, but their `*_app_apply()`.

#### Momentum: One Apply Writes Many System Files

Entry: `applications/main/momentum_app/momentum_app.c:16`

Core code pattern:

```c
if(app->save_mainmenu_apps) { ... write mainmenu_apps.txt ... }
if(app->save_desktop) { ... write desktop settings ... }
if(app->save_subghz_freqs) { ... write setting_user ... }
if(app->save_subghz) { ... write extend_range.txt ... }
if(app->save_name) { ... write name spoof file ... }
if(app->save_dolphin) { ... change dolphin state ... }
if(app->save_backlight) { rgb_backlight_save_settings(); }
if(app->save_settings) { momentum_settings_save(); }
```

This is its essence:
- `momentum_app` is not an ordinary App
- It is a **master console that translates UI selections into multiple system configuration files/state updates**

#### Xtreme: Almost the Same Control Plane Design

Entry: `applications/main/xtreme_app/xtreme_app.c:14`

Most critical similarity:

```c
if(app->save_mainmenu_apps) { ... "MenuAppList Version 0" ... }
if(app->save_subghz_freqs) { ... }
if(app->save_subghz) { ... }
if(app->save_name) { ... }
if(app->save_backlight) { ... }
if(app->save_settings) { xtreme_settings_save(); }
```

This shows Momentum is not a completely new design out of thin air, but clearly inherited Xtreme's master control thinking, then organized and upgraded it.

#### RogueMaster: Dual Menu Control Plane

Entry: `applications/settings/cfw_app/cfw_app.c:14`

Its most special aspect is writing two sets of menus simultaneously:

```c
if(app->save_mainmenu_apps) {
    stream_write_format(stream, "MainMenuList Version %u\n", 0);
}

if(app->save_gamemenu_apps) {
    stream_write_format(stream, "GamesMenuList Version %u\n", 0);
}
```

This explains why RogueMaster's menu system is heavier than others:
- It is not a single menu
- It is main menu / game menu dual system
- Configuration divergence is larger, maintenance complexity naturally higher

### Pattern 3: Inject Logic at Boot

#### Momentum: Boot Migration is Firmware-Level Feature

Core entry points:
- `migrate`: `furi/flipper.c:58`
- `init`: `furi/flipper.c:169`

The most critical is not a single `load settings`, but it does **file migration** first at boot:

```c
const struct {
    const char* src;
    const char* dst;
} renames[] = {
    {EXT_PATH(".config/favorites.txt"), ARCHIVE_FAV_PATH},
    {EXT_PATH(".config/xtreme_menu.txt"), MAINMENU_APPS_PATH},
    {EXT_PATH(".config/xtreme_settings.txt"), MOMENTUM_SETTINGS_PATH},
    ...
};
```

This segment is very representative:
- Momentum explicitly considers upgrading from old layouts
- It is compatible with OFW / Unleashed / Xtreme old paths
- So it is more like a "migration-friendly distribution", not a pure new repository

#### Unleashed: Boot Service Style Patch

Core entry points:
- `init`: `applications/services/namechanger/namechanger.c:11`
- `system start`: `applications/services/namechanger/namechanger.c:73`

Most critical code pattern:

```c
while(!furi_record_exists(RECORD_CLI_VCP) ||
      !furi_record_exists(RECORD_BT) ||
      !furi_record_exists(RECORD_STORAGE)) {
    ...
}

if(namechanger_init()) {
    cli_vcp_disable(cli);
    cli_vcp_enable(cli);
    bt_profile_restore_default(bt);
}
```

This implementation shows:
- It is not a clean elegant unified architecture layer
- But a very typical "patch after system boot"
- Wait for services to come up first, then touch CLI and BT, forcing the device to refresh the new name

This writing style is very practical, but also has a strong technical debt flavor.

### Pattern 4: How Asset Packs Are Done

#### Momentum: Keep Replacement List, Don't Directly Modify Original Icon Objects

Entry points:
- `animated`: `lib/momentum/asset_packs.c:34`
- `static`: `lib/momentum/asset_packs.c:98`
- `init`: `lib/momentum/asset_packs.c:179`

Its core is constructing a replacement table:

```c
IconSwapList_push_back(
    asset_packs->icons,
    (IconSwap){
        .original = original,
        .replaced = &swap->icon,
    });
```

Characteristics of this writing style:
- Original icon objects are not directly modified in place
- Use an `original -> replaced` mapping table to manage replacement
- Rollback and release logic is more controllable

#### Xtreme: Directly Modify Global Icon Objects

Entry points:
- `animated`: `lib/xtreme/assets.c:23`
- `init`: `lib/xtreme/assets.c:152`
- `free`: `lib/xtreme/assets.c:185`

Its writing style is more aggressive:

```c
Icon* original = malloc(sizeof(Icon));
memcpy(original, replace, sizeof(Icon));
FURI_CONST_ASSIGN_PTR(replace->original, original);
FURI_CONST_ASSIGN(replace->width, icon_width);
FURI_CONST_ASSIGN_PTR(replace->frames, frames);
```

This means:
- It directly modifies the global icon that `replace` points to
- First backs up original value to `original`
- Then `memcpy` back at exit

Advantages:
- Runtime replacement is very direct

Risks:
- Once release or rollback order is wrong, it easily breaks
- This has more brittle boundaries than Momentum's replacement table scheme

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

## Most Worth Copying Wireless Core Source Code Snippet Index

### Principles

"Most worth copying" does not mean copying entire files, but means:
- Clearest call chain
- Cleanest abstraction boundaries
- Key entries that can explain 80% of problems

So here priority selection is:
- `Momentum` for main reading
- `Unleashed` for stable comparison
- `Xtreme` for API generation
- `RogueMaster` for large ecosystem and drift risk

### BLE: Custom Profile / Companion / Test Mode

#### Most Worth Copying: BLE App Startup Skeleton

**Purpose**
- Learn how to pull up BLE profile from system service
- Learn `GAP/GATT/profile` startup sequence

**Main Reference**
- Momentum: `targets/f7/furi_hal/furi_hal_bt.c:165`
- Unleashed: `targets/f7/furi_hal/furi_hal_bt.c:165`

**Comparison Group**
- Xtreme: `targets/f7/furi_hal/furi_hal_bt.c:166`
- RogueMaster: `targets/f7/furi_hal/furi_hal_bt.c:165`

**Why Valuable**
- This is the total gate where BLE business layer enters radio stack
- When you later see "why profile won't start" "why GAP init fails", you have to come back here
- Can also directly see API generation differences

#### Most Worth Copying: Companion Bluetooth Serial Bridge

**Purpose**
- Learn how Flipper Companion's BLE serial bridge actually feeds RPC
- Learn why sessions break, why decode errors appear

**Main Reference**
- Momentum: `applications/services/bt/bt_service/bt.c:200`
- Momentum: `applications/services/rpc/rpc.c:167`

**Comparison Group**
- Unleashed: `applications/services/bt/bt_service/bt.c:202`
- Xtreme: `applications/services/bt/bt_service/bt.c:189`
- RogueMaster: `applications/services/bt/bt_service/bt.c:186`

**Why Valuable**
- Companion essence is not "mysterious Bluetooth protocol"
- It is essentially `serial_profile + serial_service + rpc_session_feed()`
- Once you thoroughly understand this segment, the entire Companion piece is no longer mysterious

#### Most Worth Copying: BLE Test Transmit Entry

**Purpose**
- Learn how test mode sinks from CLI to HCI test mode
- Learn true transmit test tone / packet HAL entry

**Main Reference**
- Momentum: `applications/services/bt/bt_cli.c:44`
- Momentum: `targets/f7/furi_hal/furi_hal_bt.c:340`
- Momentum: `targets/f7/furi_hal/furi_hal_bt.c:350`

**Why Valuable**
- This chain is best for learning "CLI is just entry, HAL is real transmit"
- For future self-testing, calibration, carrier test, all start from here

### extra_beacon / Find My / Name Broadcast

#### Most Worth Copying: `extra_beacon` HAL Base

**Purpose**
- Learn how to hang extra ads beside normal BLE profile
- Learn how system-level beacon is initialized and started

**Main Reference**
- Momentum: `targets/f7/furi_hal/furi_hal_bt.c:131`
- Momentum: `targets/f7/ble_glue/extra_beacon.c:25`
- Momentum: `targets/f7/furi_hal/furi_hal_bt.c:416`
- Momentum: `targets/f7/furi_hal/furi_hal_bt.c:432`

**Why Valuable**
- This is the system base for all "extra hang ads / beacon" functions
- No matter what the upper layer name is, finally has to return to this API set

#### Most Worth Copying: Find My Boot Injection

**Purpose**
- Learn how to automatically restore beacon state to running state after SD card mount
- Learn "user config file -> automatically apply at boot" this type of pattern

**Main Reference**
- Momentum: `applications/system/findmy/findmy_startup.c:9`
- Momentum: `applications/system/findmy/findmy_state.c:115`

**Comparison Group**
- Unleashed: `applications/system/find_my_flipper/findmy_startup.c:9`
- Xtreme: `applications/system/find_my_flipper/findmy_startup.c:5`
- RogueMaster: `applications/external/find_my_flipper/findmy_startup.c:5`

**Why Valuable**
- Here is not talking about some Find My business, but talking about a more general pattern:
  - `storage mount`
  - `load state`
  - `apply state`
  - `run_parallel`
- This pattern is very useful for any "boot restore wireless state" functions in the future

### Sub-GHz: Frequency Strategy, Gating, Async Transmit

#### Most Worth Copying: Frequency Config Entry from File to System

**Purpose**
- Learn how `setting_user` is loaded
- Learn why custom frequency points appear in UI list

**Main Reference**
- Momentum: `applications/main/subghz/helpers/subghz_txrx.c:29`
- Momentum: `lib/subghz/subghz_setting.c:201`

**Why Valuable**
- Frequency problem first scene is not in UI, but here
- Understand this layer, then know "which frequency points are default table, which are user table"

#### Most Worth Copying: `extend_range` Control Plane

**Purpose**
- Learn how settings App translates UI selection into actual wireless config files
- Learn how "control plane" and "wireless base" decouple

**Main Reference**
- Momentum: `applications/main/momentum_app/momentum_app.c:69`
- Xtreme: `applications/main/xtreme_app/xtreme_app.c:67`
- RogueMaster: `applications/settings/cfw_app/cfw_app.c:81`

**Why Valuable**
- These code segments are very suitable for learning "settings App does not directly transmit, it just writes control files"
- If you later make larger settings panels yourself, this is the most decent template

#### Most Worth Copying: Transmit Total Entry `subghz_txrx_tx_start()`

**Purpose**
- Learn how a `.sub` / key file enters transmit chain
- Learn when UI layer switches to radio device

**Main Reference**
- Momentum: `applications/main/subghz/helpers/subghz_txrx.c:304`

**Comparison Group**
- Unleashed: `applications/main/subghz/helpers/subghz_txrx.c:289`
- Xtreme: `applications/main/subghz/helpers/subghz_txrx.c:245`
- RogueMaster: `applications/main/subghz/helpers/subghz_txrx.c:243`

**Why Valuable**
- This is where UI layer and underlying TX truly connect
- Many "why click send no response" problems have to be traced along this chain

#### Most Worth Copying: Dispatcher `subghz_devices_start_async_tx()`

**Purpose**
- Learn how same upper layer transmit entry simultaneously supports built-in and external wireless chips
- Learn how interconnect abstraction is built

**Main Reference**
- Momentum: `lib/subghz/devices/devices.c:145`

**Why Valuable**
- It itself does not emit pulses
- But it is the master switch for "built-in CC1101 / external CC1101" switching

#### Most Worth Copying: Built-in CC1101 async TX

**Purpose**
- Learn true DMA/TIM transmit chain
- Learn why `yield()` only produces `LevelDuration`, not directly hitting GPIO

**Main Reference**
- Momentum: `lib/subghz/devices/cc1101_int/cc1101_int_interconnect.c:20`
- Momentum: `targets/f7/furi_hal/furi_hal_subghz.c:767`
- Momentum: `targets/f7/furi_hal/furi_hal_subghz.c:704`

**Why Valuable**
- This is the lowest level, most "hardcore" segment of Sub-GHz
- Once you understand here, you can explain:
  - Who is driving pulses
  - Why DMA HT/TC interrupts only responsible for refill
  - Why `RESET` represents end, `WAIT` is not

#### Most Worth Copying: `subghz_transmitter_yield()` and `LevelDuration`

**Purpose**
- Learn how protocol encoder transforms business data into pulse sequences
- Learn most critical intermediate representation between upper and lower layers

**Main Reference**
- Momentum: `lib/subghz/transmitter.c:61`
- Momentum: `lib/toolbox/level_duration.h:15`

**Why Valuable**
- It is the "contract" between all protocols and DMA/TIM transmit layer
- Don't understand here, then can't understand why async TX can reuse so many protocols

---

## Wireless Transformation Priority and Porting Roadmap

### Overall Assessment

Based on this local 4-repository source tree, **Momentum is most suitable as the wireless main baseline**.

The reason is not that it "has the most features", but that these lines are most concentrated:
- `BLE start_app`
- `serial_profile / Companion bridge`
- `FindMy / extra_beacon`
- `subghz_txrx`
- `extend_range` control plane

They are mostly still in the main tree, not scattered in a pile of external helpers.

If you want to continue extracting wireless capabilities from the other 3 in the future, recommended order is:
1. Unleashed
2. Xtreme
3. RogueMaster

This is not a ranking of "who is stronger or weaker", but a ranking of **porting risk from low to high**.

### Why Momentum is Most Suitable as Mother Version

#### BLE Main Chain Concentrated

Key entries are all in main tree:
- `furi_hal_bt_start_app()`: `targets/f7/furi_hal/furi_hal_bt.c:165`
- Companion bridge feeding RPC: `applications/services/bt/bt_service/bt.c:200`
- BLE test transmit: `applications/services/bt/bt_cli.c:44`

#### FindMy is System-Level Mount, Not Scattered External

- `findmy_startup()`: `applications/system/findmy/findmy_startup.c:9`
- `findmy_state_apply()`: `applications/system/findmy/findmy_state.c:115`

#### Sub-GHz Control Plane and Send Plane Both in Main Chain

- `subghz_txrx_tx_start()`: `applications/main/subghz/helpers/subghz_txrx.c:304`
- `subghz_devices_start_async_tx()`: `lib/subghz/devices/devices.c:145`
- `momentum_app_apply()` writes `extend_range.txt`: `applications/main/momentum_app/momentum_app.c:69`

In one sentence: **Momentum most resembles an already organized "wireless distribution skeleton".**

### Recommended Porting Order

#### First Batch: Look at Unleashed First

**Suitable to migrate first**
- `find_my_flipper`
- `namechanger`
- Small amounts of system service type enhancements

**Key Entries**
- `findmy_startup()`: `applications/system/find_my_flipper/findmy_startup.c:9`
- `findmy_state_apply()`: `applications/system/find_my_flipper/findmy_state.c:115`
- `namechanger_on_system_start()`: `applications/services/namechanger/namechanger.c:73`

**Why migrate it first**
- Like Momentum, leans toward system service / boot injection
- Didn't split similar capabilities into a pile of external apps
- BLE main chain interface generation close to Momentum

#### Second Batch: Then Look at Xtreme

**Suitable to migrate**
- `xtreme_app` settings control plane
- `subghz_extended_freq`
- Some "unified settings -> control file persistence" writing styles

**Key Entries**
- `xtreme_app_apply()`: `applications/main/xtreme_app/xtreme_app.c:14`
- `subghz_extended_freq()`: `applications/main/subghz/subghz_extended_freq.c:7`

**Why rank second**
- Its control plane philosophy is very close to Momentum
- But its BLE interface is still old generation

So Xtreme is most suitable for learning:
- How to write settings master control
- How to unify main menu/protocol switch persistence

But not suitable for "wholesale copying BLE related code".

#### Third Batch: Only Look at RogueMaster Last

**Suitable to migrate**
- Only migrate **point functions**
- Only migrate **capabilities with no upstream equivalent implementation**
- Don't wholesale move its wireless helper

**Key Entries**
- `cfw_app_apply()`: `applications/settings/cfw_app/cfw_app.c:14`
- `findmy_startup()`: `applications/external/find_my_flipper/findmy_startup.c:5`
- `namechanger_name_write()`: `applications/external/namechanger/namechanger.c:105`

**Why look last**
- Its external app pool is too large
- Similar helpers are scattered
- `setting_user` paths already show drift
- Very easy to pollute main chain while moving

### 4 Most Likely to Break Points

#### Break Point 1: `furi_hal_bt_start_app()` Signature Generation

**New Interface** (Momentum / Unleashed)

With `const GapRootSecurityKeys* root_keys`

**Old Interface** (Xtreme / RogueMaster)

Without `root_keys`

**Why this is first explosion point**

Any cross-repository moving BLE profile / service / startup code, as long as it touches:
- `gap_init`
- `profile start`
- `bt service start`

Basically will first hit this signature generation difference.

**Conclusion**: When moving BLE code from Xtreme / RogueMaster to Momentum, **first adapt HAL interface, then talk business logic**

#### Break Point 2: FindMy Mount Level

**Built-in System Type**
- Momentum: `applications/system/findmy/findmy_startup.c:9`
- Unleashed: `applications/system/find_my_flipper/findmy_startup.c:9`

**Older System Type**
- Xtreme: `applications/system/find_my_flipper/findmy_startup.c:5`

**External Type**
- RogueMaster: `applications/external/find_my_flipper/findmy_startup.c:5`

**Why it breaks**

Same `findmy_state_apply()` logic, placed in:
- system service
- startup service
- external app

Its lifecycle, mount timing, and dependency relationships are all different.

So: RogueMaster's version cannot be directly used as Momentum's system service wholesale, first need to change mount location back to system layer.

#### Break Point 3: `setting_user` vs `setting_user.txt`

**Momentum / Unleashed / Xtreme**

All lean toward: `EXT_PATH("subghz/assets/setting_user")`

**RogueMaster**

Main chain leans toward: `EXT_PATH("subghz/assets/setting_user.txt")`

But external pool also mixes:
- `setting_user`
- `setting_user.txt`
- `setting_user.pocsag`

**Why it breaks**

What you look like is porting a UI App, but actually brought along the config file naming rules. Result is:
- Main chain reads one kind
- External helper reads another kind
- User changed settings but no effect

#### Break Point 4: External Helper Drift

RogueMaster has large amounts of external apps with their own:
- `subghz_txrx`
- `subghz_signal`
- `ble_serial`

**Why it breaks**

These helpers often:
- Look very convenient
- Actually depend on their own directory structure and config naming
- May also secretly differ from main chain helper versions

**Conclusion**
- Do not move helper implementations wholesale
- Only extract "patterns"
- Maintain unified helper in main chain

### Sub-GHz Release Strategy Actually Divides into 3 Routes

#### Route A: `extend_range + ignore_default_tx_region`

This route's clearest representatives are: Momentum, RogueMaster

Key points:
- Momentum read/write: `applications/main/subghz/subghz_extended_freq.c:19`
- Momentum control plane: `applications/main/momentum_app/momentum_app.c:69`
- RogueMaster enable: `applications/main/subghz/subghz_extended_freq.c:13`
- RogueMaster control plane: `applications/settings/cfw_app/cfw_app.c:81`

#### Route B: `dangerous_frequency`

This route most clearly appears in: Unleashed

Key points:
- Status bit: `targets/f7/furi_hal/furi_hal_subghz.c:56`
- Setting function: `targets/f7/furi_hal/furi_hal_subghz.c:76`
- Check point: `targets/f7/furi_hal/furi_hal_subghz.c:397`
- UI entry: `applications/main/subghz/subghz_dangerous_freq.c:21`

#### Route C: `extended_frequency`

This route most clearly appears in: Xtreme

Key points:
- Status bit: `targets/f7/furi_hal/furi_hal_subghz.c:56`
- Setting function: `targets/f7/furi_hal/furi_hal_subghz.c:76`
- Check point: `targets/f7/furi_hal/furi_hal_subghz.c:384`
- Boot mount: `applications/main/subghz/subghz_extended_freq.c:16`

**How to actually migrate here**

Do not try to blend all three routes into a single design.

More reasonable approach:
1. In Momentum, keep its existing `extend_range + bypass` file-based control path
2. Learn HAL switch structure from Unleashed and Xtreme
3. Do not wholesale-copy their UI entries or state naming

### Truly Executable Porting Route

#### Step 1: Lock the Mainline Path First, Leave Externals Alone

Only work around Momentum's existing three mainline paths:
- BLE startup: `targets/f7/furi_hal/furi_hal_bt.c:165`
- Companion bridge: `applications/services/bt/bt_service/bt.c:200`
- Sub-GHz transmit entry: `applications/main/subghz/helpers/subghz_txrx.c:352`

In practice, first make sure:
- The mainline flow is clear
- The control path is clear
- The config file naming is clear

#### Step 2: Migrate Unleashed System Service Logic

Priority migration:
- `findmy_state`
- `namechanger`

Reasons:
- Its system layer organization is closest to Momentum
- Porting scope is small
- Don't need to first dismantle external

#### Step 3: Migrate Xtreme Control Plane Patterns

The focus is not porting BLE directly, but porting:
- The `xtreme_app_apply()` pattern of "UI option -> control-file writeback"

When migrating first do:
- BLE HAL signature adaptation
- `extended_frequency` semantic mapping

#### Step 4: Finally Pick Point Functions from RogueMaster

Rules are simple:
- Only pick functions that do not already have a clear upstream equivalent
- Only copy entry patterns, don't copy external helper wholesale
- Before migrating first unify config file naming

### One-Sentence Summary

If you later want to keep extending wireless support, the best strategy is not to merge all four at once, but:
- **Use Momentum as the base**
- **Borrow system-service logic from Unleashed**
- **Borrow settings and control-path patterns from Xtreme**
- **Take only isolated point solutions from RogueMaster**

If you remember only one sentence, remember this: **Keep Momentum's mainline intact first, then absorb patterns from the others, not the other way around.**

---

## Source Code Learning Routes

### Route 1: Full Overview (Recommended)

1. Read this chapter's "One-Sentence Conclusions" and "Essential Differences"
2. Comparative reading of Momentum and Unleashed key files
3. Check "Wireless Implementation Difference Matrix" to understand divergence points
4. Finally look at RogueMaster to understand maintenance risks

### Route 2: Wireless Main Chain (Specializing in BLE/Sub-GHz)

1. Understand BLE main chain shared by four firmware
2. Compare `furi_hal_bt_start_app()` generation differences
3. Deep dive into `extra_beacon.c` implementation
4. Learn Sub-GHz async TX mechanism
5. Check different mount methods for Find My

### Route 3: Porting and Transformation (Practice-Oriented)

1. Use Momentum as main sample
2. Use Unleashed as stable control group
3. Check Xtreme when historical context needed
4. Flip through RogueMaster's external pool for feature inspiration

---

## Maintenance Risk Assessment

| Firmware | Risk Points | Recommendations |
|----------|-------------|-----------------|
| **Momentum** | Large UI customization surface (canvas/gui/menu/loader), official upgrades may break custom hooks | Monitor official GUI layer updates |
| **Unleashed** | Lower risk, but protocol enhancements may need adjustment with official updates | Keep synchronized with official baseline |
| **Xtreme** | Archived, no continuous maintenance | Learn ideas only, don't use as baseline |
| **RogueMaster** | Mega external pool (611+), config filename divergence, difficult source tracking | Use as resource library, not as sole baseline |

---

## Key Judgment Summary

1. **Momentum is best for wireless main baseline** — systematic, clean interfaces, less external noise
2. **Unleashed is best for supplementing system services** — restrained, stable, strong protocol capabilities
3. **Xtreme is best for supplementing control plane** — historical evolution sample
4. **RogueMaster is better as feature inspiration pool** — more code doesn't mean suitable as mainline

---

## Continue Reading

- [Previous: 09. Firmware Reference 2025-2026](09-Firmware-Reference-2025.md) — Feature-level firmware comparison
- [English Master Knowledge Base](../FlipperZero-Master-EN.md) — Return to platform overview
- [Fun Apps Collection](../Apps/Fun-Apps-Collection.md) — Community app practice

[Return to English Guide](README.md) | [Previous: 09. Firmware Reference](09-Firmware-Reference-2025.md) | [Return to English Entry](../README.md)
