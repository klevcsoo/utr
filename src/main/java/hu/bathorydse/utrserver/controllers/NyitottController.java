package hu.bathorydse.utrserver.controllers;

import hu.bathorydse.utrserver.models.NoNyitottUszoversenyException;
import hu.bathorydse.utrserver.models.Uszoverseny;
import hu.bathorydse.utrserver.models.UszoversenyNotFoundException;
import hu.bathorydse.utrserver.payload.response.MessageResponse;
import hu.bathorydse.utrserver.repository.UszoversenyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/nyitott")
public class NyitottController {

    @Autowired
    private UszoversenyRepository uszoversenyRepository;

    @PostMapping("/megnyitas")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> uszoversenyMegnyitasa(
        @RequestParam Long versenyId) {
        Uszoverseny uszoverseny = uszoversenyRepository.findById(versenyId)
            .orElseThrow(() -> new UszoversenyNotFoundException(versenyId));

        uszoverseny.setNyitott(true);
        uszoversenyRepository.save(uszoverseny);

        return ResponseEntity.ok(new MessageResponse("Úszóverseny megnyitva."));
    }

    @PostMapping("/lezaras")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> uszoversenyLezarasa() {
        Uszoverseny uszoverseny = uszoversenyRepository.findByNyitott(true)
            .orElseThrow(NoNyitottUszoversenyException::new);

        uszoverseny.setNyitott(false);
        uszoversenyRepository.save(uszoverseny);

        return ResponseEntity.ok(new MessageResponse("Úszóverseny lezárva."));
    }
}
