#include <stdint.h>
#include <stdio.h>

int main() {
  struct {
    int64_t a;  // 8
    int16_t b;  // 2
    char c;     // 1
                // padding 5
  } a = {.a=1,.b=2,.c='a'};
  printf("a %lu\n", sizeof(a));

  struct {
    int16_t b; // 2
               // padding 6
    int64_t a; // 8
    char c;    // 1
               // padding 7
  } b = { .a=1, .b=2, .c='a' };
  printf("b %lu\n", sizeof(b));

  return 0;
}
