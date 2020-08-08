package net.liujiacai.cgojna;

import com.sun.jna.Native;
import com.sun.jna.Structure;

import java.util.Arrays;
import java.util.List;

/**
 * This class use String to map *c.char, which will memory leak
 */
public class BadStringDemo {
    static {
        Native.register("awesome");
    }

    public static class GoString extends Structure {
        public static class ByValue extends GoString implements Structure.ByValue {
        }

        public String p;
        public long n;

        protected List getFieldOrder() {
            return Arrays.asList(new String[]{"p", "n"});
        }
    }

    public static native String Hello(GoString.ByValue msg);

    public static void main(String[] args) {
        GoString.ByValue goStr = new GoString.ByValue();
        String msg = "jna demo";
        goStr.p = msg;
        goStr.n = msg.length();

        // memory leak here
        while (true) {
            BadStringDemo.Hello(goStr);
        }
    }
}

