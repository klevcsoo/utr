package hu.bathorydse.utrserver.controllers;

import hu.bathorydse.utrserver.models.Futam;
import hu.bathorydse.utrserver.models.FutamNotFoundException;
import hu.bathorydse.utrserver.payload.response.MessageResponse;
import hu.bathorydse.utrserver.repository.FutamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = {"http://localhost:3000", "https://utr.hu"}, maxAge = 3600)
@RestController
@RequestMapping("/api/futamok")
@PreAuthorize("hasRole('ADMIN')")
public class FutamokController {

    @Autowired
    FutamRepository futamRepository;

    @GetMapping("/")
    public ResponseEntity<?> getAllFutamok(@RequestParam Long versenyszamId) {
        return ResponseEntity.ok(futamRepository.findAllByVersenyszamId(versenyszamId));
    }

    @PutMapping("/")
    public ResponseEntity<?> createFutam(@RequestParam Long versenyszamId) {
        Futam futam = new Futam(versenyszamId);
        futamRepository.save(futam);

        return ResponseEntity.ok(new MessageResponse("Futam hozzáadva."));
    }

    @GetMapping("/{futamId}/rajtlista")
    public ResponseEntity<?> getRajtlista(@PathVariable Long futamId) {
        Futam futam = futamRepository.findById(futamId)
            .orElseThrow(() -> new FutamNotFoundException(futamId));

        return ResponseEntity.ok(futam.getRajtlista());
    }
}
