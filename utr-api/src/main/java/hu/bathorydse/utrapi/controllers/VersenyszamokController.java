package hu.bathorydse.utrapi.controllers;

import hu.bathorydse.utrapi.language.UtrMessageSource;
import hu.bathorydse.utrapi.models.InvalidUszasnemException;
import hu.bathorydse.utrapi.models.Uszasnem;
import hu.bathorydse.utrapi.models.Versenyszam;
import hu.bathorydse.utrapi.models.VersenyszamNotFoundException;
import hu.bathorydse.utrapi.payload.response.MessageResponse;
import hu.bathorydse.utrapi.repository.UszasnemRepository;
import hu.bathorydse.utrapi.repository.VersenyszamRepository;
import java.util.List;
import java.util.Locale;
import javax.validation.constraints.Size;
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
    private UszasnemRepository uszasnemRepository;

    @Autowired
    private UtrMessageSource messageSource;

    @GetMapping("/")
    public ResponseEntity<List<Versenyszam>> getAllVersenyszamok(@RequestParam Long versenyId) {
        return ResponseEntity.ok(versenyszamRepository.findAllByVersenyId(versenyId));
    }

    @PutMapping("/")
    public ResponseEntity<MessageResponse> createVersenyszam(@RequestParam Long versenyId,
        @RequestParam Integer hossz, @RequestParam Integer uszasnemId,
        @RequestParam @Size(min = 1, max = 1) String emberiNemId,
        @RequestParam(required = false) Integer valto,
        Locale locale) {
        Uszasnem uszasnem = uszasnemRepository.findById(uszasnemId)
            .orElseThrow(InvalidUszasnemException::new);

        Versenyszam versenyszam = new Versenyszam(versenyId, hossz, uszasnem, emberiNemId, valto);
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
        @RequestParam(required = false) Integer uszasnem,
        @RequestParam(required = false) @Size(min = 1, max = 1) String nem,
        @RequestParam(required = false) Integer valto,
        Locale locale) {
        Versenyszam versenyszam = versenyszamRepository.findById(id)
            .orElseThrow(() -> new VersenyszamNotFoundException(id));

        if (hossz != null) {
            versenyszam.setHossz(hossz);
        }

        if (uszasnem != null) {
            Uszasnem uszasnemObj = uszasnemRepository.findById(uszasnem)
                .orElseThrow(InvalidUszasnemException::new);
            versenyszam.setUszasnem(uszasnemObj);
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
