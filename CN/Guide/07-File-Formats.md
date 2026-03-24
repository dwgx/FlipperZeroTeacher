# 07. 文件格式

[返回中文教学导航](README.md) | [上一章：06. 系统编程](06-System-Programming.md) | [下一章：08. 社区参考](08-Community-Reference.md)

## 本章作用

很多人会把文件格式看成附属资料，实际上它是平台能力的重要接口层。只要涉及导入、导出、保存、共享、批处理、转换、样本库、社区数据仓库和 AI 检索，文件格式都会成为关键点。

本章的作用，是帮助你把格式层提升到与协议域、App 开发、系统工具同等重要的地位去理解。

## 本章建议先读的仓库内文档

- [02. 协议域](02-Protocol-Domains.md)：先明确每种格式对应哪个能力域。
- [03. App 开发](03-App-Development.md)：很多应用直接依赖文件结构。
- [08. 社区参考](08-Community-Reference.md)：很多社区仓库本质上是格式样本库或数据仓库。
- [中文主知识库](../FlipperZero-Master-CN.md)
- [官方文档中文精读总表](../Official-Docs-CN-Full.md)
- [官方文档覆盖表](../../Official-Docs-Coverage.md)

## 官方核心页面

- [File Formats 总览](https://developer.flipper.net/flipperzero/doxygen/file_formats.html)
- [Sub-GHz File Format](https://developer.flipper.net/flipperzero/doxygen/subghz_file_format.html)
- [NFC File Format](https://developer.flipper.net/flipperzero/doxygen/nfc_file_format.html)
- [iButton File Format](https://developer.flipper.net/flipperzero/doxygen/ibutton_file_format.html)
- [LF RFID File Format](https://developer.flipper.net/flipperzero/doxygen/lfrfid_file_format.html)
- [BadUSB File Format](https://developer.flipper.net/flipperzero/doxygen/badusb_file_format.html)

## 本章要解决的核心问题

- 为什么格式层会直接影响设备功能、App 行为和社区资料管理。
- 不同协议域的文件为什么不能混用。
- 为什么 AI 很容易在格式字段、版本、上下文和枚举值上犯错。

## 需要重点理解的内容

### 1. 通用格式头

阅读 [File Formats 总览](https://developer.flipper.net/flipperzero/doxygen/file_formats.html) 时，优先关注类型、版本、上下文、字段顺序和语义边界。这些字段不是可随意增删的装饰，而是让设备与工具正确理解数据的前提。

### 2. Sub-GHz

[Sub-GHz File Format](https://developer.flipper.net/flipperzero/doxygen/subghz_file_format.html) 常见重点包括：头部、频率、预设、协议字段、RAW 数据和上下文差异。它往往比初学者想象的更依赖严格结构。

### 3. NFC

[NFC File Format](https://developer.flipper.net/flipperzero/doxygen/nfc_file_format.html) 需要重点看通用头与设备专属段、字段含义和不同卡类型的组织方式。不要把不同 NFC 类型当成同一份简单文本模板。

### 4. iButton 与 LF RFID

[iButton File Format](https://developer.flipper.net/flipperzero/doxygen/ibutton_file_format.html) 与 [LF RFID File Format](https://developer.flipper.net/flipperzero/doxygen/lfrfid_file_format.html) 适合对比着看。它们都与身份识别场景有关，但属于不同技术域和不同格式结构。

### 5. BadUSB

[BadUSB File Format](https://developer.flipper.net/flipperzero/doxygen/badusb_file_format.html) 展示了另一类“脚本式格式”。它提醒你：Flipper Zero 的格式层不只是存储原始数据，也可能承担脚本与执行逻辑的组织职责。

## 建议阅读顺序

1. 先读 [File Formats 总览](https://developer.flipper.net/flipperzero/doxygen/file_formats.html)，建立统一格式视角。
2. 再按自己的主域进入 [Sub-GHz File Format](https://developer.flipper.net/flipperzero/doxygen/subghz_file_format.html)、[NFC File Format](https://developer.flipper.net/flipperzero/doxygen/nfc_file_format.html)、[iButton File Format](https://developer.flipper.net/flipperzero/doxygen/ibutton_file_format.html)、[LF RFID File Format](https://developer.flipper.net/flipperzero/doxygen/lfrfid_file_format.html)。
3. 最后阅读 [BadUSB File Format](https://developer.flipper.net/flipperzero/doxygen/badusb_file_format.html)，补足脚本式格式的理解。
4. 阅读完后，再回到 [08. 社区参考](08-Community-Reference.md)，你会更容易判断社区数据仓库是否规范。

## 学完本章后应具备的能力

- 面对导入导出、转换、解析和样本库问题时，能先从格式层定位。
- 能理解为什么某些文件不能跨域混用。
- 能为 AI 检索或自动化处理准备更稳定的格式知识。
- 能把格式层视为平台能力的一部分，而不是附录材料。

## 继续阅读

- 下一章：[08. 社区参考](08-Community-Reference.md)
- 回到上一章：[06. 系统编程](06-System-Programming.md)
- 回到协议域章节：[02. 协议域](02-Protocol-Domains.md)
- 查看官方精读：[官方文档中文精读总表](../Official-Docs-CN-Full.md)

[返回中文教学导航](README.md) | [上一章：06. 系统编程](06-System-Programming.md) | [下一章：08. 社区参考](08-Community-Reference.md)
