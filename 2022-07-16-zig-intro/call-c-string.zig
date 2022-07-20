// 这样执行
// zig test call-c-string.zig -I .

const std = @import("std");
const c = @cImport({
    @cInclude("foo.c");
});
const expectEqual = std.testing.expectEqual;

// 参考
// https://renato.athaydes.com/posts/testing-building-c-with-zig.html
test "call c string" {
    // ` error: expected type '[*c]u8', found '*const [5:0]u8'
    // try expectEqual(@as(i32, 5), c.count_bytes("hello"));

    var str = "hello".*;
    try expectEqual(@as(i32, 5), c.count_bytes(&str));
    try expectEqual(@as(i32, 5), c.count_bytes2("hello"));
}
