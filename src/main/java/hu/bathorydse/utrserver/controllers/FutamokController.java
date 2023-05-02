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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/futamok/{futamId}")
public class FutamokController {

    @Autowired
    FutamRepository futamRepository;

    @GetMapping("/rajtlista")
    @PreAuthorize("hasAnyRole('ADMIN', 'IDOROGZITO', 'ALLITOBIRO', 'SPEAKER')")
    public ResponseEntity<?> getRajtlista(@PathVariable String futamId) {
        Futam futam;
        try {
            futam = retrieveFutam(futamId);
        } catch (FutamNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(
                new MessageResponse("Hibás azonosító formátum.")
            );
        }

        return ResponseEntity.ok(futam.getRajtlista());
    }

    private Futam retrieveFutam(String idString)
        throws FutamNotFoundException, NumberFormatException {
        long id = Long.parseLong(idString);
        return futamRepository.findById(id)
            .orElseThrow(() -> new FutamNotFoundException(id));
    }
}
