package hu.bathorydse.utrserver.controllers;

import hu.bathorydse.utrserver.models.Futam;
import hu.bathorydse.utrserver.models.Versenyszam;
import hu.bathorydse.utrserver.models.VersenyszamNotFoundException;
import hu.bathorydse.utrserver.payload.response.MessageResponse;
import hu.bathorydse.utrserver.repository.VersenyszamRepository;
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

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/versenyszamok")
public class VersenyszamokController {

    @Autowired
    private VersenyszamRepository versenyszamRepository;

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'IDOROGZITO', 'ALLITOBIRO', 'SPEAKER')")
    public ResponseEntity<?> getVersenyszam(
        @PathVariable String id
    ) {
        Versenyszam versenyszam;
        try {
            versenyszam = retrieveVersenyszam(id);
        } catch (VersenyszamNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(
                new MessageResponse("Hibás azonosító formátum.")
            );
        }

        return ResponseEntity.ok(versenyszam);
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> editVersenyszam(
        @PathVariable String id,
        @RequestParam(required = false) Integer hossz,
        @RequestParam(required = false) Integer uszasnem,
        @RequestParam(required = false) @Size(min = 1, max = 1) String emberiNem,
        @RequestParam(required = false) Integer valto
    ) {
        Versenyszam versenyszam;
        try {
            versenyszam = retrieveVersenyszam(id);
        } catch (VersenyszamNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(
                new MessageResponse("Hibás azonosító formátum.")
            );
        }

        if (hossz != null) {
            versenyszam.setHossz(hossz);
        }

        if (uszasnem != null) {
            versenyszam.setUszasnemId(uszasnem);
        }

        if (emberiNem != null) {
            versenyszam.setEmberiNemId(emberiNem);
        }

        if (valto != null) {
            versenyszam.setValto(valto);
        }

        versenyszamRepository.save(versenyszam);

        return ResponseEntity.ok(
            new MessageResponse("Módosítások mentve.")
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteVersenyszam(@PathVariable String id) {
        Versenyszam versenyszam;
        try {
            versenyszam = retrieveVersenyszam(id);
        } catch (VersenyszamNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(
                new MessageResponse("Hibás azonosító formátum.")
            );
        }

        versenyszamRepository.delete(versenyszam);

        return ResponseEntity.ok(
            new MessageResponse("Versenyszám törölve.")
        );
    }

    @GetMapping("/{id}/futamok/")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllFutamok(@PathVariable String id) {
        Versenyszam versenyszam;
        try {
            versenyszam = retrieveVersenyszam(id);
        } catch (VersenyszamNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(
                new MessageResponse("Hibás azonosító formátum.")
            );
        }

        return ResponseEntity.ok(versenyszam.getFutamok());
    }

    @PutMapping("/{id}/futamok/")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createFutam(@PathVariable String id) {
        Versenyszam versenyszam;
        try {
            versenyszam = retrieveVersenyszam(id);
        } catch (VersenyszamNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(
                new MessageResponse("Hibás azonosító formátum.")
            );
        }

        versenyszam.getFutamok().add(new Futam(versenyszam.getId()));
        versenyszamRepository.save(versenyszam);

        return ResponseEntity.ok(
            new MessageResponse("Futam létrehozva.")
        );
    }

    private Versenyszam retrieveVersenyszam(String idString)
        throws VersenyszamNotFoundException, NumberFormatException {
        long id = Long.parseLong(idString);
        return versenyszamRepository.findById(id)
            .orElseThrow(() -> new VersenyszamNotFoundException(id));
    }
}
