
int count_bytes(char *str) {
  int count = 0;
  while(str[count]) {
    count++;
  }
  return count;
}

int count_bytes2(const char *str) {
  int count = 0;
  while(str[count]) {
    count++;
  }
  return count;
}
