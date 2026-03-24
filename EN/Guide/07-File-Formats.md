# 07. File Formats

## Goal

Treat file formats as part of the platform itself, not as secondary reference material.

## Core pages

- `https://developer.flipper.net/flipperzero/doxygen/file_formats.html`
- `https://developer.flipper.net/flipperzero/doxygen/subghz_file_format.html`
- `https://developer.flipper.net/flipperzero/doxygen/nfc_file_format.html`
- `https://developer.flipper.net/flipperzero/doxygen/ibutton_file_format.html`
- `https://developer.flipper.net/flipperzero/doxygen/lfrfid_file_format.html`
- `https://developer.flipper.net/flipperzero/doxygen/badusb_file_format.html`

## Main focus

- type, version, and context fields
- `.sub` layering of header, preset, and protocol or RAW payload
- NFC shared headers and device-specific sections
- the different patterns behind `.ibtn`, `.rfid`, and BadUSB text scripts

## Expected outcome

- check the format layer first when dealing with import, export, conversion, or parsing
- understand why AI systems often fail at the format layer
