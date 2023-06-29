package hu.bathorydse.utrapi;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class UtrServerApplication {

    private static final Logger logger = LoggerFactory.getLogger(UtrServerApplication.class);

    public static void main(String[] args) {
        System.getenv().forEach((key, value) -> logger.info(key + "=" + value));
        SpringApplication.run(UtrServerApplication.class, args);
    }
}
