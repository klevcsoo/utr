package hu.bathorydse.utrapi.controllers;

import hu.bathorydse.utrapi.models.UszoNotFoundException;
import hu.bathorydse.utrapi.models.Uszoverseny;
import hu.bathorydse.utrapi.models.UszoversenyNotFoundException;
import hu.bathorydse.utrapi.payload.response.MessageResponse;
import hu.bathorydse.utrapi.repository.UszoversenyRepository;
import java.util.Date;
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

@CrossOrigin(origins = {"http://localhost:3000", "https://utr.hu"}, maxAge = 3600)
@RestController
@RequestMapping("/api/uszoversenyek")
@PreAuthorize("hasRole('ADMIN')")
public class UszoversenyekController {

    @Autowired
    private UszoversenyRepository uszoversenyRepository;

    @GetMapping("/")
    public ResponseEntity<?> getAllVersenyek() {
        return ResponseEntity.ok(uszoversenyRepository.findAll(Sort.by(Direction.DESC, "datum")));
    }

    @PutMapping("/")
    public ResponseEntity<?> createNewVerseny(@RequestParam() String nev,
        @RequestParam(required = false) String helyszin,
        @RequestParam(required = false) @DateTimeFormat(iso = ISO.DATE_TIME) Date datum) {

        Uszoverseny uszoverseny = new Uszoverseny(nev, helyszin, datum);
        uszoversenyRepository.save(uszoverseny);

        return ResponseEntity.ok(new MessageResponse("Úszóverseny létrehozva."));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getVerseny(@PathVariable Long id) {
        Uszoverseny uszoverseny = uszoversenyRepository.findById(id)
            .orElseThrow(() -> new UszoNotFoundException(id));

        return ResponseEntity.ok(uszoverseny);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> editVerseny(@PathVariable Long id,
        @RequestParam(required = false) String nev, @RequestParam(required = false) String helyszin,
        @RequestParam(required = false) @DateTimeFormat(iso = ISO.DATE_TIME) Date datum) {
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

        return ResponseEntity.ok(new MessageResponse("Módosítások mentve."));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVerseny(@PathVariable Long id) {
        Uszoverseny uszoverseny = uszoversenyRepository.findById(id)
            .orElseThrow(() -> new UszoNotFoundException(id));

        uszoversenyRepository.delete(uszoverseny);

        return ResponseEntity.ok(new MessageResponse("Úszóverseny törölve."));
    }

    @PostMapping("/{id}/megnyitas")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> uszoversenyMegnyitasa(@PathVariable Long id) {
        Uszoverseny uszoverseny = uszoversenyRepository.findById(id)
            .orElseThrow(() -> new UszoversenyNotFoundException(id));

        uszoverseny.setNyitott(true);
        uszoversenyRepository.save(uszoverseny);

        return ResponseEntity.ok(new MessageResponse("Úszóverseny megnyitva."));
    }
}
