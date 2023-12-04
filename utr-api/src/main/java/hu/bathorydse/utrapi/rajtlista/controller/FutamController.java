package hu.bathorydse.utrapi.rajtlista.controller;

import hu.bathorydse.utrapi.core.response.MessageResponse;
import hu.bathorydse.utrapi.language.UtrMessageSource;
import hu.bathorydse.utrapi.rajtlista.FutamNotFoundException;
import hu.bathorydse.utrapi.rajtlista.model.Futam;
import hu.bathorydse.utrapi.rajtlista.model.NevezesDetailed;
import hu.bathorydse.utrapi.rajtlista.repository.FutamRepository;
import java.util.List;
import java.util.Locale;
import java.util.Set;
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

@CrossOrigin(origins = {"http://localhost:3000", "https://utr.hu"}, maxAge = 43200)
@RestController
@RequestMapping("/api/futamok")
@PreAuthorize("hasRole('ADMIN')")
public class FutamController {

    @Autowired
    private FutamRepository futamRepository;

    @Autowired
    private UtrMessageSource messageSource;

    @GetMapping("/")
    public ResponseEntity<List<Futam>> getAllFutamok(@RequestParam Long versenyszamId) {
        return ResponseEntity.ok(futamRepository.findAllByVersenyszamId(versenyszamId));
    }

    @PutMapping("/")
    public ResponseEntity<MessageResponse> createFutam(@RequestParam Long versenyszamId,
        Locale locale) {
        Futam futam = new Futam(versenyszamId);
        futamRepository.save(futam);

        return ResponseEntity.ok(new MessageResponse(messageSource.get(locale, "futamok.created")));
    }

    @GetMapping("/{futamId}/rajtlista")
    public ResponseEntity<Set<NevezesDetailed>> getRajtlista(@PathVariable Long futamId) {
        Futam futam = futamRepository.findById(futamId)
            .orElseThrow(() -> new FutamNotFoundException(futamId));

        return ResponseEntity.ok(futam.getRajtlista());
    }
}
