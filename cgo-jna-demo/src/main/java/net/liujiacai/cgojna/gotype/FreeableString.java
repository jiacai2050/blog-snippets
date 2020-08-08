package net.liujiacai.cgojna.gotype;

import com.sun.jna.Native;
import com.sun.jna.Pointer;
import com.sun.jna.PointerType;

public class FreeableString extends PointerType implements AutoCloseable {
    @Override
    public void close() {
        Pointer ptr = this.getPointer();
        if (ptr != null) {
            Native.free(Pointer.nativeValue(this.getPointer()));
        }
    }

    public String getString() {
        return this.getPointer().getString(0, "utf-8");
    }
}
