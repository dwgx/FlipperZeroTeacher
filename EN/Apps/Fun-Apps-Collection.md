# Flipper Zero Fun Apps Collection

> Curated fun, prank, and utility apps from official catalog and community
> Based on official Catalog (336 apps) + community projects
> Updated: 2026-03-27

---

## Table of Contents

- [Bluetooth/BLE](#1-bluetoothble)
- [USB Tools](#2-usb-tools)
- [Classic Games](#3-classic-games)
- [Creative Tools](#4-creative-tools)
- [Prank Tools](#5-prank-tools)
- [GPIO Peripherals](#6-gpio-peripherals)
- [Multimedia](#7-multimedia)
- [Security/Crypto](#8-securitycrypto)
- [Utility Tools](#9-utility-tools)
- [Installation Guide](#installation-guide)
- [Quick Index](#quick-index)

---

## Official App Catalog

Official store: https://catalog.flipperzero.one/

Total apps: 336 (as of 2026-03-24)

Categories:
- Bluetooth: 11
- GPIO: 130+
- Games: 80+
- Infrared: 30+
- NFC: 25+
- Sub-GHz: 20+
- Tools: 40+
- USB: 15+

---

## 1. Bluetooth/BLE

### 1.1 FindMyFlipper ⭐ Popular

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Bluetooth/findmy |
| **GitHub** | https://github.com/MatthewKuKanich/FindMyFlipper |
| **Author** | @MatthewKuKanich |
| **Version** | v3.0 |

**Description**

Turn your Flipper Zero into an AirTag. Trackable on:
- Apple Find My network
- Samsung SmartThings Find
- Tile network

**Usage**
- Put Flipper in your bag as a tracker
- Test Find My network coverage
- Learn how AirTags work

---

### 1.2 BLE Spam (ble_spam_ofw)

| Attribute | Details |
|-----------|---------|
| **Source** | Community |
| **GitHub** | https://github.com/noproto/ble_spam_ofw |
| **Catalog** | ❌ Not listed (may violate policies) |
| **Firmware** | Official |

**Description**

Send BLE broadcast packets to trigger pairing popups:
- Apple devices: AirPods / AirTag / Apple TV popups
- Android: Fast Pair popups
- Windows: Swift Pair popups

**Technical Principle**

Sends forged BLE advertisement packets, making nearby devices think new AirPods are nearby.

**Note**: For educational purposes only. May cause issues in public spaces.

---

### 1.3 HID BLE (Bluetooth Keyboard/Mouse)

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Bluetooth/hid_ble |
| **Features** | BT keyboard, mouse, media controller |

**Modes**

| Mode | Description |
|------|-------------|
| Keyboard | Full BT keyboard with modifiers |
| Mouse | BT mouse control |
| Media | Media playback control |
| Mouse Jiggler | BT mouse movement (anti-sleep) |
| Stealth Jiggler | Random movement patterns |

---

## 2. USB Tools

### 2.1 Mouse Jiggler ⭐ Useful

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/USB/mouse_jiggler |
| **GitHub** | https://github.com/DavidBerdik/flipper-mouse-jiggler |
| **Author** | @DavidBerdik |

**Description**

Prevents computer sleep by simulating mouse movement.

**Features**
- Random movement patterns
- Harder to detect
- Adjustable frequency

**Usage**
- Remote work presence
- Prevent meeting screen lock
- Keep downloads active

---

### 2.2 Barcode Scanner Emulator

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/USB/bc_scanner |
| **GitHub** | https://github.com/polarikus/flipper-zero_bc_scanner_emulator |
| **Author** | @polarikus |

**Description**

Emulates USB barcode scanner. Auto-inputs barcode when plugged in.

**Features**
- Custom barcode data
- Multiple formats
- POS system testing

---

### 2.3 LD Toypad Emulator

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/USB/ldtoypad |
| **GitHub** | https://github.com/SegerEnd/Flipper-Zero-LD-Toypad-Emulator |
| **Author** | @SegerEnd |

**Description**

Emulates Lego Dimensions ToyPad USB device.

**Features**
- Place virtual minifigs
- Unlock game characters
- No physical ToyPad needed

---

## 3. Classic Games

### 3.1 Tetris

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Games/tetris |
| **Original** | @jeffplang |
| **Maintainer** | @xMasterX |

**Controls**
- D-pad: Move
- OK: Rotate
- Back: Pause

---

### 3.2 Flappy Bird

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Games/flappy_bird |
| **Original** | @DroomOne |
| **Maintainer** | @xMasterX |

---

### 3.3 Doom

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Games/doom |
| **GitHub** | https://github.com/p4nic4ttack/doom-flipper-zero |
| **Maintainers** | @xMasterX @Svarich @hedger |
| **Version** | v1.5 |

**Note**: Doom-like clone, not full Doom.

---

### 3.4 Asteroids

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Games/asteroids |
| **GitHub** | https://github.com/SimplyMinimal/FlipperZero-Asteroids |
| **Author** | @SimplyMinimal |
| **Version** | v3.4.0 |

**Features**
- Auto-fire
- Power-up system
- High scores
- Haptic feedback
- LED effects
- Pause function
- Reverse thrusters

---

### 3.5 Arkanoid

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Games/arkanoid |
| **Original** | @gotnull |
| **Maintainer** | @xMasterX |

---

### 3.6 Chess

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Games/chess |
| **GitHub** | https://github.com/xtruan/flipper-chess |
| **Author** | @xtruan |
| **Version** | v1.12 |

**Features**
- Full chess rules
- AI opponent
- Illegal move bug fixed

---

### 3.7 Minesweeper

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Games/minesweeper_redux |
| **GitHub** | https://github.com/squee72564/F0_Minesweeper_Fap |
| **Author** | Alexander Rodriguez |

---

### 3.8 Flipper Hero

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Games/flipper_hero |
| **GitHub** | https://github.com/mentoster/flipper-hero |
| **Author** | @mentoster |

**Type**: Rhythm game like Guitar Hero

---

### 3.9 Five Nights at Flipper's (FNAF)

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Games/flipperzero_fnaf |
| **GitHub** | https://github.com/sillygir1/flipperzero-fnaf |
| **Author** | @sillygir1 |

**Type**: Horror survival FNAF fan game

---

### 3.10 More Games

| Game | Type | Description |
|------|------|-------------|
| 2048 | Puzzle | Classic 2048 |
| Wolfenduino | FPS | Wolfenstein 3D port |
| Scorched Tanks | Strategy | Tank battle game |
| Roots of Life | Puzzle | Zen puzzle game |
| City Bloxx | Building | Stack building blocks |
| ZombieZ | Tower Defense | Zombie defense |
| Snake | Classic | Classic snake |
| T-Rex Runner | Runner | Chrome dinosaur game |
| Color Guess | Memory | Color memory game |
| Game 15 | Puzzle | 15-puzzle |
| Hanoi Towers | Puzzle | Tower of Hanoi |
| Laser Tag | Action | Laser gun battle |
| Mandelbrot Set | Demo | Fractal visualization |
| Paint | Drawing | Pixel paint app |
| Pinball | Arcade | Pinball game |
| Slot Machine | Random | Slot machine |
| Tic Tac Toe | Strategy | Tic-tac-toe |

---

## 4. Creative Tools

### 4.1 Theme Manager

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Tools/theme_manager |
| **GitHub** | https://github.com/Hoasker/flipper-theme-manager.git |
| **Author** | @Hoasker |

**Description**

Manage dolphin animation themes from SD card.

**Features**
- Switch themes
- Preview effects
- No firmware flash needed

---

### 4.2 Analog Clock

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Tools/analog_clock |
| **Author** | @scrolltex |
| **Maintainer** | @xMasterX |

---

### 4.3 Pomodoro Timer

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Tools/pomodoro_timer |
| **GitHub** | https://github.com/Th3Un1q3/flipp_pomodoro |

**Description**

Pomodoro technique timer.

**Features**
- 25 min work + 5 min break
- Cycle counter
- Sound alerts

---

## 5. Prank Tools

### 5.1 Executor Keychain (80s Keychain)

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Media/executor_keychain |
| **GitHub** | https://github.com/EstebanFuentealba/Flipper-Keyller.git |
| **Author** | Esteban Fuentealba |
| **Name** | Flipper Keyller |
| **Version** | 0.1 |

**Description**

Emulates classic 80s electronic keychain sounds.

**Sound Effects**
- Unlock sound
- Alarm sound
- Laser gun sound
- Classic 8-bit effects

**Usage**
- Retro nostalgia
- Prank sound effects
- Speaker testing

---

### 5.2 DCF77 Clock Spoof

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Tools/dcf77_clock_spoof |
| **GitHub** | https://github.com/molodos/dcf77-clock-spoof.git |
| **Author** | @Molodos |

**Description**

Spoof DCF77 time signal via RFID antenna and A4 GPIO.

**Technical**

DCF77 is Germany's longwave time signal. This app sends forged signals to make nearby radio clocks sync to your chosen time.

---

### 5.3 Fire String

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Tools/fire_string |
| **GitHub** | https://github.com/RyanAboueljoud/Fire-String.git |

**Description**

Screen visual effect simulating fire strings.

---

### 5.4 Flipper95

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Tools/flipper95 |
| **GitHub** | https://github.com/CookiePLMonster/flipper-bakery.git |

**Description**

Windows 95 style interface simulator.

**Features**
- Retro Win95 UI
- Start menu
- Window management
- Classic sounds

---

### 5.5 Orgasmotron

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Tools/orgasmotron |
| **GitHub** | https://github.com/leedave/Leeds-Flipper-Zero-Applications |
| **Author** | Leedave |

**Description**

Vibration motor test tool (name is a joke).

---

## 6. GPIO Peripherals

### 6.1 Camera Suite (ESP32-CAM) ⭐ Popular

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/GPIO/camera_suite |
| **GitHub** | https://github.com/CodyTolene/Flipper-Zero-Camera-Suite.git |
| **Authors** | @CodyTolene @Z4urce @leedave @rnadyrshin |

**Description**

Connect ESP32-CAM module to Flipper Zero for camera functionality.

**Features**
- Live preview
- Photo capture to SD
- Grayscale/color modes
- Settings adjustment

**Hardware Required**
- ESP32-CAM module
- GPIO cables

---

### 6.2 Flipagotchi

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/GPIO/flipagotchi |
| **GitHub** | https://github.com/Matt-London/pwnagotchi-flipper.git |
| **Author** | @Matt-London |

**Description**

Display interface for Pwnagotchi AI.

---

### 6.3 FlipWeather

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/GPIO/flip_weather |
| **GitHub** | https://github.com/jblanked/FlipWeather.git |
| **Author** | @JBlanked |
| **Version** | 1.2 |

**Description**

Get GPS and weather via WiFi.

**Hardware Required**
- ESP8266/ESP32 WiFi module

---

## 7. Multimedia

### 7.1 Tuning Fork

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Media/tuning_fork |
| **GitHub** | https://github.com/besya/flipperzero-tuning-fork.git |
| **Author** | @besya |
| **Version** | 2.1 |

**Description**

Use Flipper as a tuning fork.

**Features**
- Multiple standard pitches
- 440Hz A reference
- Guitar tuning mode
- Continuous tone

---

### 7.2 Ocarina

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Media/ocarina |
| **Original** | @invalidna-me |
| **Version** | v1.3 |

**Description**

Ocarina simulator from Zelda: Ocarina of Time.

**Features**
- Full octave range
- Same controls as N64 version
- Play classic songs

---

### 7.3 BPM Tapper

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Media/bpm_tapper |
| **Original** | @panki27 |
| **Version** | v1.3 |

**Description**

Tap center button to measure BPM.

---

## 8. Security/Crypto

### 8.1 Enigma

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Tools/enigma |
| **GitHub** | https://github.com/xtruan/flipper-enigma.git |
| **Author** | @xtruan |
| **Version** | v1.1 |

**Description**

WWII German Enigma machine simulator.

**Features**
- Full rotor system
- 8 rotor types
- Plugboard settings
- Historical crypto experience

---

## 9. Utility Tools

### 9.1 Calculator

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Tools/calculator |

---

### 9.2 QR Code Generator

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Tools/qrcode_generator |

---

### 9.3 Hex Viewer

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Tools/hex_viewer |

---

### 9.4 Text Viewer

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Tools/text_viewer |

---

## Installation Guide

### Method 1: Official Catalog (Recommended)

1. Ensure latest firmware
2. Go to **Apps** → **Flipper Lab**
3. Browse or search
4. Click install

### Method 2: qFlipper

1. Download `.fap` from GitHub Release
2. Connect Flipper to PC
3. Open qFlipper
4. Copy `.fap` to `/apps/` folder
5. Run from **Apps** menu

### Method 3: Momentum Firmware

Momentum includes many apps built-in:
- Find My / Bad KB / BLE Spam
- Mouse Jiggler
- Games
- Tools

### Method 4: Compile from Source

```bash
# Clone repo
git clone <repo-url>
cd <repo>

# Build with uFBT
ufbt

# .fap file in dist/ folder
```

---

## Quick Index

### By Category

**Games (30+)**
Tetris, Flappy Bird, Doom, Asteroids, Arkanoid, Chess, Minesweeper, Flipper Hero, FNAF, Wolfenduino, Scorched Tanks, ZombieZ, 2048, Snake, and more.

**Bluetooth (6)**
FindMyFlipper, BLE Spam, HID BLE, BT Trigger, BTHome, PC Monitor

**USB (6)**
Mouse Jiggler, Barcode Scanner, LD Toypad, USB HID Autofire, COM Port Scanner, XInput Controller

**GPIO (6+)**
Camera Suite, Flipagotchi, FlipWeather, Servo Tester, Flashlight, Air Mouse

**Media (8+)**
Tuning Fork, Ocarina, BPM Tapper, Music Player, Metronome, Morse Code, WAV Player, DVD Screensaver

**Security (6)**
Enigma, Password Generator, Caesar Cipher, ROT13, Roman Decoder, Flip Crypt

**Prank (5)**
Executor Keychain, DCF77 Clock Spoof, Fire String, Flipper95, BLE Spam

---

## Resources

- [Official Catalog](https://catalog.flipperzero.one/)
- [Flipper Lab](https://lab.flipper.net/)
- [awesome-flipperzero](https://github.com/djsime1/awesome-flipperzero)
- [xMasterX/all-the-plugins](https://github.com/xMasterX/all-the-plugins)

---

## Changelog

- 2026-03-27: Initial release, curated from 336 official catalog apps + community projects

---

*Document based on official Catalog and community resources. For educational purposes only.*