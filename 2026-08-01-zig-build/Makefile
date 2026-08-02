
build:
	zig build --verbose-link

build-exe:
	zig build-exe --name example --dep example  -Mroot=src/main.zig src/lib.c -Mexample=src/root.zig


clean:
	rm -rf .zig-cache zig-out
