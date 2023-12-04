package hu.bathorydse.utrapi.csapat.controller;

import hu.bathorydse.utrapi.core.response.MessageResponse;
import hu.bathorydse.utrapi.csapat.CsapatNotFoundException;
import hu.bathorydse.utrapi.csapat.model.Csapat;
import hu.bathorydse.utrapi.csapat.repository.CsapatRepository;
import hu.bathorydse.utrapi.language.UtrMessageSource;
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

@CrossOrigin(origins = {"http://localhost:3000", "https://utr.hu"}, maxAge = 43200)
@RestController
@RequestMapping("/api/csapatok")
@PreAuthorize("hasRole('ADMIN')")
public class CsapatController {

    @Autowired
    private CsapatRepository csapatRepository;

    @Autowired
    private UtrMessageSource messageSource;

    @GetMapping("/")
    public ResponseEntity<List<Csapat>> getAllCsapatok() {
        return ResponseEntity.ok(csapatRepository.findAll());
    }

    @PutMapping("/")
    public ResponseEntity<MessageResponse> createCsapat(@RequestParam String nev,
        @RequestParam(required = false) String varos, Locale locale) {
        Csapat csapat = new Csapat(nev, varos);
        csapatRepository.save(csapat);
        return ResponseEntity.ok(
            new MessageResponse(messageSource.get(locale, "csapatok.created")));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Csapat> getCsapat(@PathVariable Long id) {
        Csapat csapat = csapatRepository.findById(id)
            .orElseThrow(() -> new CsapatNotFoundException(id));

        return ResponseEntity.ok(csapat);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<MessageResponse> editCsapat(@PathVariable Long id,
        @RequestParam(required = false) String nev, @RequestParam(required = false) String varos,
        Locale locale) {
        Csapat csapat = csapatRepository.findById(id)
            .orElseThrow(() -> new CsapatNotFoundException(id));

        if (nev != null) {
            csapat.setNev(nev);
        }

        if (varos != null) {
            csapat.setVaros(varos);
        }

        csapatRepository.save(csapat);

        return ResponseEntity.ok(
            new MessageResponse(messageSource.get(locale, "generic.changes_saved")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteCsapat(@PathVariable Long id, Locale locale) {
        Csapat csapat = csapatRepository.findById(id)
            .orElseThrow(() -> new CsapatNotFoundException(id));

        csapatRepository.delete(csapat);

        return ResponseEntity.ok(
            new MessageResponse(messageSource.get(locale, "csapatok.deleted")));
    }
}
