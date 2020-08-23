package main

import (
	"fmt"
	"unsafe"
)

type student struct {
	name string

	// a, b, c int64
	// d, e, f string
	// g, h, i float64
}

const randStr = "a very long string,a very long string,a very long string,a very long string"

//go:noinline
func (s student) getNameByValue() string {
	return s.name
}

//go:noinline
func (s *student) getNameByPointer() string {
	return s.name
}

//go:noinline
func returnByValue() student {
	return student{name: randStr}
}

//go:noinline
func returnByPointer() *student {
	return &student{name: randStr}
}

func main() {
	foo := student{name: "foo"}
	bar := foo
	bar.name = "bar"
	fmt.Println(foo.name)

	bar2 := &foo
	bar2.name = "bar"
	fmt.Println(foo.name)

	fmt.Println(map[string]uint64{
		"ptr":       uint64(unsafe.Sizeof(&struct{}{})),
		"map":       uint64(unsafe.Sizeof(map[bool]bool{})),
		"slice":     uint64(unsafe.Sizeof([]struct{}{})),
		"chan":      uint64(unsafe.Sizeof(make(chan struct{}))),
		"func":      uint64(unsafe.Sizeof(func() {})),
		"interface": uint64(unsafe.Sizeof(interface{}(0))),
	})

}
