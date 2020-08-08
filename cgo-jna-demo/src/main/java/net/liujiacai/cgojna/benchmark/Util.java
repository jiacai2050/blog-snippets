package net.liujiacai.cgojna.benchmark;

import net.liujiacai.cgojna.gotype.GoString;
import org.openjdk.jmh.annotations.Scope;
import org.openjdk.jmh.annotations.State;

public class Util {
    @State(Scope.Benchmark)
    public static class ConstantFoldingHello {
        public GoString.ByValue goStr = new GoString.ByValue("I understand instantiating Blackholes directly");
    }

    @State(Scope.Benchmark)
    public static class ConstantFoldingAdd {
        public int a = 100;
        public int b = 1000;
    }
}
