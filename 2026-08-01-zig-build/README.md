# 2026-08-01-zig-build 示例项目

本项目为博客文章 **[《Zig 构建系统与编译管线全景解析》](https://liujiacai.net/blog/2026/08/01/zig-compilation-process/)** 的配套演示工程。

## 项目简介

本项目展示了 Zig 编译器的底层编译管线，以及在 Zig 中调用和集成 C 语言代码的两种核心方式：

1. **方式 1：将 C 语言源文件编译入 Module** (`mod.addCSourceFile`)
   - C 源文件：`src/lib.c`
   - Zig 接入方式：在 `src/root.zig` 中使用 `extern fn c_add(...)` 声明并接入。
   - 编译管线：构建系统调用内置的 Clang 编译器将 `src/lib.c` 编译为目标文件（`.o`），随后由内置链接器（LLD）将其与 Zig 编译产生的 `root.o` 统一合并链接。

2. **方式 2：使用 TranslateC 将 C 头文件转译为模块** (`b.addTranslateC`)
   - C 头文件：`src/lib.h`
   - Zig 接入方式：在 `build.zig` 中使用 `b.addTranslateC(...)` 显式定义转译步骤，并导出为名为 `"c"` 的依赖模块。
   - Zig 使用方式：在 `src/main.zig` 中通过标准的 `@import("c")` 安全高效地引用 C 语言声明。

## 底层实际调用的 CLI 命令

当你在该项目中运行 `zig build` 时，构建系统底层（通过 `Step.Compile.make()`）最终会拼装并派生执行以下等价的 CLI 命令：

```bash
zig build-exe --name example --dep example -Mroot=src/main.zig src/lib.c -Mexample=src/root.zig
```

参数说明：
- `-Mroot=src/main.zig`：定义主根模块入口。
- `-Mexample=src/root.zig` & `--dep example`：定义子模块 `example` 并在主模块中声明依赖。
- `src/lib.c`：直接追加给编译管线并发处理的 C 语言源文件。

## 快速运行

运行应用程序：

```bash
zig build run
```

预期输出结果：

```text
example.add(1, 2) = 3
c_add(1, 2) = 3
translate_c.c_add(1, 2) = 3
```
