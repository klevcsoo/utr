package hu.bathorydse.utrapi.core.controller;

import hu.bathorydse.utrapi.language.UtrMessageSource;
import java.util.Locale;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = {"http://localhost:3000", "https://utr.hu"}, maxAge = 43200)
@RestController
@RequestMapping("/api/test")
public class TestController {

    @Autowired
    private UtrMessageSource messageSource;

    @GetMapping("/all")
    public String allAccess(Locale locale) {
        return messageSource.get(locale, "auth.test.public");
    }

    @GetMapping("/speaker")
    @PreAuthorize("hasRole('SPEAKER')")
    public String speakerAccess(Locale locale, Authentication authentication) {
        String authName = authentication.getName();
        return messageSource.get(locale, "auth.test.not_public", authName);
    }

    @GetMapping("/allitobiro")
    @PreAuthorize("hasRole('ALLITOBIRO')")
    public String allitobiroAccess(Locale locale, Authentication authentication) {
        String authName = authentication.getName();
        return messageSource.get(locale, "auth.test.not_public", authName);
    }

    @GetMapping("/idorogzito")
    @PreAuthorize("hasRole('IDOROGZITO')")
    public String idorogzitoAccess(Locale locale, Authentication authentication) {
        String authName = authentication.getName();
        return messageSource.get(locale, "auth.test.not_public", authName);
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public String adminAccess(Locale locale, Authentication authentication) {
        String authName = authentication.getName();
        return messageSource.get(locale, "auth.test.not_public", authName);
    }
}
