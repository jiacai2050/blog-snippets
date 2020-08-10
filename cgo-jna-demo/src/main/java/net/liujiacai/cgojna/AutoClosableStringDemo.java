package net.liujiacai.cgojna;

import com.sun.jna.*;
import net.liujiacai.cgojna.gotype.Constants;
import net.liujiacai.cgojna.gotype.FreeableString;
import net.liujiacai.cgojna.gotype.GoString;

import java.io.UnsupportedEncodingException;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * This class demonstrate how to utilize AutoClosable and try-with-resources to deal with *char free
 * Reference:
 * https://stackoverflow.com/a/48270500
 */
public class AutoClosableStringDemo {
    static {
        Native.register(NativeLibrary.getInstance("awesome",
                Collections.singletonMap(Library.OPTION_STRING_ENCODING, Constants.UTF8)));
    }

    public static native FreeableString Hello(GoString.ByValue msg);

    public static void main(String[] args) throws UnsupportedEncodingException {
        GoString.ByValue goStr = new GoString.ByValue("中国 China");

        try (FreeableString freeableString = AutoClosableStringDemo.Hello(goStr)) {
            System.out.println(freeableString.getString());
        }
    }
}

