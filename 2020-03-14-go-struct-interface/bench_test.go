package main

import "testing"

var blackholeStr string
var blackholeValue student
var blackholePointer *student

func BenchmarkPointerVSStruct(b *testing.B) {

	b.Run("return pointer", func(b *testing.B) {
		b.ReportAllocs()
		b.ResetTimer()
		for i := 0; i < b.N; i++ {
			blackholePointer = returnByPointer()
		}
	})

	b.Run("return  value", func(b *testing.B) {
		b.ReportAllocs()
		b.ResetTimer()
		for i := 0; i < b.N; i++ {
			blackholeValue = returnByValue()
		}
	})

	b.Run("value receiver", func(b *testing.B) {
		b.ReportAllocs()
		b.ResetTimer()
		r := student{
			name: randStr,
		}
		for i := 0; i < b.N; i++ {
			blackholeStr = r.getNameByValue()
		}
	})
	b.Run("pointer receiver", func(b *testing.B) {
		b.ReportAllocs()
		b.ResetTimer()
		r := &student{
			name: randStr,
		}
		for i := 0; i < b.N; i++ {
			blackholeStr = r.getNameByPointer()
		}
	})

}
