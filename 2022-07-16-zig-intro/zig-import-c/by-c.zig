// 这样执行
// zig run call-c-string.zig -I .

const std = @import("std");
const log = std.log;

const c = @cImport({
    @cInclude("foo.c");
});
const expectEqual = std.testing.expectEqual;

// 参考
// https://renato.athaydes.com/posts/testing-building-c-with-zig.html
pub fn main() !void {
    // ` error: expected type '[*c]u8', found '*const [5:0]u8'
    // try expectEqual(@as(i32, 5), c.count_bytes("hello"));

    var str = "hello".*;
    // info: str type:[5:0]u8
    log.info("str type:{s}", .{@TypeOf(str)});
    try expectEqual(@as(i32, 5), c.count_bytes(&str));
    try expectEqual(@as(i32, 5), c.count_bytes2("hello"));
}
