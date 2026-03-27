#!/bin/bash
# ============================================================================
# Flipper Zero 资源管理脚本
# ============================================================================
# 用法: ./flipper_tools.sh [command]
#
# Commands:
#   backup    - 备份 Flipper 数据到电脑
#   restore   - 从电脑恢复数据到 Flipper
#   clean     - 清理临时文件
#   organize  - 整理SD卡文件结构
#   convert   - 转换信号文件格式
# ============================================================================

# 配置
FLIPPER_MOUNT="/Volumes/FLIPPER"
BACKUP_DIR="$HOME/Flipper_Backups"
DATE=$(date +%Y%m%d_%H%M%S)

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ============================================================================
# 功能函数
# ============================================================================

print_header() {
    echo -e "${GREEN}=======================================${NC}"
    echo -e "${GREEN}  Flipper Zero 工具脚本${NC}"
    echo -e "${GREEN}=======================================${NC}"
    echo ""
}

check_flipper_connected() {
    if [ ! -d "$FLIPPER_MOUNT" ]; then
        echo -e "${RED}错误: 未检测到 Flipper Zero${NC}"
        echo "请确保设备已连接并挂载"
        exit 1
    fi
    echo -e "${GREEN}✓ 检测到 Flipper Zero${NC}"
}

backup_flipper() {
    print_header
    check_flipper_connected

    BACKUP_PATH="$BACKUP_DIR/backup_$DATE"
    mkdir -p "$BACKUP_PATH"

    echo "正在备份到: $BACKUP_PATH"
    echo ""

    # 备份各目录
    for dir in apps badusb infrared nfc rfid subghz u2f; do
        if [ -d "$FLIPPER_MOUNT/$dir" ]; then
            echo "备份 $dir..."
            cp -r "$FLIPPER_MOUNT/$dir" "$BACKUP_PATH/"
        fi
    done

    # 备份配置文件
    if [ -f "$FLIPPER_MOUNT/manifest.txt" ]; then
        cp "$FLIPPER_MOUNT/manifest.txt" "$BACKUP_PATH/"
    fi

    # 创建备份信息
    echo "备份时间: $(date)" > "$BACKUP_PATH/backup_info.txt"
    echo "设备信息: $(cat "$FLIPPER_MOUNT/manifest.txt" 2>/dev/null || echo 'Unknown')" >> "$BACKUP_PATH/backup_info.txt"

    echo ""
    echo -e "${GREEN}✓ 备份完成: $BACKUP_PATH${NC}"
}

restore_flipper() {
    print_header
    check_flipper_connected

    # 列出可用备份
    echo "可用备份:"
    ls -1 "$BACKUP_DIR" 2>/dev/null || echo "无备份文件"
    echo ""
    read -p "输入要恢复的备份名称: " BACKUP_NAME

    BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"

    if [ ! -d "$BACKUP_PATH" ]; then
        echo -e "${RED}错误: 备份不存在${NC}"
        exit 1
    fi

    echo "正在从 $BACKUP_PATH 恢复..."
    cp -r "$BACKUP_PATH"/* "$FLIPPER_MOUNT/"

    echo -e "${GREEN}✓ 恢复完成${NC}"
}

organize_sdcard() {
    print_header
    check_flipper_connected

    echo "正在整理SD卡文件结构..."

    # 创建标准目录结构
    for dir in apps/SubGHz apps/NFC apps/GPIO; do
        mkdir -p "$FLIPPER_MOUNT/$dir"
    done

    # 移动文件到正确位置
    find "$FLIPPER_MOUNT" -maxdepth 1 -name "*.sub" -exec mv {} "$FLIPPER_MOUNT/subghz/" \; 2>/dev/null
    find "$FLIPPER_MOUNT" -maxdepth 1 -name "*.nfc" -exec mv {} "$FLIPPER_MOUNT/nfc/" \; 2>/dev/null
    find "$FLIPPER_MOUNT" -maxdepth 1 -name "*.rfid" -exec mv {} "$FLIPPER_MOUNT/rfid/" \; 2>/dev/null
    find "$FLIPPER_MOUNT" -maxdepth 1 -name "*.ir" -exec mv {} "$FLIPPER_MOUNT/infrared/" \; 2>/dev/null
    find "$FLIPPER_MOUNT" -maxdepth 1 -name "*.txt" -path "*/badusb/*" -exec mv {} "$FLIPPER_MOUNT/badusb/" \; 2>/dev/null

    echo -e "${GREEN}✓ 整理完成${NC}"
}

clean_temp() {
    print_header
    echo "清理临时文件..."

    # 清理macOS生成的文件
    find "$FLIPPER_MOUNT" -name ".DS_Store" -delete
    find "$FLIPPER_MOUNT" -name "._*" -delete
    find "$FLIPPER_MOUNT" -name ".Trashes" -exec rm -rf {} \; 2>/dev/null

    echo -e "${GREEN}✓ 清理完成${NC}"
}

show_info() {
    print_header
    check_flipper_connected

    echo "设备信息:"
    echo "=============="

    # 显示存储信息
    df -h "$FLIPPER_MOUNT" 2>/dev/null | tail -1

    echo ""
    echo "文件统计:"
    echo "  SubGHz文件: $(find "$FLIPPER_MOUNT/subghz" -name "*.sub" 2>/dev/null | wc -l)"
    echo "  NFC文件: $(find "$FLIPPER_MOUNT/nfc" -name "*.nfc" 2>/dev/null | wc -l)"
    echo "  RFID文件: $(find "$FLIPPER_MOUNT/rfid" -name "*.rfid" 2>/dev/null | wc -l)"
    echo "  红外文件: $(find "$FLIPPER_MOUNT/infrared" -name "*.ir" 2>/dev/null | wc -l)"
    echo "  BadUSB脚本: $(find "$FLIPPER_MOUNT/badusb" -name "*.txt" 2>/dev/null | wc -l)"
    echo "  FAP应用: $(find "$FLIPPER_MOUNT/apps" -name "*.fap" 2>/dev/null | wc -l)"
}

# ============================================================================
# 主程序
# ============================================================================

case "${1:-}" in
    backup)
        backup_flipper
        ;;
    restore)
        restore_flipper
        ;;
    organize)
        organize_sdcard
        ;;
    clean)
        clean_temp
        ;;
    info)
        show_info
        ;;
    *)
        print_header
        echo "用法: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  backup    - 备份 Flipper 数据"
        echo "  restore   - 恢复 Flipper 数据"
        echo "  organize  - 整理SD卡文件"
        echo "  clean     - 清理临时文件"
        echo "  info      - 显示设备信息"
        echo ""
        echo "示例:"
        echo "  $0 backup"
        echo "  $0 info"
        ;;
esac
