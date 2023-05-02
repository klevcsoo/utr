package hu.bathorydse.utrserver.controllers;

import hu.bathorydse.utrserver.models.Versenyszam;
import hu.bathorydse.utrserver.models.VersenyszamNotFoundException;
import hu.bathorydse.utrserver.payload.request.EditVersenyszamRequest;
import hu.bathorydse.utrserver.payload.response.MessageResponse;
import hu.bathorydse.utrserver.repository.VersenyszamRepository;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
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
        long longId;
        try {
            longId = Long.parseLong(id);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(
                new MessageResponse("Hibás azonosító formátum.")
            );
        }

        Versenyszam versenyszam;
        try {
            versenyszam = versenyszamRepository.findById(longId)
                .orElseThrow(() -> new VersenyszamNotFoundException(longId));
        } catch (VersenyszamNotFoundException e) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(versenyszam);
    }

    @PostMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> editVersenyszam(
        @PathVariable String id,
        @Valid @RequestBody EditVersenyszamRequest request
    ) {
        long longId;
        try {
            longId = Long.parseLong(id);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(
                new MessageResponse("Hibás azonosító formátum.")
            );
        }

        Versenyszam versenyszam;
        try {
            versenyszam = versenyszamRepository.findById(longId)
                .orElseThrow(() -> new VersenyszamNotFoundException(longId));
        } catch (VersenyszamNotFoundException e) {
            return ResponseEntity.notFound().build();
        }

        if (request.getHossz() != null) {
            versenyszam.setHossz(request.getHossz());
        }

        if (request.getUszasnemId() != null) {
            versenyszam.setUszasnem_id(request.getUszasnemId());
        }

        if (request.getEmberiNemId() != null) {
            versenyszam.setEmberi_nem_id(request.getEmberiNemId());
        }

        if (request.getValto() != null) {
            versenyszam.setValto(request.getValto());
        }

        versenyszamRepository.save(versenyszam);

        return ResponseEntity.ok(
            new MessageResponse("Módosítások mentve.")
        );
    }
}
