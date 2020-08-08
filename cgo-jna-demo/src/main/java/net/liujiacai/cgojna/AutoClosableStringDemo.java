package net.liujiacai.cgojna;

import com.sun.jna.Native;
import com.sun.jna.Pointer;
import com.sun.jna.PointerType;
import com.sun.jna.Structure;

import java.util.Arrays;
import java.util.List;

/**
 * This class demonstrate how to utilize AutoClosable and try-with-resources to deal with *char free
 * Reference:
 * https://stackoverflow.com/a/48270500
 */
public class AutoClosableStringDemo {
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

    public static class FreeableString extends PointerType implements AutoCloseable {
        @Override
        public void close() {
            System.out.println("free pointer");
            Native.free(Pointer.nativeValue(this.getPointer()));
        }

        public String getString() {
            return this.getPointer().getString(0, "utf-8");
        }
    }

    public static native FreeableString Hello(GoString.ByValue msg);

    public static void main(String[] args) {
        GoString.ByValue goStr = new GoString.ByValue();
        String msg = "jna demo";
        goStr.p = msg;
        goStr.n = msg.length();

        try (FreeableString freeableString = AutoClosableStringDemo.Hello(goStr)) {
            System.out.println(freeableString.getString());
        }
    }
}

