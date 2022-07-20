// 引入标准库
const std = @import("std");
const json = std.json;
// 定义多行的字符串
const payload =
    \\{
    \\    "vals": {
    \\        "testing": 1,
    \\        "production": 42
    \\    },
    \\    "uptime": 9999
    \\}
;
// 定义一个结构体类型，类型和 u8 等基础类型一样是一等成员，可以作为值来使用
const Config = struct {
    vals: struct { testing: u8, production: u8 },
    uptime: u64,
};
// 定义一个全局变量，不可变，同时定义了一个 block，label 为 x
// 由于 config 是个 const，因此该 block 会在编译期执行
const config = x: {
    // 使用 var 定义一个可变的局部变量
    var stream = json.TokenStream.init(payload);
    const res = json.parse(Config, &stream, .{});
    break :x res catch unreachable;
};

// main 函数的返回值为 !void，这里省略了具体错误类型，由编译器自动推导
pub fn main() !void {
    if (config.vals.production > 50) {
        @compileError("only up to 50 supported");
    }
    std.log.info("up={d}", .{config.uptime});
}
