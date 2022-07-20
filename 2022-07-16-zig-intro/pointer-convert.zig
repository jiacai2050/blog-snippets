const std = @import("std");
const os = std.os;
const expect = std.testing.expect;

test "pointer convert" {
    // [N]T --> *[N]T or []T
    // *[N]T --> []T
    {
        var array = [_]u8{ 1, 2, 3 };
        try expect(@TypeOf(array) == [3]u8);

        var ptr_to_array = array[0..];
        try expect(@TypeOf(ptr_to_array) == *[3]u8);
        var slice: []u8 = array[0..];
        try expect(@TypeOf(slice) == []u8);

        var slice2: []u8 = ptr_to_array;
        try expect(@TypeOf(slice2) == []u8);

        const str: [*:0]const u8 = "hello";
        const str2: [*]const u8 = str;
        _ = str2;
    }
    // [N]T --> [:x]T
    // [:x]T --> []T
    {
        var array = [_]u8{ 3, 2, 1, 0, 3, 2, 1, 0 };

        var runtime_length: usize = 3;
        const terminated_slice = array[0..runtime_length :0];
        try expect(@TypeOf(terminated_slice) == [:0]u8);

        // thread 11571310 panic: sentinel mismatch
        // const slice2 = array[0..runtime_length :1];
        // _ = slice2;

        // error: expected type 'void', found '[:1]u8'
        // _ = array[0..runtime_length :1];

        const slice = array[0..terminated_slice.len];
        try expect(@TypeOf(slice) == []u8);
    }
}
