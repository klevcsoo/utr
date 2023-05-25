package hu.bathorydse.utrserver.controllers;

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
@PreAuthorize("hasRole('ADMIN')")
public class VersenyszamokController {

    @Autowired
    private VersenyszamRepository versenyszamRepository;

    @GetMapping("/")
    public ResponseEntity<?> getAllVersenyszamok(@RequestParam Long versenyId) {
        return ResponseEntity.ok(
            versenyszamRepository.findAllByVersenyId(versenyId));
    }

    @PutMapping("/")
    public ResponseEntity<?> createVersenyszam(@RequestParam Long versenyId,
        @RequestParam Integer hossz, @RequestParam Integer uszasnemId,
        @RequestParam @Size(min = 1, max = 1) String emberiNemId,
        @RequestParam(required = false) Integer valto) {
        Versenyszam versenyszam = new Versenyszam(versenyId, hossz, uszasnemId,
            emberiNemId, valto);
        versenyszamRepository.save(versenyszam);

        return ResponseEntity.ok(new MessageResponse("Versenyszám hozzáadva."));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getVersenyszam(@PathVariable Long id) {
        Versenyszam versenyszam = versenyszamRepository.findById(id)
            .orElseThrow(() -> new VersenyszamNotFoundException(id));

        return ResponseEntity.ok(versenyszam);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> editVersenyszam(@PathVariable Long id,
        @RequestParam(required = false) Integer hossz,
        @RequestParam(required = false) Integer uszasnem,
        @RequestParam(required = false) @Size(min = 1, max = 1) String nem,
        @RequestParam(required = false) Integer valto) {
        Versenyszam versenyszam = versenyszamRepository.findById(id)
            .orElseThrow(() -> new VersenyszamNotFoundException(id));

        if (hossz != null) {
            versenyszam.setHossz(hossz);
        }

        if (uszasnem != null) {
            versenyszam.setUszasnemId(uszasnem);
        }

        if (nem != null) {
            versenyszam.setNem(nem);
        }

        if (valto != null) {
            versenyszam.setValto(valto);
        }

        versenyszamRepository.save(versenyszam);

        return ResponseEntity.ok(new MessageResponse("Módosítások mentve."));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVersenyszam(@PathVariable Long id) {
        Versenyszam versenyszam = versenyszamRepository.findById(id)
            .orElseThrow(() -> new VersenyszamNotFoundException(id));

        versenyszamRepository.delete(versenyszam);

        return ResponseEntity.ok(new MessageResponse("Versenyszám törölve."));
    }
}
