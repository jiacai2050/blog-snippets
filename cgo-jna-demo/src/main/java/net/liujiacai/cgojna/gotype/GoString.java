package net.liujiacai.cgojna.gotype;

import com.sun.jna.Structure;

import java.io.UnsupportedEncodingException;

@Structure.FieldOrder({"p", "n"})
public class GoString extends Structure {
    public static class ByValue extends GoString implements Structure.ByValue {
        public ByValue() {
        }

        public ByValue(String s) {
            this.p = s;
            try {
                this.n = s.getBytes("utf8").length;
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
                throw new RuntimeException(e);
            }
        }
    }

    public String p;
    public long n;
}
