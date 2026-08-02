const std = @import("std");
const example = @import("example");

extern fn c_add(a: i32, b: i32) i32;

pub fn main() !void {
    std.debug.print("All your {s} are belong to us.\n", .{"codebase"});

    const ret = example.add(1, 2);
    std.debug.print("example.add(1, 2) = {d}\n", .{ret});

    const c_ret = c_add(1, 2);
    std.debug.print("c_add(1, 2) = {d}\n", .{c_ret});
}
