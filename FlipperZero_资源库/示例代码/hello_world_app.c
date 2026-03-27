// ============================================================================
// Flipper Zero 应用开发示例 - Hello World
// ============================================================================
// 这是一个完整的 FAP (Flipper Application Package) 示例
// 展示了基本的GUI、输入处理和绘制
// ============================================================================

#include <furi.h>
#include <gui/gui.h>
#include <input/input.h>
#include <stdlib.h>

// ============================================================================
// 应用数据结构
// ============================================================================
typedef struct {
    // GUI相关
    Gui* gui;
    ViewPort* view_port;

    // 输入处理
    FuriMessageQueue* input_queue;

    // 应用状态
    bool running;
    int counter;
    char message[32];
} HelloWorldApp;

// ============================================================================
// 绘制回调函数
// ============================================================================
static void hello_world_draw_callback(Canvas* canvas, void* ctx) {
    HelloWorldApp* app = ctx;
    furi_assert(app);

    // 清空画布
    canvas_clear(canvas);

    // 设置背景色 (黑色背景)
    canvas_set_color(canvas, ColorBlack);
    canvas_draw_box(canvas, 0, 0, 128, 64);
    canvas_set_color(canvas, ColorWhite);

    // 绘制边框
    canvas_draw_frame(canvas, 0, 0, 128, 64);
    canvas_draw_frame(canvas, 2, 2, 124, 60);

    // 绘制标题
    canvas_set_font(canvas, FontPrimary);
    canvas_draw_str_aligned(canvas, 64, 10, AlignCenter, AlignTop, "Flipper Zero");

    // 绘制副标题
    canvas_set_font(canvas, FontSecondary);
    canvas_draw_str_aligned(canvas, 64, 22, AlignCenter, AlignTop, "Hello World Demo");

    // 绘制计数器
    canvas_set_font(canvas, FontBigNumbers);
    char counter_str[16];
    snprintf(counter_str, sizeof(counter_str), "%d", app->counter);
    canvas_draw_str_aligned(canvas, 64, 35, AlignCenter, AlignTop, counter_str);

    // 绘制提示信息
    canvas_set_font(canvas, FontKeyboard);
    canvas_draw_str_aligned(canvas, 64, 55, AlignCenter, AlignTop,
        "UP/DOWN: Change | BACK: Exit");
}

// ============================================================================
// 输入回调函数
// ============================================================================
static void hello_world_input_callback(InputEvent* input_event, void* ctx) {
    HelloWorldApp* app = ctx;
    furi_assert(app);

    // 将输入事件放入队列
    if(input_event->type == InputTypePress) {
        furi_message_queue_put(app->input_queue, input_event, 0);
    }
}

// ============================================================================
// 应用初始化
// ============================================================================
static HelloWorldApp* hello_world_app_alloc() {
    HelloWorldApp* app = malloc(sizeof(HelloWorldApp));

    // 初始化状态
    app->running = true;
    app->counter = 0;
    strncpy(app->message, "Hello!", sizeof(app->message));

    // 创建输入队列
    app->input_queue = furi_message_queue_alloc(8, sizeof(InputEvent));

    // 创建ViewPort
    app->view_port = view_port_alloc();
    view_port_draw_callback_set(app->view_port, hello_world_draw_callback, app);
    view_port_input_callback_set(app->view_port, hello_world_input_callback, app);

    // 打开GUI记录
    app->gui = furi_record_open(RECORD_GUI);
    gui_add_view_port(app->gui, app->view_port, GuiLayerFullscreen);

    return app;
}

// ============================================================================
// 应用清理
// ============================================================================
static void hello_world_app_free(HelloWorldApp* app) {
    furi_assert(app);

    // 移除ViewPort
    gui_remove_view_port(app->gui, app->view_port);
    view_port_free(app->view_port);
    furi_record_close(RECORD_GUI);

    // 释放队列
    furi_message_queue_free(app->input_queue);

    // 释放应用结构
    free(app);
}

// ============================================================================
// 主入口点
// ============================================================================
int32_t hello_world_app(void* p) {
    UNUSED(p);

    // 创建应用实例
    HelloWorldApp* app = hello_world_app_alloc();

    // 主事件循环
    InputEvent input;
    while(app->running) {
        // 等待输入事件
        FuriStatus status = furi_message_queue_get(app->input_queue, &input, 100);

        if(status == FuriStatusOk) {
            // 处理按键
            switch(input.key) {
                case InputKeyUp:
                    app->counter++;
                    break;

                case InputKeyDown:
                    app->counter--;
                    break;

                case InputKeyOk:
                    app->counter = 0;
                    break;

                case InputKeyBack:
                    app->running = false;
                    break;

                default:
                    break;
            }

            // 更新视图
            view_port_update(app->view_port);
        }
    }

    // 清理
    hello_world_app_free(app);

    return 0;
}

// ============================================================================
// 编译说明:
// 1. 将此文件放入 applications_user/hello_world/
// 2. 创建 application.fam 清单文件
// 3. 运行 ./fbt fap_hello_world
// 4. 生成的.fap文件在 build/ 目录
// ============================================================================
