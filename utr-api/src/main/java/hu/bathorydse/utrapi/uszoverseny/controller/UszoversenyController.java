package hu.bathorydse.utrapi.uszoverseny.controller;

import hu.bathorydse.utrapi.core.response.MessageResponse;
import hu.bathorydse.utrapi.csapat.UszoNotFoundException;
import hu.bathorydse.utrapi.language.UtrMessageSource;
import hu.bathorydse.utrapi.uszoverseny.UszoversenyNotFoundException;
import hu.bathorydse.utrapi.uszoverseny.model.Uszoverseny;
import hu.bathorydse.utrapi.uszoverseny.repository.UszoversenyRepository;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = {"http://localhost:3000", "https://utr.hu"}, maxAge = 43200)
@RestController
@RequestMapping("/api/uszoversenyek")
@PreAuthorize("hasRole('ADMIN')")
public class UszoversenyController {

    @Autowired
    private UszoversenyRepository uszoversenyRepository;

    @Autowired
    private UtrMessageSource messageSource;

    @GetMapping("/")
    public ResponseEntity<List<Uszoverseny>> getAllVersenyek() {
        return ResponseEntity.ok(uszoversenyRepository.findAll(Sort.by(Direction.DESC, "datum")));
    }

    @PutMapping("/")
    public ResponseEntity<MessageResponse> createNewVerseny(@RequestParam() String nev,
        @RequestParam(required = false) String helyszin,
        @RequestParam(required = false) @DateTimeFormat(iso = ISO.DATE_TIME) Date datum,
        Locale locale) {

        Uszoverseny uszoverseny = new Uszoverseny(nev, helyszin, datum);
        uszoversenyRepository.save(uszoverseny);

        return ResponseEntity.ok(
            new MessageResponse(messageSource.get(locale, "uszoversenyek.created")));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Uszoverseny> getVerseny(@PathVariable Long id) {
        Uszoverseny uszoverseny = uszoversenyRepository.findById(id)
            .orElseThrow(() -> new UszoNotFoundException(id));

        return ResponseEntity.ok(uszoverseny);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<MessageResponse> editVerseny(@PathVariable Long id,
        @RequestParam(required = false) String nev, @RequestParam(required = false) String helyszin,
        @RequestParam(required = false) @DateTimeFormat(iso = ISO.DATE_TIME) Date datum,
        Locale locale) {
        Uszoverseny uszoverseny = uszoversenyRepository.findById(id)
            .orElseThrow(() -> new UszoNotFoundException(id));

        if (nev != null) {
            uszoverseny.setNev(nev);
        }

        if (helyszin != null) {
            uszoverseny.setHelyszin(helyszin);
        }

        if (datum != null) {
            uszoverseny.setDatum(datum);
        }

        uszoversenyRepository.save(uszoverseny);

        return ResponseEntity.ok(
            new MessageResponse(messageSource.get(locale, "generic.changes_saved")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteVerseny(@PathVariable Long id, Locale locale) {
        Uszoverseny uszoverseny = uszoversenyRepository.findById(id)
            .orElseThrow(() -> new UszoNotFoundException(id));

        uszoversenyRepository.delete(uszoverseny);

        return ResponseEntity.ok(
            new MessageResponse(messageSource.get(locale, "uszoversenyek.deleted")));
    }

    @PostMapping("/{id}/megnyitas")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> uszoversenyMegnyitasa(@PathVariable Long id,
        Locale locale) {
        Uszoverseny uszoverseny = uszoversenyRepository.findById(id)
            .orElseThrow(() -> new UszoversenyNotFoundException(id));

        uszoverseny.setNyitott(true);
        uszoversenyRepository.save(uszoverseny);

        return ResponseEntity.ok(
            new MessageResponse(messageSource.get(locale, "uszoversenyek.opened")));
    }
}
