package main

import (
	"log"

	"github.com/jiacai2050/strutil"
)

func main() {
	hello := strutil.Reverse("hello")
	log.Printf(hello)
}
