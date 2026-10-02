const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    // =========================================================================
    // Approach 1: Compiling C source files directly into a Zig module
    // =========================================================================
    // By calling `mod.addCSourceFile`, the Zig build system registers `src/lib.c`
    // to be compiled via Zig's embedded Clang compiler into an object file (`.o`).
    // The resulting `.o` is then linked together with the Zig module.
    // In Zig source code (`src/root.zig`), functions are bound using `extern fn`.
    const mod = b.addModule("example", .{
        .root_source_file = b.path("src/root.zig"),
        .target = target,
    });
    mod.addCSourceFile(.{
        .file = b.path("src/lib.c"),
    });

    // =========================================================================
    // Approach 2: Translating C header files into a Zig module via TranslateC
    // =========================================================================
    // `b.addTranslateC` creates a build step that invokes Zig's Translate-C
    // engine on `src/lib.h`. `c.createModule()` exports the translated C AST
    // as an independent Zig module, allowing Zig source code (`src/main.zig`)
    // to safely import C declarations via `@import("c")`.
    const c = b.addTranslateC(.{
        .optimize = optimize,
        .target = target,
        .root_source_file = b.path("src/lib.h"),
    });

    // Create the main executable artifact and attach module imports
    const exe = b.addExecutable(.{
        .name = "example",
        .root_module = b.createModule(.{
            .root_source_file = b.path("src/main.zig"),
            .target = target,
            .optimize = optimize,
            .imports = &.{
                .{ .name = "example", .module = mod },
                .{ .name = "c", .module = c.createModule() },
            },
        }),
    });

    b.installArtifact(exe);

    // Define the 'run' build step
    const run_step = b.step("run", "Run the app");
    const run_cmd = b.addRunArtifact(exe);
    run_step.dependOn(&run_cmd.step);

    run_cmd.step.dependOn(b.getInstallStep());

    if (b.args) |args| {
        run_cmd.addArgs(args);
    }
}
