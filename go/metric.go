package jsonbenmark

import "time"

// ffjson: skip
type Demo struct {
	A int       `json:"a,omitempty"`
	B string    `json:"b,omitempty"`
	C time.Time `json:"c,omitempty"`
}

// easyjson:json ffjson: skip
type DemoEasy Demo

//go:generate ffjson $GOFILE
type DemoFF Demo
