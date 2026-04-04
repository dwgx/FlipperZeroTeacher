# Topics — 专题深入

主线课程已经把 Flipper Zero 的设备、协议、开发、工具链走完一遍。
这里只放**深度专题**，每一篇都是「把一件事说透」的形态，不按章节顺序。

## 当前专题

| 专题 | 说明 |
|---|---|
| [BLE 实装ガイド — X-BLE Spam / X-FindMy](./BLE-Implementation.md) | 官方 `furi_hal_bt_extra_beacon_*` 单一 API で Apple / Google / Samsung / Microsoft の近接プロトコルを 39 種類再現した実装メモ。OSS 化用資料。 |
| [IR 数据库完全ガイド](./IR-Database-Guide.md) | Lucaslhm / heytem 2 大リポジトリの比較 · Pronto/LIRC 変換 · Flipper への一括取り込みワークフロー。 |

## 追加予定

- Sub-GHz ロールコード解析実装メモ
- NFC MFC 辞書ビルド指南 (mf_classic_dict_user.nfc)
- Sleep Saver 128x64 binary format (.ssbg) 仕様
- BadUSB Rubber Ducky 交叉参考

専題追加の基準:
- 既存主線課程で扱いきれない深度
- 実機検証済み
- 再現可能な手順が書ける
