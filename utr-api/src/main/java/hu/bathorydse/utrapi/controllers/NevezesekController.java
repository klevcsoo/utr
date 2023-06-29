package hu.bathorydse.utrapi.controllers;

import hu.bathorydse.utrapi.models.Nevezes;
import hu.bathorydse.utrapi.models.NevezesNotFoundException;
import hu.bathorydse.utrapi.models.UszoDetailed;
import hu.bathorydse.utrapi.models.UszoNotFoundException;
import hu.bathorydse.utrapi.payload.response.MessageResponse;
import hu.bathorydse.utrapi.repository.NevezesRepository;
import hu.bathorydse.utrapi.repository.UszoDetailedRepository;
import java.util.List;
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

@CrossOrigin(origins = {"http://localhost:3000", "https://utr.hu"}, maxAge = 3600)
@RestController
@RequestMapping("/api/nevezesek")
@PreAuthorize("hasRole('ADMIN')")
public class NevezesekController {

    @Autowired
    private NevezesRepository nevezesRepository;

    @Autowired
    private UszoDetailedRepository uszoDetailedRepository;

    @GetMapping("/")
    public ResponseEntity<?> getAllNevezesek(@RequestParam Long versenyszamId) {
        List<Nevezes> nevezesek = nevezesRepository.findAllByVersenyszamId(versenyszamId);
        return ResponseEntity.ok(nevezesek);
    }

    @PutMapping("/")
    public ResponseEntity<?> createNevezes(@RequestParam Long versenyszamId,
        @RequestParam Long uszoId, @RequestParam(required = false) String nevezesiIdo) {
        Integer interval;
        if (nevezesiIdo != null) {
            String minString = nevezesiIdo.split(":")[0];
            interval = Integer.parseInt(minString) * 60000;

            String secString = nevezesiIdo.split(":")[1];
            interval += (int) (Double.parseDouble(secString) * 1000);
        } else {
            interval = null;
        }

        UszoDetailed uszo = uszoDetailedRepository.findById(uszoId)
            .orElseThrow(() -> new UszoNotFoundException(uszoId));

        Nevezes nevezes = new Nevezes(uszo, versenyszamId, interval);
        nevezesRepository.save(nevezes);

        return ResponseEntity.ok(new MessageResponse("Nevezés hozzáadva."));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getNevezes(@PathVariable Long id) {
        Nevezes nevezes = nevezesRepository.findById(id)
            .orElseThrow(() -> new NevezesNotFoundException(id));

        return ResponseEntity.ok(nevezes);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> editNevezes(@PathVariable Long id,
        @RequestParam(required = false) Long versenyszamId,
        @RequestParam(required = false) Long uszoId,
        @RequestParam(required = false) String nevezesiIdo) {
        Nevezes nevezes = nevezesRepository.findById(id)
            .orElseThrow(() -> new NevezesNotFoundException(id));

        if (versenyszamId != null) {
            nevezes.setVersenyszamId(versenyszamId);
        }

        if (uszoId != null) {
            UszoDetailed uszo = uszoDetailedRepository.findById(uszoId)
                .orElseThrow(() -> new UszoNotFoundException(uszoId));

            nevezes.setUszo(uszo);
        }

        if (nevezesiIdo != null) {
            int interval;
            String minString = nevezesiIdo.split(":")[0];
            interval = Integer.parseInt(minString) * 60000;

            String secString = nevezesiIdo.split(":")[1];
            interval += (int) (Double.parseDouble(secString) * 1000);

            nevezes.setNevezesiIdo(interval);
        }

        nevezesRepository.save(nevezes);

        return ResponseEntity.ok(new MessageResponse("Módosítások mentve"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNevezes(@PathVariable Long id) {
        Nevezes nevezes = nevezesRepository.findById(id)
            .orElseThrow(() -> new NevezesNotFoundException(id));

        nevezesRepository.delete(nevezes);
        return ResponseEntity.ok(new MessageResponse("Nevezés törölve."));
    }
}
