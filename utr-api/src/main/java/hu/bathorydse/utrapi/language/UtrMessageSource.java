package hu.bathorydse.utrapi.language;

import java.util.Locale;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

@Component
public class UtrMessageSource {

    @Autowired
    MessageSource messageSource;

    public String get(Locale locale, String key, String... arguments) {
        return messageSource.getMessage(key, arguments, locale);
    }
}
