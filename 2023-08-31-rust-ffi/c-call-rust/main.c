extern void call_from_c();

struct Foo;
extern void say_foo(struct Foo*);
extern struct Foo* new_foo();
extern void free_foo(struct Foo*);
extern void ub_demo(struct Foo*);

int main(void) {
    call_from_c();
    struct Foo* foo = new_foo();
    say_foo(foo);

    ub_demo(foo);

    free_foo(foo);
    return 0;
}
