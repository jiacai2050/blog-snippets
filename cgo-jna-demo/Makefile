ifeq ($(shell uname), Darwin)
	OUTPUT_LIB=./darwin/libawesome.dylib
endif
ifeq ($(shell uname), Linux)
	OUTPUT_LIB=./linux-x86-64/libawesome.so
endif

.PHONY: cgo bad-string good-string return-interface return-slice bench

cgo:
	cd src/main/resources && \
	go build -v -o ${OUTPUT_LIB} -buildmode=c-shared ./main.go

PACKAGE=net.liujiacai.cgojna

bad-string:
	mvn exec:java -Dexec.mainClass="${PACKAGE}.BadStringDemo"

good-string:
	mvn exec:java -Dexec.mainClass="${PACKAGE}.GoodStringDemo"

return-slice:
	mvn exec:java -Dexec.mainClass="${PACKAGE}.ReturnByteSliceDemo"

return-interface:
	mvn exec:java -Dexec.mainClass="${PACKAGE}.ReturnInterfaceDemo"

bench:
	mvn clean compile exec:java -Dexec.mainClass="${PACKAGE}.benchmark.BenchmarkRunner"
