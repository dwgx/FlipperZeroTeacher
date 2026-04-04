# Flipper Zero 常见问题排查

> 最后更新：2026-04-05
> 约定：每条 Q&A 给出「症状 → 原因 → 解决」三段式

---

## 1. 连接与 qFlipper

### Q1.1 qFlipper 找不到设备 / COM 端口被占用
- **症状**：qFlipper 显示 "No device connected"，Windows 设备管理器里有设备
- **原因**：其他程序占用串口（PuTTY、Arduino IDE、Serial Monitor、脚本未释放）
- **解决**：关闭所有占用程序；`py scripts/flipper_bridge.py reboot` 软重启；最后手段拔插 USB

### Q1.2 Windows 装不上驱动
- **症状**：设备管理器显示黄色感叹号
- **原因**：STM32 VCP 驱动未装
- **解决**：Flipper Zero 使用 CDC，Win10/11 原生支持。拔插换 USB 口试试；必要时安装 STM32 VCP 驱动

### Q1.3 macOS 连接后掉线
- **原因**：USB 线材不稳定或 Hub 供电不足
- **解决**：直连电脑 USB 口，换 C 口 → C 口数据线

---

## 2. 固件与启动

### Q2.1 Bootloop（一直卡 Flipper Logo）
- **原因**：SD 卡故障 / 固件文件损坏 / 关键 system 文件缺失
- **解决**：
  1. 取出 SD 卡，看是否能进系统 → 如果能，SD 卡问题（格式化为 FAT32/exFAT）
  2. 进入 DFU 模式：按住 LEFT + BACK 启动 → 用 qFlipper 恢复官方固件
  3. 恢复出厂：Settings → System → Factory Reset

### Q2.2 固件升级失败 "Storage full"
- **原因**：内部存储空间不够（不是 SD 卡，是 MCU 内置 flash）
- **解决**：卸载不必要的 `.fap` 应用；OTA 升级改用 qFlipper 连线升级

### Q2.3 切换固件后 SD 卡数据丢失
- **现象**：换 Momentum/Xtreme 后 subghz/nfc 数据消失
- **原因**：没丢，只是路径结构不一样
- **解决**：数据还在 `/ext/*` 下，查看是否被移到 `assets_user/` 子目录

---

## 3. Sub-GHz

### Q3.1 `TX is blocked in your region`
- **症状**：发送信号时报错
- **原因**：固件判定所在区域不允许该频率发射
- **解决**：
  - 官方固件：`/ext/subghz/assets/setting_user.txt` 设置 `Add_standard_frequencies: true`
  - 更彻底：刷 Momentum / Xtreme / Unleashed，它们默认解锁全频段
  - **法律提醒**：解锁不等于合法使用，确认自己处在允许的 ISM 频段内

### Q3.2 滚码遥控器（车库门 / 车钥匙）复制后失效
- **原因**：这是**安全特性**，不是 bug。滚码每次使用递增计数器，复制的是旧值
- **解决**：滚码**设计上不可复制**，只能做到单次重放（有时也会被原遥控器打废）
- **合法用途**：只能用于自己的车/车库，且要接受可能把原遥控器踢出同步

### Q3.3 接收到信号但发射没反应
- **原因**：信号是 raw，录制时频率不对；或目标设备在 433.92 外的频段
- **解决**：确认频率（Frequency Analyzer 先扫一遍），调试模式看 RSSI

---

## 4. NFC

### Q4.1 MFC 读卡一直卡在 "Reading... 0/64"
- **原因**：默认字典里没有该卡的密钥
- **解决**：
  1. 搞一份用户字典：`/ext/nfc/mf_classic_dict_user.nfc`
  2. 从公开收集的 dict（Unleashed / Xtreme / Momentum 自带）合并
  3. 还读不出 → 用 MFKey32 攻击（需要读写器交互）

### Q4.2 DESFire 显示 "UID only"
- **原因**：DESFire 用 AES/3DES，无密钥情况下 Flipper 只能读 UID
- **解决**：获取密钥（几乎不可能逆向）；或仅复制 UID（对 UID-only 的门禁有效）

### Q4.3 Emulate 后读卡器不识别
- **症状**：Flipper 显示 "Emulating..."，但刷卡无反应
- **原因**：读卡器需要完整扇区数据，而你只读到了 UID；或读卡器用了 NFC-B/F
- **解决**：确保完整读取再 emulate；NFC-F（FeliCa）Flipper 目前只能 UID-only

### Q4.4 Amiibo 写入失败
- **原因**：Flipper **不写入** NFC 卡，只 emulate
- **解决**：要写 Amiibo 需要 NTAG215 空白卡 + Android TagMo，Flipper 只能 emulate

