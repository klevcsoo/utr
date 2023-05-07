package hu.bathorydse.utrserver.controllers;

import hu.bathorydse.utrserver.models.Nevezes;
import hu.bathorydse.utrserver.models.NevezesNotFoundException;
import hu.bathorydse.utrserver.payload.response.MessageResponse;
import hu.bathorydse.utrserver.repository.NevezesRepository;
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

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/nevezesek")
@PreAuthorize("hasRole('ADMIN')")
public class NevezesekController {

    @Autowired
    private NevezesRepository nevezesRepository;

    @GetMapping("/")
    public ResponseEntity<?> getAllNevezesek(@RequestParam Long versenyszamId) {
        List<Nevezes> nevezesek = nevezesRepository.findAllByVersenyszamId(
            versenyszamId);
        return ResponseEntity.ok(nevezesek);
    }

    @PutMapping("/")
    public ResponseEntity<?> createNevezes(@RequestParam Long versenyszamId,
        @RequestParam Long uszoId,
        @RequestParam(required = false) String nevezesiIdo) {
        Integer interval;
        if (nevezesiIdo != null) {
            String minString = nevezesiIdo.split(":")[0];
            interval = Integer.parseInt(minString) * 60000;

            String secString = nevezesiIdo.split(":")[1];
            interval += (int) (Double.parseDouble(secString) * 1000);
        } else {
            interval = null;
        }

        Nevezes nevezes = new Nevezes(uszoId, versenyszamId, interval);
        nevezesRepository.save(nevezes);

        return ResponseEntity.ok(new MessageResponse("Nevezés hozzáadva."));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getNevezes(@PathVariable String id) {
        Nevezes nevezes;
        try {
            nevezes = retrieveNevezes(id);
        } catch (NevezesNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Hibás azonosító formátum."));
        }

        return ResponseEntity.ok(nevezes);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> editNevezes(@PathVariable String id,
        @RequestParam(required = false) Long versenyszamId,
        @RequestParam(required = false) Long uszoId,
        @RequestParam(required = false) String nevezesiIdo) {
        Nevezes nevezes;
        try {
            nevezes = retrieveNevezes(id);
        } catch (NevezesNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Hibás azonosító formátum."));
        }

        if (versenyszamId != null) {
            nevezes.setVersenyszamId(versenyszamId);
        }

        if (uszoId != null) {
            nevezes.setUszoId(uszoId);
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
    public ResponseEntity<?> deleteNevezes(@PathVariable String id) {
        Nevezes nevezes;
        try {
            nevezes = retrieveNevezes(id);
        } catch (NevezesNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Hibás azonosító formátum."));
        }

        nevezesRepository.delete(nevezes);
        return ResponseEntity.ok(new MessageResponse("Nevezés törölve."));
    }

    private Nevezes retrieveNevezes(String idString)
        throws NumberFormatException, NevezesNotFoundException {
        long id = Long.parseLong(idString);
        return nevezesRepository.findById(id)
            .orElseThrow(() -> new NevezesNotFoundException(id));
    }
}