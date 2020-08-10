package net.liujiacai.cgojna;

import com.sun.jna.*;
import net.liujiacai.cgojna.gotype.Constants;
import net.liujiacai.cgojna.gotype.GoString;

import java.io.UnsupportedEncodingException;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * This class use Pointer to map *c.char, and free it after use.
 * JNA docs says:
 * If the native method returns char* and actually allocates memory, a return type of Pointer should be used to avoid leaking the memory.
 * It is then up to you to take the necessary steps to free the allocated memory.
 * <p>
 * http://java-native-access.github.io/jna/5.6.0/javadoc/overview-summary.html#strings
 * <p>
 * Cgo docs says:
 * The C string is allocated in the C heap using malloc.
 * It is the caller's responsibility to arrange for it to be freed
 * <p>
 * https://golang.org/cmd/cgo/#hdr-Go_references_to_C
 */
public class GoodStringDemo {

    static {
        Native.register(NativeLibrary.getInstance("awesome",
                Collections.singletonMap(Library.OPTION_STRING_ENCODING, Constants.UTF8)));
    }

    public static native Pointer Hello(GoString.ByValue msg);

    public static void main(String[] args) throws UnsupportedEncodingException {
        GoString.ByValue goStr = new GoString.ByValue();
        String msg = "jna 你好 demo";
        goStr.p = msg;
        goStr.n = msg.getBytes(Constants.UTF8).length;

        Pointer ptr = null;
        try {
            ptr = GoodStringDemo.Hello(goStr);
            System.out.println(ptr.getString(0, Constants.UTF8));
        } finally {
            if (ptr != null) {
                Native.free(Pointer.nativeValue(ptr));
            }
        }
    }
}

