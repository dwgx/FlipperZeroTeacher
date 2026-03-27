# Flipper Zero Fun Apps Collection

> Flipper Zero is not just a security tool. It's a toy, a learning platform, and an entry point to explore the wireless world.
> Based on official Catalog (336 apps) + community projects
> Updated: 2026-03-27

---

## What is this?

The official Flipper Zero app catalog has 336 apps, and the community has countless weird projects. This document picks out the most interesting, useful, and worth-playing ones.

**What you'll find here:**
- **BLE Toys** — AirPods popups, AirTag simulation, use as Bluetooth keyboard
- **USB Tools** — Make mouse move by itself, simulate barcode scanner, act as Lego ToyPad
- **Classic Games** — Doom, Tetris, Wolfenstein, Asteroids
- **Hardware Extensions** — Connect ESP32-CAM as camera, check weather, control servos
- **Music Tools** — Ocarina of Time, metronome, tuning fork
- **Crypto Toys** — WWII Enigma machine, password generator

**Bottom line: Have fun, learn something.**

---

## Table of Contents

- [Bluetooth/BLE](#1-bluetoothble)
- [USB Tools](#2-usb-tools)
- [Classic Games](#3-classic-games)
- [Creative Tools](#4-creative-tools)
- [GPIO Peripherals](#5-gpio-peripherals)
- [Multimedia](#6-multimedia)
- [Security/Crypto](#7-securitycrypto)
- [Utility Tools](#8-utility-tools)
- [Installation Guide](#installation-guide)
- [Quick Index](#quick-index)

---

## 1. Bluetooth/BLE

### 1.1 FindMyFlipper ⭐ Popular

| Attribute | Details |
|-----------|---------|
| **Source** | Community |
| **GitHub** | https://github.com/MatthewKuKanich/FindMyFlipper |
| **Catalog** | ✅ applications/Bluetooth/findmy |
| **Author** | @MatthewKuKanich |
| **Version** | v3.0 |

**What does it do?**

Turn your Flipper Zero into an AirTag. Throw it in your bag, then see it on iPhone's Find My.

**Supported networks:**
- Apple Find My
- Samsung SmartThings Find
- Tile network

**How to play:**
- Use Flipper as a tracker in your bag
- Test Find My network coverage
- Study how AirTags work (broadcast format, encryption)

**Install:**
```bash
Apps > Bluetooth > FindMy
```

---

### 1.2 BLE Spam 🔥 The Wild One

| Attribute | Details |
|-----------|---------|
| **Source** | Community |
| **GitHub** | https://github.com/noproto/ble_spam_ofw |
| **Catalog** | ❌ Not listed (too wild) |
| **Firmware** | Official |

**What does it do?**

Spam BLE broadcast packets, making nearby devices think there are new AirPods/AirTag/Apple TV nearby.

**Effects:**
- iPhone: "AirPods Pro" pairing popup
- Android: Fast Pair popup
- Windows: Swift Pair popup

**Technical Principle:**

BLE devices constantly broadcast their presence. Your phone scans these broadcasts. This tool forges AirPods broadcast packets, tricking phones into thinking new headphones are nearby.

**Learning value:**
- BLE GAP protocol
- Broadcast packet structure (AD Structure)
- Device pairing flow
- Wireless protocol openness

**How to use:**

Test on your own devices, see how BLE broadcasting works. Once you understand it, you'll also understand how AirTags can be tracked by Find My network.

**Note:**

Flipper official didn't include this because it can cause interference. Learn the tech, play in controlled environments, don't mess around in public places.

---

### 1.3 HID BLE (Bluetooth Keyboard/Mouse)

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Bluetooth/hid_ble |
| **Features** | BT keyboard, mouse, media controller |

**Functions:**

| Mode | Description |
|------|-------------|
| Keyboard | Full Bluetooth keyboard |
| Mouse | Bluetooth mouse |
| Media | Media playback control |
| Mouse Jiggler | Automatic mouse movement |
| Stealth Jiggler | Random movement patterns |

**How to play:**
- Use phone/tablet as computer, Flipper as keyboard
- Remote control presentation slides
- Study Bluetooth HID protocol

---

## 2. USB Tools

### 2.1 Mouse Jiggler ⭐ The Classic

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/USB/mouse_jiggler |
| **GitHub** | https://github.com/DavidBerdik/flipper-mouse-jiggler |
| **Author** | @DavidBerdik |

**What does it do?**

Make mouse move slightly to prevent computer from sleeping or locking.

**Core mechanism:**
- Simulates USB HID mouse device
- Sends tiny mouse movements (few pixels)
- Random patterns (harder to detect)
- Adjustable frequency and amplitude

**Use cases:**
- Keep computer active during long downloads
- Keep scripts running continuously
- Stay online during remote meetings
- When monitoring software tracks activity

**Technical points:**

USB HID protocol. Flipper registers as a USB mouse, constantly reporting "mouse moved". OS thinks user is active, won't lock screen.

**Install:**
```
Apps > USB > Mouse Jiggler
```

---

### 2.2 Barcode Scanner Emulator

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/USB/bc_scanner |
| **GitHub** | https://github.com/polarikus/flipper-zero_bc_scanner_emulator |
| **Author** | @polarikus |

**What does it do?**

Simulates USB barcode scanner. When plugged in, it inputs barcode data like a real scanner.

**How it works:**

Flipper registers as USB HID keyboard device. When you "scan" a barcode, it converts barcode content to keystroke sequences sent to the computer.

**Use cases:**
- Test your own POS system
- Automate test data input
- Study barcode scanning tech
- Debug without physical scanner

**Technical points:**
- USB HID protocol
- Barcode formats (Code128, EAN, UPC)
- POS system data input flow

---

### 2.3 LD Toypad Emulator

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/USB/ldtoypad |
| **GitHub** | https://github.com/SegerEnd/Flipper-Zero-LD-Toypad-Emulator |
| **Author** | @SegerEnd |

**What does it do?**

Simulates Lego Dimensions ToyPad. ToyPad is a USB device where placing physical Lego figures unlocks game characters.

**Technical points:**
- USB device enumeration
- Specific hardware protocol reverse engineering
- HID report descriptors

**How to play:**
- Unlock game characters (you know what I mean)
- Study how gaming peripherals work
- Learn USB device simulation

---

## 3. Classic Games

### 3.1 Doom

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Games/doom |
| **GitHub** | https://github.com/p4nic4ttack/doom-flipper-zero |
| **Version** | v1.5 |

Doom-like game, not full Doom, simplified clone. But playing FPS on Flipper's tiny screen is a unique experience.

---

### 3.2 Tetris

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Games/tetris |
| **Original** | @jeffplang |
| **Maintainer** | @xMasterX |

**Controls:**
- D-pad: Move
- OK: Rotate
- Back: Pause

---

### 3.3 Flappy Bird

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Games/flappy_bird |
| **Original** | @DroomOne |

Classic Flappy Bird ported to Flipper.

---

### 3.4 Asteroids

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Games/asteroids |
| **GitHub** | https://github.com/SimplyMinimal/FlipperZero-Asteroids |
| **Author** | @SimplyMinimal |
| **Version** | v3.4.0 |

**Features:**
- Auto-fire
- Power-up system
- High scores
- Haptic feedback
- LED effects
- Pause function
- Reverse thrusters

---

### 3.5 Chess

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Games/chess |
| **GitHub** | https://github.com/xtruan/flipper-chess |
| **Author** | @xtruan |
| **Version** | v1.12 |

Full chess rules with AI opponent.

---

### 3.6 Minesweeper

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Games/minesweeper_redux |
| **GitHub** | https://github.com/squee72564/F0_Minesweeper_Fap |

Classic Minesweeper.

---

### 3.7 Wolfenduino

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Games/wolfenduino |
| **GitHub** | https://github.com/apfxtech/FlipperWolfenstein.git |
| **Author** | @apfxtech |

Wolfenstein 3D port for Flipper, based on Arduboy FX version. First-person shooter with simplified 3D rendering.

---

### 3.8 Scorched Tanks

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Games/scorched_tanks |
| **Author** | @jasniec |
| **Version** | v1.4 |

Turn-based tank battle, adjustable angle and power, terrain destruction.

---

### 3.9 ZombieZ

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Games/zombiez |
| **Original** | @Dooskington |
| **Maintainer** | @DevMilanIan & @xMasterX |
| **Version** | v1.3 |

Tower defense game, build defenses against zombie waves.

---

### 3.10 More Games

| Game | Type |
|------|------|
| 2048 | Puzzle |
| Arkanoid | Brick breaker |
| City Bloxx | Stacking |
| Color Guess | Memory |
| Dice App | Dice roller |
| Flipper Hero | Rhythm |
| FNAF | Horror survival |
| Game 15 | 15-puzzle |
| Hanoi Towers | Puzzle |
| Laser Tag | Action |
| Mandelbrot Set | Visualization |
| Paint | Drawing |
| Pinball | Arcade |
| Roots of Life | Zen puzzle |
| Snake | Classic |
| Space Impact | Shooter |
| T-Rex Runner | Runner |
| Tic Tac Toe | Strategy |

---

## 4. Creative Tools

### 4.1 Theme Manager

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Tools/theme_manager |
| **GitHub** | https://github.com/Hoasker/flipper-theme-manager.git |
| **Author** | @Hoasker |

Manage dolphin animation themes from SD card.

---

### 4.2 Analog Clock

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Tools/analog_clock |
| **Author** | @scrolltex |

Show analog clock on Flipper screen.

---

### 4.3 Pomodoro Timer

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Tools/pomodoro_timer |
| **GitHub** | https://github.com/Th3Un1q3/flipp_pomodoro |

Pomodoro technique timer. 25 min work + 5 min break.

---

## 5. GPIO Peripherals

### 5.1 Camera Suite (ESP32-CAM) ⭐ Popular

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/GPIO/camera_suite |
| **GitHub** | https://github.com/CodyTolene/Flipper-Zero-Camera-Suite.git |
| **Author** | @CodyTolene et al. |

**What does it do?**

Connect ESP32-CAM module to Flipper Zero, turn it into a camera.

**Features:**
- Live preview
- Photo capture to SD card
- Grayscale/color modes
- Settings adjustment

**Hardware:**
- ESP32-CAM module (~$2 on Taobao/AliExpress)
- GPIO cables

**Technical points:**
- ESP32 camera driver
- Serial communication protocol
- Image data transmission

---

### 5.2 Flipagotchi

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/GPIO/flipagotchi |
| **GitHub** | https://github.com/Matt-London/pwnagotchi-flipper.git |
| **Author** | @Matt-London |

Display interface for Pwnagotchi (WiFi handshake capture AI).

---

### 5.3 FlipWeather

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/GPIO/flip_weather |
| **GitHub** | https://github.com/jblanked/FlipWeather.git |
| **Author** | @JBlanked |
| **Version** | 1.2 |

Get GPS and weather info via WiFi module.

**Hardware:** ESP8266/ESP32 WiFi module

---

### 5.4 Servo Tester

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/GPIO/servotester |

Test and calibrate servos, control servo angles.

---

### 5.5 Air Mouse

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/GPIO/air_mouse |

Use MPU6050 gyroscope module to control mouse, gesture operation.

---

## 6. Multimedia

### 6.1 Tuning Fork

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Media/tuning_fork |
| **GitHub** | https://github.com/besya/flipperzero-tuning-fork.git |
| **Author** | @besya |
| **Version** | 2.1 |

Use Flipper as a tuning fork. 440Hz A standard, guitar tuning mode.

---

### 6.2 Ocarina

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Media/ocarina |
| **Original** | @invalidna-me |
| **Version** | v1.3 |

Ocarina of Time from Zelda. Full octave range, same controls as N64 version.

**Controls:** D-pad + OK to play

---

### 6.3 BPM Tapper

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Media/bpm_tapper |
| **Original** | @panki27 |

Tap center button to measure BPM. For music practice and DJing.

---

### 6.4 Music Player

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Media/music_player |

Play RTTTL format music.

---

### 6.5 Metronome

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Media/metronome |

Professional metronome, adjustable BPM, different time signatures.

---

### 6.6 Morse Code

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Media/morse_code |

Learn and send Morse code. Study telegraph communication.

---

### 6.7 DVD Screensaver

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Media/dvd_screensaver |

Classic DVD bouncing logo screensaver. Wait for it to hit the corner.

---

## 7. Security/Crypto

### 7.1 Enigma

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Tools/enigma |
| **GitHub** | https://github.com/xtruan/flipper-enigma.git |
| **Author** | @xtruan |
| **Version** | v1.1 |

WWII German Enigma machine simulator. Full rotor system, 8 rotor types, plugboard settings.

**Learning value:** Cryptography history, symmetric encryption principles, mechanical cipher machines.

---

### 7.2 Password Generator

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Tools/passgen |

Strong password generator.

---

### 7.3 Caesar Cipher

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Tools/caesar_cipher |

Caesar cipher encryption/decryption. Oldest substitution cipher.

---

### 7.4 ROT13

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Tools/rot13_app |

ROT13 encoding conversion.

---

### 7.5 Flip Crypt

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Tools/flip_crypt |
| **GitHub** | https://github.com/Tyl3rA/FlipCrypt.git |
| **Author** | @Tyl3rA |

File encryption tool, password-protect files.

---

## 8. Utility Tools

### 8.1 Calculator

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Tools/calculator |

Scientific calculator.

---

### 8.2 QR Code Generator

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Tools/qrcode_generator |

Generate QR codes on Flipper screen.

---

### 8.3 Hex Viewer

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Tools/hex_viewer |

View file hex content. Essential for reverse engineering.

---

### 8.4 DCF77 Clock Spoof

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Tools/dcf77_clock_spoof |
| **GitHub** | https://github.com/molodos/dcf77-clock-spoof.git |
| **Author** | @Molodos |

**What does it do?**

Forge DCF77 time signal. DCF77 is Germany's longwave time signal transmitter. European radio clocks sync to it. This tool sends forged signals to make nearby radio clocks sync to your chosen time.

**Technical points:**
- Longwave time signal protocol
- RF signal modulation
- RFID antenna as transmitter

**How to play:**
- Test radio clocks
- Study time sync protocols
- Learn about radio time systems

---

### 8.5 Flipper95

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Tools/flipper95 |
| **GitHub** | https://github.com/CookiePLMonster/flipper-bakery.git |

Windows 95 style interface simulator. Retro Win95 UI, start menu, window management.

---

### 8.6 Executor Keychain

| Attribute | Details |
|-----------|---------|
| **Source** | Official Catalog |
| **Catalog** | ✅ applications/Media/executor_keychain |
| **GitHub** | https://github.com/EstebanFuentealba/Flipper-Keyller.git |
| **Author** | Esteban Fuentealba |

Simulates 80s electronic keychain sound effects. Unlock sound, alarm sound, laser gun sound.

---

## Installation Guide

### Method 1: Official Catalog (Easiest)

1. Make sure Flipper has latest firmware
2. Apps → Flipper Lab
3. Search for the app
4. Click install

### Method 2: qFlipper

1. Download `.fap` from GitHub Release
2. Connect Flipper to computer
3. Open qFlipper
4. Drag `.fap` to SD card `/apps/` folder
5. On Flipper: Apps → find and run

### Method 3: Momentum Firmware (Pre-installed)

Momentum firmware already has many apps built-in:
- Find My / Bad KB / BLE Spam
- Mouse Jiggler
- Various games and tools

### Method 4: Compile Yourself

```bash
# Clone repo
git clone <repo-url>
cd <repo>

# Compile
ufbt

# .fap file in dist/ folder
```

---

## Quick Index

### By Category

| Category | Count | Representative Apps |
|----------|-------|---------------------|
| Bluetooth/BLE | 6 | FindMyFlipper, BLE Spam, HID BLE |
| USB Tools | 6 | Mouse Jiggler, Barcode Scanner, LD Toypad |
| Games | 30+ | Doom, Tetris, Wolfenduino, Chess |
| GPIO Peripherals | 6 | Camera Suite, FlipWeather, Air Mouse |
| Multimedia | 8 | Tuning Fork, Ocarina, BPM Tapper |
| Security/Crypto | 6 | Enigma, Password Generator, Flip Crypt |
| Utility | 10 | Calculator, QR Code, DCF77 Spoof |

### Filter by Function

**Want to play with radio?**
- Sub-GHz apps (check FlipperZero resources)
- DCF77 Clock Spoof

**Want to mess with Bluetooth?**
- FindMyFlipper
- BLE Spam
- HID BLE

**Want to play games?**
- Doom, Tetris, Wolfenduino, Chess
- 30+ games to choose from

**Want to connect hardware?**
- Camera Suite (camera)
- FlipWeather (WiFi)
- Servo Tester (servos)

**Want to learn crypto?**
- Enigma (WWII cipher machine)
- Caesar Cipher
- Flip Crypt

---

## Resources

- **Official Catalog**: https://catalog.flipperzero.one/
- **Flipper Lab**: https://lab.flipper.net/
- **Community Plugins**: https://github.com/xMasterX/all-the-plugins
- **Awesome Flipper**: https://github.com/djsime1/awesome-flipperzero

---

## Changelog

- 2026-03-27: Initial release, 80+ curated apps

---

**Have fun, learn something.**