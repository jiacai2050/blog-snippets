.PHONY: gen bench

gen:
	rm metric_*.go
	go generate -v ./...
	easyjson metric.go

bench:
	go test -bench Jsoncost
