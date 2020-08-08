package net.liujiacai.cgojna.benchmark;

import com.sun.jna.Native;
import com.sun.jna.Pointer;
import net.liujiacai.cgojna.gotype.FreeableString;
import net.liujiacai.cgojna.gotype.GoString;
import org.openjdk.jmh.annotations.*;
import org.openjdk.jmh.infra.Blackhole;

public class DirectMappingDemo {
    static {
        Native.register("awesome");
    }

    public static native FreeableString Hello(GoString.ByValue msg);

    public static native Pointer Hello2(GoString.ByValue msg);

    public static native int Add(int a, int b);

    @Benchmark
    @Fork(value = 1, warmups = 2)
    @Warmup(iterations = 10)
    public static void benchDirectHello(Blackhole blackhole, Util.ConstantFoldingHello cf) {
        try (FreeableString freeableString = DirectMappingDemo.Hello(cf.goStr)) {
            blackhole.consume(freeableString.getString());
        }
    }

    @Benchmark
    @Fork(value = 1, warmups = 2)
    @Warmup(iterations = 10)
    public static void benchDirectHello2(Blackhole blackhole, Util.ConstantFoldingHello cf) {
        Pointer ptr = null;
        try {
            ptr = DirectMappingDemo.Hello2(cf.goStr);
            String s = ptr.getString(0, "utf8");
            blackhole.consume(s);
        } finally {
            if (ptr != null) {
                Native.free(Pointer.nativeValue(ptr));
            }
        }
    }

    @Benchmark
    @Fork(value = 1, warmups = 2)
    @Warmup(iterations = 10)
    public static void benchDirectAdd(Blackhole blackhole, Util.ConstantFoldingAdd cf) {
        int ret = DirectMappingDemo.Add(cf.a, cf.b);
        blackhole.consume(ret);
//        System.out.println(ret);
    }

    public static void main(String[] args) {
        Blackhole blackhole = new Blackhole("Today's password is swordfish. I understand instantiating Blackholes directly is dangerous.");
        benchDirectHello(blackhole,
                new Util.ConstantFoldingHello());
        benchDirectHello2(blackhole,
                new Util.ConstantFoldingHello());
        benchDirectAdd(blackhole,
                new Util.ConstantFoldingAdd());
    }

}
