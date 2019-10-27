package jsonbenmark

import (
	json "encoding/json"
	"math"
	"testing"
	"time"

	jsoniter "github.com/json-iterator/go"
	easyjson "github.com/mailru/easyjson"
	"github.com/pquerna/ffjson/ffjson"
)

func BenchmarkJsoncost(b *testing.B) {
	demo := Demo{
		A: math.MaxInt64,
		B: "abcbcdefabcbcdef",
		C: time.Now(),
	}

	demoEasy := DemoEasy(demo)
	demoFF := DemoFF(demo)

	b.Run("std", func(b *testing.B) {
		b.ResetTimer()
		b.ReportAllocs()
		for i := 0; i < b.N; i++ {
			_, err := json.Marshal(demo)
			if err != nil {
				b.Errorf("marshal failed: %v", err)
			}
		}
	})
	b.Run("jsoniter", func(b *testing.B) {
		var j = jsoniter.ConfigCompatibleWithStandardLibrary
		b.ResetTimer()
		b.ReportAllocs()
		for i := 0; i < b.N; i++ {
			_, err := j.Marshal(demo)
			if err != nil {
				b.Errorf("marshal failed: %v", err)
			}
		}
	})
	b.Run("easyjson", func(b *testing.B) {
		b.ResetTimer()
		b.ReportAllocs()
		for i := 0; i < b.N; i++ {
			_, err := easyjson.Marshal(demoEasy)
			if err != nil {
				b.Errorf("marshal failed: %v", err)
			}
		}
	})
	b.Run("ffjson", func(b *testing.B) {
		b.ResetTimer()
		b.ReportAllocs()
		for i := 0; i < b.N; i++ {
			_, err := ffjson.Marshal(&demoFF)
			if err != nil {
				b.Errorf("marshal failed: %v", err)
			}
		}
	})

}