---

## 5. BadUSB

### Q5.1 键盘布局不对（打出乱码）
- **原因**：默认 US 布局，你的电脑是别的布局
- **解决**：脚本首行加 `KEYBOARD_LAYOUT CN` 或对应国家代码；`/ext/badusb/assets/layouts/` 看所有可用布局

### Q5.2 被杀软拦截
- **原因**：Flipper 被识别为 HID Attack Device
- **解决**：这是合理防御，不绕过。合法测试用例在得到 owner 授权前提下进行

### Q5.3 脚本运行到一半卡住
- **原因**：`DEFAULT_DELAY` 太短，快于目标系统响应速度
- **解决**：`DEFAULT_DELAY 500` 调到 500ms，GUI 动作之间加 `DELAY 300`

---

## 6. BLE

### Q6.1 BLE Spam 应用启动 crash
- **原因**：用了旧 API（`furi_hal_bt_stop_advertising` 等）不兼容当前固件
- **解决**：升级到用 `furi_hal_bt_extra_beacon_*` API 的版本（本项目 `x_ble_spam` 已迁移）

### Q6.2 iPhone 没弹 pairing popup
- **原因**：iOS 16.6+/17.2+ 修复了部分 Continuity 漏洞
- **现状**：`Apple Watch / Setup New iPhone / AutoFill / iOS17 Crash` 这几项对新 iOS 无效，属于协议层被 patch

### Q6.3 蓝牙在 Settings 里开了，但 Bluetooth Remote 用不了
- **原因**：先被其他 BLE app 占用（x_ble_spam / x_findmy 在运行）
- **解决**：退出占用 BLE 的 app，Settings → Bluetooth → Disconnect → Connect

---

## 7. Infrared

### Q7.1 Universal Remote 查不到自己电视
- **原因**：内置码库只覆盖头部品牌
- **解决**：导入 Lucaslhm IRDB 到 `/ext/infrared/assets_user/`

### Q7.2 空调只记住了一个状态
- **原因**：空调 IR 协议把模式/温度/风速压缩在一条信号里，IRDB 只录了其中一个状态
- **解决**：自己学一整套（Learn New Remote → 按遥控器上每个状态组合）

### Q7.3 学习模式信号接收不到
- **原因**：遥控器离 Flipper 太远 / 电池没电 / 不是 IR 而是 BLE/Sub-GHz 遥控器
- **解决**：5cm 内对准 IR 接收头；换新电池；确认目标设备确实是 IR

---

## 8. 应用 / `.fap`

### Q8.1 应用启动报 "Invalid file"
- **原因**：`.fap` 是用旧 SDK 编译的
- **解决**：`ufbt update` 更新 SDK，重新编译

### Q8.2 应用启动崩溃 / "Out Of Memory"
- **原因**：Flipper MCU 只有 256KB RAM，`.fap` 太大或同时加载太多
- **解决**：**这是正常现象**，重启设备后单独启动即可。参见 `reference_flipper_ram_oom.md`

### Q8.3 应用装不上 "Version mismatch"
- **原因**：`.fap` 的 API 版本和固件不匹配
- **解决**：对应固件重新编译；或等作者更新；或刷回匹配的固件版本

---

## 9. 存储 / SD 卡

### Q9.1 SD 卡报错 / 读不出
- **解决**：
  1. 电脑上格式化为 FAT32（大卡用 exFAT，但兼容性略差）
  2. 分配单元大小 4KB
  3. 只用 Class 10 及以上，容量 ≤ 32GB 最稳

### Q9.2 文件名出现乱码
- **原因**：Flipper 只支持 ASCII 文件名
- **解决**：不要用中文/日文/特殊字符命名文件

### Q9.3 传大量文件慢
- **解决**：直接拔 SD 卡放电脑读写，比 qFlipper / 串口快 10x+

---

## 10. 硬件 / 电池

### Q10.1 电池掉电快
- **原因**：BLE/SubGHz/NFC 持续启用；屏幕常亮；某些 `.fap` 后台跑
- **解决**：Settings → Power → 检查空闲功耗；用完协议就退出

### Q10.2 屏幕有残影
- **原因**：静态画面长时间显示，LCD 正常老化现象
- **解决**：开 Sleep Saver / Matrix 屏保；不用时放包里

### Q10.3 按键响应迟钝
- **原因**：橡胶老化 / 灰尘
- **解决**：用气吹清理缝隙，严重的话需拆机

---

## 参考

- 官方 FAQ: https://docs.flipper.net/
- Reddit: r/flipperzero（搜特定问题）
- Discord: 官方 Flipper + Momentum + Xtreme 都有 `#help` 频道
