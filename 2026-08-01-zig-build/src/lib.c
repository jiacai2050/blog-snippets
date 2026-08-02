#include <regex.h>
#include <stdio.h>

int c_add(int a, int b) {
    return a + b;
}

typedef struct {
    int x;
    int y;
} Point;

typedef struct {
  unsigned int power : 1;
  unsigned int led_color : 3;
  unsigned int error_code : 4;
} DeviceStatus;

void print_status(DeviceStatus status) {
    printf("Power: %u\n", status.power);
    printf("LED Color: %u\n", status.led_color);
    printf("Error Code: %u\n", status.error_code);
}

DeviceStatus create_status(unsigned int power, unsigned int led_color, unsigned int error_code) {
    DeviceStatus status;
    status.power = power;
    status.led_color = led_color;
    status.error_code = error_code;
    return status;
}
