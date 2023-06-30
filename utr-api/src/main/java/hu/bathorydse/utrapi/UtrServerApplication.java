package hu.bathorydse.utrapi;

import hu.bathorydse.utrapi.core.ConsoleOutputStream;
import java.io.PrintStream;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class UtrServerApplication {

    public static void main(String[] args) {
        ConsoleOutputStream consoleOutputStream = ConsoleOutputStream.getInstance(System.out);
        System.setOut(new PrintStream(consoleOutputStream));

        SpringApplication.run(UtrServerApplication.class, args);
    }
}
