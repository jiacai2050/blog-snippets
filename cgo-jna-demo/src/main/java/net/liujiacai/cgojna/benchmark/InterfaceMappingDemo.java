package net.liujiacai.cgojna.benchmark;

import com.sun.jna.Library;
import com.sun.jna.Native;
import com.sun.jna.Pointer;
import net.liujiacai.cgojna.gotype.FreeableString;
import net.liujiacai.cgojna.gotype.GoString;
import org.openjdk.jmh.annotations.Benchmark;
import org.openjdk.jmh.annotations.Fork;
import org.openjdk.jmh.annotations.Warmup;
import org.openjdk.jmh.infra.Blackhole;

public class InterfaceMappingDemo {
    public interface Awesome extends Library {
        Awesome INSTANCE = Native.load("awesome",
                Awesome.class);

        FreeableString Hello(GoString.ByValue msg);

        Pointer Hello2(GoString.ByValue msg);

        int Add(int a, int b);
    }

    @Benchmark
    @Fork(value = 1, warmups = 2)
    @Warmup(iterations = 10)
    public static void benchInterfaceHello(Blackhole blackhole, Util.ConstantFoldingHello cf) {
        try (FreeableString freeableString = Awesome.INSTANCE.Hello(cf.goStr)) {
            blackhole.consume(freeableString.getString());
        }

    }

    @Benchmark
    @Fork(value = 1, warmups = 2)
    @Warmup(iterations = 10)
    public static void benchInterfaceHello2(Blackhole blackhole, Util.ConstantFoldingHello cf) {
        Pointer ptr = null;
        try {
            ptr = Awesome.INSTANCE.Hello2(cf.goStr);
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
    public static void benchInterfaceAdd(Blackhole blackhole, Util.ConstantFoldingAdd cf) {
        int ret = Awesome.INSTANCE.Add(cf.a, cf.b);
        blackhole.consume(ret);
//        System.out.println(ret);

    }

    public static void main(String[] args) {
        Blackhole blackhole = new Blackhole("Today's password is swordfish. I understand instantiating Blackholes directly is dangerous.");
        benchInterfaceHello(blackhole,
                new Util.ConstantFoldingHello());
        benchInterfaceAdd(blackhole,
                new Util.ConstantFoldingAdd());
    }
}
