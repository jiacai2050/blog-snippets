const std = @import("std");

const expect = std.testing.expect;

fn LinkedList(comptime T: type) type {
    return struct {
        pub const Node = struct {
            // ?T 表示 Option 类型，值可能为 null
            prev: ?*Node,
            next: ?*Node,
            data: T,
        };

        first: ?*Node,
        last: ?*Node,
        len: usize,
    };
}

// test 定义了一个测试代码快，zig test main.zig 时会执行这里面的代码
test "linked list" {
    // Functions called at compile-time are memoized. This means you can
    // do this:
    // expect 可能返回错误，try 表示 catch |err| return err
    // 类似于 Rust 中的 result?
    try expect(LinkedList(i32) == LinkedList(i32));

    var list = LinkedList(i32){
        .first = null,
        .last = null,
        .len = 0,
    };
    try expect(list.len == 0);

    // Since types are first class values you can instantiate the type
    // by assigning it to a variable:
    const ListOfInts = LinkedList(i32);
    try expect(ListOfInts == LinkedList(i32));

    var node = ListOfInts.Node{
        .prev = null,
        .next = null,
        .data = 1234,
    };
    var list2 = LinkedList(i32){
        .first = &node,
        .last = &node,
        .len = 1,
    };

    // When using a pointer to a struct, fields can be accessed directly,
    // without explicitly dereferencing the pointer.
    // So you can do
    // option.? 相当于 rust 中的 option.unwrap()，取出其中的值
    try expect(list2.first.?.data == 1234);
    // instead of try expect(list2.first.?.*.data == 1234);
}
