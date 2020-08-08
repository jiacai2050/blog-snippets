package main

import (
	"fmt"
	"strings"
	"unsafe"
)
import "C"

//export Add
func Add(a, b int) int {
	return a + b
}

//export Hello
func Hello(msg string) *C.char {
	return C.CString("hello " + strings.ToUpper(msg))

}

//export Hello2
func Hello2(msg string) *C.char {
	return C.CString("hello2 " + strings.ToUpper(msg))

}
//export ReturnByteSlice
func ReturnByteSlice() (unsafe.Pointer, int) {
	bs := []byte("hello world from golang")
	return C.CBytes(bs), len(bs)
}

//export ReturnInterface
func ReturnInterface() error {
	return fmt.Errorf("err is interface")
}

// required, but not used
func main() {
	fmt.Println(Add(1, 3))
	err := ReturnInterface()
	if err != nil {
		panic(err)
	}
}
