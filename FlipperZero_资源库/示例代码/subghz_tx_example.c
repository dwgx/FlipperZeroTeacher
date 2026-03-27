// ============================================================================
// SubGHz 信号发射示例
// ============================================================================
// 演示如何使用SubGHz功能发送自定义信号
// ============================================================================

#include <furi.h>
#include <gui/gui.h>
#include <subghz/subghz.h>
#include <lib/subghz/subghz_setting.h>
#include <lib/subghz/subghz_worker.h>
#include <lib/subghz/transmitter.h>

// ============================================================================
// 普林斯顿(Princeton)协议示例数据
// 24位固定码协议，常用于遥控门铃和简单遥控
// ============================================================================

// 协议参数
#define PRINCETON_FREQUENCY 433920000  // 433.92 MHz
#define PRINCETON_BIT_COUNT 24

// 示例按键数据
static const uint8_t princeton_key_a[] = {0x00, 0x00, 0x55, 0x01};
static const uint8_t princeton_key_b[] = {0x00, 0x00, 0x55, 0x02};

// ============================================================================
// SubGHz 应用结构
// ============================================================================
typedef struct {
    Gui* gui;
    ViewPort* view_port;
    FuriMessageQueue* input_queue;

    SubGhzSetting* setting;
    SubGhzWorker* worker;
    SubGhzTransmitter* transmitter;
    SubGhzEnvironment* environment;

    bool running;
    uint8_t selected_key;
    bool transmitting;
} SubGhzApp;

// ============================================================================
// 绘制回调
// ============================================================================
static void subghz_draw_callback(Canvas* canvas, void* ctx) {
    SubGhzApp* app = ctx;

    canvas_clear(canvas);
    canvas_set_color(canvas, ColorBlack);
    canvas_draw_box(canvas, 0, 0, 128, 64);
    canvas_set_color(canvas, ColorWhite);

    canvas_set_font(canvas, FontPrimary);
    canvas_draw_str_aligned(canvas, 64, 5, AlignCenter, AlignTop, "SubGHz TX Demo");

    canvas_set_font(canvas, FontSecondary);
    canvas_draw_str(canvas, 5, 20, "Protocol: Princeton");
    canvas_draw_str(canvas, 5, 30, "Freq: 433.92 MHz");

    // 显示选中的按键
    char key_str[32];
    snprintf(key_str, sizeof(key_str), "Key: %c", 'A' + app->selected_key);
    canvas_draw_str(canvas, 5, 42, key_str);

    // 显示发射状态
    if(app->transmitting) {
        canvas_set_color(canvas, ColorWhite);
        canvas_draw_box(canvas, 40, 50, 48, 12);
        canvas_set_color(canvas, ColorBlack);
        canvas_draw_str(canvas, 45, 52, "TX...");
    } else {
        canvas_draw_str(canvas, 5, 55, "OK: Transmit | Back: Exit");
    }
}

// ============================================================================
// 输入回调
// ============================================================================
static void subghz_input_callback(InputEvent* input_event, void* ctx) {
    SubGhzApp* app = ctx;
    if(input_event->type == InputTypePress) {
        furi_message_queue_put(app->input_queue, input_event, 0);
    }
}

// ============================================================================
// 发送SubGHz信号
// ============================================================================
static void subghz_send_signal(SubGhzApp* app) {
    // 注意: 这只是一个框架示例
    // 实际实现需要完整的SubGHz栈初始化

    /*
    // 创建环境
    app->environment = subghz_environment_alloc();
    subghz_environment_load_came_atomo(app->environment, "path_to_file");

    // 创建发射器
    app->transmitter = subghz_transmitter_alloc_init(
        app->environment,
        "Princeton"
    );

    // 设置频率
    subghz_transmitter_deserialize(app->transmitter, data);

    // 发射
    subghz_transmitter_start(app->transmitter, callback, ctx);
    */

    // 模拟发射延迟
    app->transmitting = true;
    view_port_update(app->view_port);
    furi_delay_ms(500);
    app->transmitting = false;
}

// ============================================================================
// 应用初始化
// ============================================================================
static SubGhzApp* subghz_app_alloc() {
    SubGhzApp* app = malloc(sizeof(SubGhzApp));

    app->running = true;
    app->selected_key = 0;
    app->transmitting = false;
    app->input_queue = furi_message_queue_alloc(8, sizeof(InputEvent));

    app->view_port = view_port_alloc();
    view_port_draw_callback_set(app->view_port, subghz_draw_callback, app);
    view_port_input_callback_set(app->view_port, subghz_input_callback, app);

    app->gui = furi_record_open(RECORD_GUI);
    gui_add_view_port(app->gui, app->view_port, GuiLayerFullscreen);

    return app;
}

// ============================================================================
// 应用清理
// ============================================================================
static void subghz_app_free(SubGhzApp* app) {
    gui_remove_view_port(app->gui, app->view_port);
    view_port_free(app->view_port);
    furi_record_close(RECORD_GUI);
    furi_message_queue_free(app->input_queue);
    free(app);
}

// ============================================================================
// 主入口
// ============================================================================
int32_t subghz_tx_app(void* p) {
    UNUSED(p);

    SubGhzApp* app = subghz_app_alloc();

    InputEvent input;
    while(app->running) {
        FuriStatus status = furi_message_queue_get(app->input_queue, &input, 100);

        if(status == FuriStatusOk) {
            switch(input.key) {
                case InputKeyUp:
                case InputKeyDown:
                    app->selected_key = !app->selected_key;
                    break;

                case InputKeyOk:
                    subghz_send_signal(app);
                    break;

                case InputKeyBack:
                    app->running = false;
                    break;

                default:
                    break;
            }
            view_port_update(app->view_port);
        }
    }

    subghz_app_free(app);
    return 0;
}

// ============================================================================
// SubGHz 文件格式参考 (.sub)
// ============================================================================
/*
Filetype: Flipper SubGHz Key File
Version: 1
Frequency: 433920000
Preset: FuriHalSubGhzPresetOok650Async
Protocol: Princeton
Bit: 24
Key: 00 00 55 01 00

// RAW格式示例:
Filetype: Flipper SubGHz Raw File
Version: 1
Frequency: 433920000
Preset: FuriHalSubGhzPresetOok650Async
Protocol: RAW
RAW_Data: 500 -1500 500 -1500 500 -3000 ...
*/
