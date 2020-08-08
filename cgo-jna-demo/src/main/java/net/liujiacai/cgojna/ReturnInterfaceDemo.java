package net.liujiacai.cgojna;

import com.sun.jna.Native;
import com.sun.jna.Pointer;
import com.sun.jna.Structure;

import java.util.Arrays;
import java.util.List;

/**
 * This class demonstrate GoInterface as return will fail
 *
 * panic: runtime error: cgo result has Go pointer
 *
 * goroutine 17 [running, locked to thread]:
 * main._cgoexpwrap_b7dfd29f42f3_ReturnInterface.func1(0xc000052e90)
 * 	_cgo_gotypes.go:114 +0x40
 * main._cgoexpwrap_b7dfd29f42f3_ReturnInterface(0x1318634a0, 0xc0000561e0)
 * 	_cgo_gotypes.go:116 +0x9f
 */
public class ReturnInterfaceDemo {
    static {
        Native.register("awesome");
    }

    // typedef struct { void *t; void *v; } GoInterface;
    @Structure.FieldOrder({"t", "v"})
    public static class GoInterface extends Structure implements Structure.ByValue {
        public Pointer t;
        public Pointer v;
    }

    public static native GoInterface ReturnInterface();

    public static void main(String[] args) {
        GoInterface ret = null;
        try {
            ret = ReturnInterfaceDemo.ReturnInterface();
            System.out.println("ret = " + ret);
            System.out.println("t = " + ret.t);
            System.out.println("v = " + ret.v);
        } finally {
            if (ret != null) {
                if (ret.t != null) {
                    Native.free(Pointer.nativeValue(ret.t));
                }
                if (ret.v != null) {
                    Native.free(Pointer.nativeValue(ret.v));
                }
            }
        }
    }
}
