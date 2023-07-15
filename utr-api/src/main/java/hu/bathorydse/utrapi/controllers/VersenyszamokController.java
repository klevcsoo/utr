package hu.bathorydse.utrapi.controllers;

import hu.bathorydse.utrapi.language.UtrMessageSource;
import hu.bathorydse.utrapi.models.uszo.ENem;
import hu.bathorydse.utrapi.models.versenyszam.EUszasnem;
import hu.bathorydse.utrapi.models.versenyszam.Versenyszam;
import hu.bathorydse.utrapi.models.versenyszam.VersenyszamNotFoundException;
import hu.bathorydse.utrapi.payload.response.MessageResponse;
import hu.bathorydse.utrapi.repository.VersenyszamRepository;
import java.util.List;
import java.util.Locale;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = {"http://localhost:3000", "https://utr.hu"}, maxAge = 3600)
@RestController
@RequestMapping("/api/versenyszamok")
@PreAuthorize("hasRole('ADMIN')")
public class VersenyszamokController {

    @Autowired
    private VersenyszamRepository versenyszamRepository;

    @Autowired
    private UtrMessageSource messageSource;

    @GetMapping("/")
    public ResponseEntity<List<Versenyszam>> getAllVersenyszamok(@RequestParam Long versenyId) {
        return ResponseEntity.ok(versenyszamRepository.findAllByVersenyId(versenyId));
    }

    @PutMapping("/")
    public ResponseEntity<MessageResponse> createVersenyszam(@RequestParam Long versenyId,
        @RequestParam Integer hossz, @RequestParam EUszasnem uszasnemId,
        @RequestParam ENem emberiNemId, @RequestParam(required = false) Integer valto,
        Locale locale) {

        Versenyszam versenyszam = new Versenyszam(versenyId, hossz, uszasnemId, emberiNemId, valto);
        versenyszamRepository.save(versenyszam);

        return ResponseEntity.ok(
            new MessageResponse(messageSource.get(locale, "versenyszamok.created")));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Versenyszam> getVersenyszam(@PathVariable Long id) {
        Versenyszam versenyszam = versenyszamRepository.findById(id)
            .orElseThrow(() -> new VersenyszamNotFoundException(id));

        return ResponseEntity.ok(versenyszam);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<MessageResponse> editVersenyszam(@PathVariable Long id,
        @RequestParam(required = false) Integer hossz,
        @RequestParam(required = false) EUszasnem uszasnem,
        @RequestParam(required = false) ENem nem, @RequestParam(required = false) Integer valto,
        Locale locale) {
        Versenyszam versenyszam = versenyszamRepository.findById(id)
            .orElseThrow(() -> new VersenyszamNotFoundException(id));

        if (hossz != null) {
            versenyszam.setHossz(hossz);
        }

        if (uszasnem != null) {
            versenyszam.setUszasnem(uszasnem);
        }

        if (nem != null) {
            versenyszam.setNem(nem);
        }

        if (valto != null) {
            versenyszam.setValto(valto);
        }

        versenyszamRepository.save(versenyszam);

        return ResponseEntity.ok(
            new MessageResponse(messageSource.get(locale, "generic.changes_saved")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteVersenyszam(@PathVariable Long id, Locale locale) {
        Versenyszam versenyszam = versenyszamRepository.findById(id)
            .orElseThrow(() -> new VersenyszamNotFoundException(id));

        versenyszamRepository.delete(versenyszam);

        return ResponseEntity.ok(
            new MessageResponse(messageSource.get(locale, "versenyszamok.deleted")));
    }
}
