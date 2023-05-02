package hu.bathorydse.utrserver.controllers;

import hu.bathorydse.utrserver.models.Uszoverseny;
import hu.bathorydse.utrserver.models.UszoversenyNotFoundException;
import hu.bathorydse.utrserver.payload.request.EditUszoversenyRequest;
import hu.bathorydse.utrserver.payload.request.NewUszoversenyRequest;
import hu.bathorydse.utrserver.payload.response.MessageResponse;
import hu.bathorydse.utrserver.repository.UszoversenyRepository;
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
@RequestMapping("/api/uszoversenyek")
public class UszoversenyekController {

    @Autowired
    private UszoversenyRepository uszoversenyRepository;

    @GetMapping("/")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllVersenyek() {
        return ResponseEntity.ok(uszoversenyRepository.findAll());
    }

    @PostMapping("/")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createNewVerseny(
        @Valid @RequestBody NewUszoversenyRequest request
    ) {
        Uszoverseny uszoverseny = new Uszoverseny(request.getNev(),
            request.getHelyszin(), request.getDatum());

        uszoversenyRepository.save(uszoverseny);

        return ResponseEntity.ok(
            new MessageResponse("Úszóverseny létrehozva."));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'IDOROGZITO', 'ALLITOBIRO', 'SPEAKER')")
    public ResponseEntity<?> getVerseny(@PathVariable String id) {
        Long longId;
        try {
            longId = Long.valueOf(id);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(
                new MessageResponse("Hibás azonosító formátum.")
            );
        }

        Uszoverseny uszoverseny;
        try {
            uszoverseny = uszoversenyRepository.findById(longId)
                .orElseThrow(
                    () -> new UszoversenyNotFoundException(longId));
        } catch (UszoversenyNotFoundException e) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(uszoverseny);
    }

    @PostMapping("/{id}/edit")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> editVerseny(
        @PathVariable String id,
        @Valid @RequestBody EditUszoversenyRequest request
    ) {
        Long longId;
        try {
            longId = Long.valueOf(id);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(
                new MessageResponse("Hibás azonosító formátum.")
            );
        }

        Uszoverseny uszoverseny;
        try {
            uszoverseny = uszoversenyRepository.findById(longId)
                .orElseThrow(
                    () -> new UszoversenyNotFoundException(longId));
        } catch (UszoversenyNotFoundException e) {
            return ResponseEntity.notFound().build();
        }

        if (request.getNev() != null) {
            uszoverseny.setNev(request.getNev());
        }

        if (request.getHelyszin() != null) {
            uszoverseny.setHelyszin(request.getHelyszin());
        }

        if (request.getDatum() != null) {
            uszoverseny.setDatum(request.getDatum());
        }

        uszoversenyRepository.save(uszoverseny);

        return ResponseEntity.ok(new MessageResponse("Módosítások mentve."));
    }
}
