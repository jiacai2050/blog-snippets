package net.liujiacai.cgojna.benchmark;

import net.liujiacai.cgojna.gotype.GoString;
import org.openjdk.jmh.annotations.Scope;
import org.openjdk.jmh.annotations.State;

import java.io.UnsupportedEncodingException;

public class Util {
    @State(Scope.Benchmark)
    public static class ConstantFoldingHello {
        public GoString.ByValue goStr;

        public ConstantFoldingHello() {
            try {
                this.goStr = new GoString.ByValue("I understand instantiating Blackholes directly");
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
        }
    }

    @State(Scope.Benchmark)
    public static class ConstantFoldingAdd {
        public int a = 100;
        public int b = 1000;
    }
}
