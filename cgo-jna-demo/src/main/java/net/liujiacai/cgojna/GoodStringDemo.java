package net.liujiacai.cgojna;

import com.sun.jna.Native;
import com.sun.jna.Pointer;
import com.sun.jna.Structure;

import java.util.Arrays;
import java.util.List;

/**
 * This class use Pointer to map *c.char, and free it after use.
 * JNA docs says:
 *  If the native method returns char* and actually allocates memory, a return type of Pointer should be used to avoid leaking the memory.
 *  It is then up to you to take the necessary steps to free the allocated memory.
 *
 * http://java-native-access.github.io/jna/5.6.0/javadoc/overview-summary.html#strings
 *
 * Cgo docs says:
 *  The C string is allocated in the C heap using malloc.
 *  It is the caller's responsibility to arrange for it to be freed
 *
 * https://golang.org/cmd/cgo/#hdr-Go_references_to_C
 */
public class GoodStringDemo {
    static {
        Native.register("awesome");
    }

    public static class GoString extends Structure {
        public static class ByValue extends GoString implements Structure.ByValue { }

        public String p;
        public long n;

        protected List getFieldOrder() {
            return Arrays.asList(new String[]{"p", "n"});
        }
    }

    public static native Pointer Hello(GoString.ByValue msg);

    public static void main(String[] args) {
        GoString.ByValue goStr = new GoString.ByValue();
        String msg = "jna demo";
        goStr.p = msg;
        goStr.n = msg.length();

        Pointer ptr = null;
        try {
            ptr = GoodStringDemo.Hello(goStr);
            System.out.println(ptr.getString(0, "utf8"));
        } finally {
            if (ptr != null) {
                Native.free(Pointer.nativeValue(ptr));
            }
        }
    }
}

