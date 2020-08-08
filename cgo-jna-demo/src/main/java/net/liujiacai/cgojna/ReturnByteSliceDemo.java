package net.liujiacai.cgojna;

import com.sun.jna.Native;
import com.sun.jna.Pointer;
import com.sun.jna.Structure;

import java.util.Arrays;
import java.util.List;

public class ReturnByteSliceDemo {
    static {
        Native.register("awesome");
    }

    public static class ReturnByteSlice_return extends Structure {
        public static class ByValue extends ReturnByteSlice_return implements Structure.ByValue {
        }

        public Pointer r0;
        public long r1;

        protected List getFieldOrder() {
            return Arrays.asList(new String[]{"r0", "r1"});
        }
    }

    public static native ReturnByteSlice_return.ByValue ReturnByteSlice();

    public static void main(String[] args) {
        ReturnByteSlice_return.ByValue ret = null;
        try {
            ret = ReturnByteSliceDemo.ReturnByteSlice();
            byte[] buf = ret.r0.getByteArray(0, (int) ret.r1);
            System.out.println(Native.toString(buf, "utf8"));
        } finally {
            if (ret != null && ret.r0 != null) {
                System.out.println("free pointer: " + ret.r0);
                Native.free(Pointer.nativeValue(ret.r0));
            }
        }
    }
}
