package hu.bathorydse.utrapi.core;

import java.io.OutputStream;
import java.io.PrintStream;

public class ConsoleOutputStream extends OutputStream {

    private static ConsoleOutputStream instance;
    private final StringBuilder buffer;
    private final PrintStream originalOutputStream;

    private ConsoleOutputStream(PrintStream originalOutputStream) {
        this.buffer = new StringBuilder();
        this.originalOutputStream = originalOutputStream;
    }

    public static synchronized ConsoleOutputStream getInstance(PrintStream originalOutputStream) {
        if (instance == null && originalOutputStream != null) {
            instance = new ConsoleOutputStream(originalOutputStream);
        }
        return instance;
    }

    public static synchronized ConsoleOutputStream getInstance() {
        return getInstance(null);
    }

    @Override
    public void write(int b) {
        char c = (char) b;
        buffer.append(c);
        originalOutputStream.write(b);
    }

    public String getConsoleOutput() {
        return buffer.toString();
    }
}
