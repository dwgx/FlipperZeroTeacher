# qFlipper 全网融合总文档

> 整合官方文档、本地资料与第三方教程的完整指南
> 更新日期：2026-03-27

---

## 目录

1. [概述与定位](#1-概述与定位)
2. [安装与连接](#2-安装与连接)
3. [核心功能](#3-核心功能)
4. [CLI 命令参考](#4-cli-命令参考)
5. [更新与恢复](#5-更新与恢复)
6. [故障排除](#6-故障排除)
7. [生态对比](#7-生态对比)
8. [来源矩阵](#8-来源矩阵)

---

## 1. 概述与定位

### 1.1 什么是 qFlipper

qFlipper 是 Flipper Zero 官方推出的桌面端管理应用程序，提供图形化界面用于维护和更新 Flipper Zero 设备。

**官方定义：**
> qFlipper is a graphical desktop application for updating Flipper Zero firmware via PC. It is completely open source and based on Qt framework. Runs on Windows, macOS, Linux.

**信息来源：**
- [qFlipper GitHub](https://github.com/flipperdevices/qFlipper)
- [官方文档](https://docs.flipper.net/qflipper)

### 1.2 核心定位

| 定位 | 说明 |
|-----|------|
| 桌面端维护入口 | 长期使用和开发调试都绕不开的官方工具 |
| 固件管理 | 固件更新、数据库更新 |
| 文件管理 | 设备内部存储的文件操作 |
| 备份恢复 | Advanced controls 负责 backup/restore/reset |
| 远程控制 | 远程操作设备、截图、查看日志 |

### 1.3 更新通道

qFlipper 支持三个更新通道：

| 通道 | 说明 | 适用场景 |
|-----|------|---------|
| `release` | 正式发布版本 | 推荐大多数用户 |
| `release-candidate` | 发布候选版本 | 测试新功能 |
| `development` | 开发版本 | 开发者和高级用户 |

---

## 2. 安装与连接

### 2.1 下载与安装

**官方下载页面：** https://update.flipperzero.one/

**平台支持：**

| 平台 | 要求 | 安装方式 |
|-----|------|---------|
| Windows | Windows 10+ | MSI/EXE 安装包 |
| macOS | macOS 10.15+ | DMG 包 |
| Linux | 主流发行版 | AppImage / 包管理器 |

### 2.2 Linux 特殊配置

Linux 用户需要配置 udev 规则以普通用户身份使用 qFlipper：

```bash
# 方法1：使用 AppImage 内置规则安装
./qFlipper-x86_64-x.y.z.AppImage rules install

# 方法2：手动配置
sudo cp 50-flipper.rules /etc/udev/rules.d/
sudo udevadm control --reload-rules
```

**udev 规则内容示例：**
```
SUBSYSTEM=="usb", ATTRS{idVendor}=="0483", ATTRS{idProduct}=="df11", MODE="0660", GROUP="plugdev"
```

### 2.3 首次连接步骤

1. 使用 USB-C 数据线连接 Flipper Zero 与电脑
2. 打开 qFlipper 应用程序
3. 等待设备自动识别
4. 首次连接时可能需要确认设备

---

## 3. 核心功能

### 3.1 固件更新

| 功能 | 说明 |
|-----|------|
| 在线更新 | 自动检查并安装最新固件 |
| 离线更新 | 从本地 .dfu 或 .tgz 文件安装 |
| 数据库更新 | 更新红外、NFC 等资源数据库 |

### 3.2 文件管理

通过 qFlipper 可以：
- 浏览设备内部存储
- 上传/下载文件
- 管理 SD 卡内容
- 整理文件目录

### 3.3 备份与恢复 (Advanced Controls)

**备份 (Backup)：**
- 备份设备内部存储内容
- 保存设置、配对数据、进度

**恢复 (Restore)：**
- 从备份恢复设备状态
- 恢复设置和配对信息

**重置 (Reset)：**
- 恢复出厂设置

### 3.4 远程控制

| 功能 | 说明 |
|-----|------|
| 屏幕投射 | 实时查看设备屏幕 |
| 远程操作 | 通过电脑控制设备 |
| 截图 | 捕获设备当前界面 |
| 日志查看 | 实时查看设备日志 |

---

## 4. CLI 命令参考

qFlipper 提供命令行界面 `qFlipper-cli`，位于：
- Windows: `<Program_files_directory>\qFlipper\qFlipper-cli.exe`
- macOS: `<Applications_directory>/qFlipper.app/Contents/MacOS/qFlipper-cli`
- Linux: `<AppImage_directory>/qFlipper-x86_64-x.y.z.AppImage cli`

### 4.1 核心命令

| 命令 | 用法 | 说明 |
|-----|------|------|
| `backup` | `qFlipper-cli backup <target_dir>` | 备份内部存储 |
| `restore` | `qFlipper-cli restore <source_dir>` | 恢复内部存储 |
| `erase` | `qFlipper-cli erase` | 擦除内部存储（恢复出厂）|
| `wipe` | `qFlipper-cli wipe` | 擦除整个 MCU Flash（未实现）|
| `firmware` | `qFlipper-cli firmware <firmware_file.dfu>` | 烧录 Core1 固件 |
| `core2radio` | `qFlipper-cli core2radio <firmware_file.bin>` | 烧录 Core2 Radio 栈 |
| `core2fus` | `qFlipper-cli core2fus <firmware_file.bin> <0xaddress>` | 烧录 Core2 FUS（危险！）|

### 4.2 选项参数

| 参数 | 简写 | 说明 |
|-----|------|------|
| `--debug-level` | `-d` | 调试级别：0=仅错误，1=简洁，2=详细 |
| `--repeat-number` | `-n` | 重复操作次数，0=无限 |
| `--update-channel` | `-c` | 更新通道：release/rc/dev |
| `--version` | `-v` | 显示版本 |
| `--help` | `-h` | 显示帮助 |

### 4.3 使用示例

```bash
# 快速更新/修复（无参数运行）
./qFlipper-cli

# 备份设备
./qFlipper-cli backup /path/to/backup

# 从备份恢复
./qFlipper-cli restore /path/to/backup

# 刷入固件
./qFlipper-cli firmware flipper-firmware.dfu

# 设置为开发版通道
./qFlipper-cli -c development backup ./backup
```

---

## 5. 更新与恢复

### 5.1 固件更新流程

**在线更新：**
1. 连接设备
2. qFlipper 自动检查更新
3. 点击更新按钮
4. 等待下载和安装
5. 设备自动重启

**离线更新：**
1. 下载固件文件（.dfu 或 .tgz）
2. 点击 "Install from file"
3. 选择固件文件
4. 等待刷机完成

### 5.2 DFU 模式进入

**方法A：按键组合**
1. 关机状态下按住 BACK 键
2. 插入 USB 数据线
3. 等待屏幕显示 "DFU Mode"

**方法B：串口命令**
```
连接串口后发送: dfu
```

### 5.3 Storage Repair

当设备存储出现问题时，可通过 qFlipper 进行修复：
- 运行无参数命令触发自动修复
- 或通过 CLI 的 repair 功能

---

## 6. 故障排除

### 6.1 Linux 问题

| 问题 | 解决方案 |
|-----|---------|
| 设备未识别 | 配置 udev 规则 |
| 权限不足 | 将用户加入 plugdev 组 |
| AppImage 无法运行 | 检查 fuse 是否启用 |

```bash
# 检查设备是否被识别
lsusb | grep 0483

# 添加用户组
sudo usermod -aG plugdev $USER
```

### 6.2 Windows 问题

| 问题 | 解决方案 |
|-----|---------|
| 驱动未安装 | 运行 qFlipper 驱动安装工具 |
| 连接失败 | 检查 USB 模式设置 |
| 更新卡住 | 进入 DFU 模式重试 |

### 6.3 常见错误

| 错误 | 说明 |
|-----|------|
| Serial port not recognized | 固件问题，需更新或修复 |
| Update failed | 重新进入 DFU 模式重试 |
| Storage error | 运行 Storage repair |

### 6.4 已知问题

根据 GitHub README：
1. 有时 Flipper 的串口不被 OS 识别，导致固件更新错误（固件问题）
2. 部分系统上，日志区域开关/调整时有明显闪烁
3. GitHub 自动生成的源码压缩包不适合构建（不含子模块）

---

## 7. 生态对比

### 7.1 qFlipper vs Mobile App vs CLI

| 特性 | qFlipper | Mobile App | CLI |
|-----|----------|------------|-----|
| 连接方式 | USB | BLE | USB/串口 |
| 固件更新 | 完整 | 部分 | 完整 |
| 文件管理 | 图形化 | 有限 | 命令行 |
| 备份恢复 | 完整 | 同步 | 完整 |
| 远程控制 | 是 | 否 | 是 |
| 适用场景 | 桌面维护 | 移动场景 | 自动化/调试 |

### 7.2 项目结构

```
qFlipper/
├── application/      # 主图形应用 (QML)
├── cli/              # 命令行接口
├── backend/          # 后端库 (C++)
├── dfu/              # USB/DFU 设备访问
├── plugins/          # Protobuf 通信协议
├── 3rdparty/        # 第三方库
├── contrib/          # 社区包/脚本
├── driver-tool/      # Windows 驱动工具
├── docker/           # Docker 配置
└── installer-assets/ # 安装资源
```

---

## 8. 来源矩阵

### 官方来源

| 来源 | 类型 | 链接 |
|-----|------|------|
| qFlipper 官方页面 | 文档 | https://docs.flipper.net/qflipper |
| qFlipper GitHub | 仓库 | https://github.com/flipperdevices/qFlipper |
| qFlipper Releases | 下载 | https://github.com/flipperdevices/qFlipper/releases |
| 更新下载站 | 下载 | https://update.flipperzero.one/ |

### 本地参考文档

| 文档 | 说明 |
|-----|------|
| Official-Docs-CN-Full.md | 官方文档中文精读，含 qFlipper 章节 |
| 01-Device-Ecosystem.md | 设备生态入门 |
| 刷机指南.md | 固件刷机综合指南 |

### 相关固件项目

| 固件 | 说明 |
|-----|------|
| 官方固件 | flipperzero-firmware |
| Momentum | https://github.com/Next-Flip/Momentum-Firmware |
| Unleashed | https://github.com/DarkFlippers/unleashed-firmware |

---

## 附录

### A. 构建从源码

**克隆：**
```bash
git clone https://github.com/flipperdevices/qFlipper.git --recursive
```

**Windows:**
- MS Visual Studio 2019+
- Qt5 >= 5.15.0 或 Qt6 >= 6.3.0
- NSIS

**Linux:**
```bash
# 依赖
sudo apt install qtbase5-dev qtbase5-dev-tools libqt5serialport5-dev libusb-1.0-dev zlib1g-dev

# 构建
mkdir build && cd build
qmake ../qFlipper.pro
make
```

**macOS:**
- Xcode/Command Line Tools
- Qt6 6.3.1 (通过 Flipper brew tap)
- libusb 1.0.24

### B. 相关链接

- [Flipper Zero 官网](https://flipperzero.one/)
- [官方文档](https://docs.flipper.net/)
- [Doxygen 文档](https://developer.flipper.net/)
- [应用商店](https://flipc.org/)

---

*本文档基于官方资料和本地知识库整合，持续更新中。*