package hu.bathorydse.utrapi.controllers;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = {"http://localhost:3000", "https://utr.hu"}, maxAge = 3600)
@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/all")
    public String allAccess() {
        return "Public access.";
    }

    @GetMapping("/speaker")
    @PreAuthorize("hasRole('SPEAKER')")
    public String speakerAccess() {
        return "Speaker access.";
    }

    @GetMapping("/allitobiro")
    @PreAuthorize("hasRole('ALLITOBIRO')")
    public String allitobiroAccess() {
        return "Állítóbíró access.";
    }

    @GetMapping("/idorogzito")
    @PreAuthorize("hasRole('IDOROGZITO')")
    public String idorogzitoAccess() {
        return "Időrögzítő access.";
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public String adminAccess() {
        return "Admin access.";
    }
}
