const std = @import("std");
const example = @import("example");
const c = @import("c");

extern fn c_add(a: i32, b: i32) i32;

pub fn main() !void {
    const ret = example.add(1, 2);
    std.debug.print("example.add(1, 2) = {d}\n", .{ret});

    const c_ret = c_add(1, 2);
    std.debug.print("c_add(1, 2) = {d}\n", .{c_ret});

    const translate_c_ret = c.c_add(1, 2);
    std.debug.print("translate_c.c_add(1, 2) = {d}\n", .{translate_c_ret});
}
