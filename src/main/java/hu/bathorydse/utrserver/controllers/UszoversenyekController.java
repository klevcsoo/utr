package hu.bathorydse.utrserver.controllers;

import hu.bathorydse.utrserver.core.ControllerUtils;
import hu.bathorydse.utrserver.models.Uszoverseny;
import hu.bathorydse.utrserver.models.UszoversenyNotFoundException;
import hu.bathorydse.utrserver.payload.response.MessageResponse;
import hu.bathorydse.utrserver.repository.UszoversenyRepository;
import java.util.Date;
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
@RequestMapping("/api/uszoversenyek")
@PreAuthorize("hasRole('ADMIN')")
public class UszoversenyekController {

    @Autowired
    private UszoversenyRepository uszoversenyRepository;

    @GetMapping("/")
    public ResponseEntity<?> getAllVersenyek() {
        return ResponseEntity.ok(uszoversenyRepository.findAll());
    }

    @PutMapping("/")
    public ResponseEntity<?> createNewVerseny(@RequestParam() String nev,
        @RequestParam(required = false) String helyszin,
        @RequestParam(required = false) String datum) {
        Date date = ControllerUtils.createDate(datum);

        Uszoverseny uszoverseny = new Uszoverseny(nev, helyszin, date);
        uszoversenyRepository.save(uszoverseny);

        return ResponseEntity.ok(
            new MessageResponse("Úszóverseny létrehozva."));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getVerseny(@PathVariable String id) {
        Uszoverseny uszoverseny;
        try {
            uszoverseny = retrieveUszoverseny(id);
        } catch (UszoversenyNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Hibás azonosító formátum."));
        }

        return ResponseEntity.ok(uszoverseny);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> editVerseny(@PathVariable String id,
        @RequestParam(required = false) String nev,
        @RequestParam(required = false) String helyszin,
        @RequestParam(required = false) String datum) {
        Date date = ControllerUtils.createDate(datum);

        Uszoverseny uszoverseny;
        try {
            uszoverseny = retrieveUszoverseny(id);
        } catch (UszoversenyNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Hibás azonosító formátum."));
        }

        if (nev != null) {
            uszoverseny.setNev(nev);
        }

        if (helyszin != null) {
            uszoverseny.setHelyszin(helyszin);
        }

        if (datum != null) {
            uszoverseny.setDatum(date);
        }

        uszoversenyRepository.save(uszoverseny);

        return ResponseEntity.ok(new MessageResponse("Módosítások mentve."));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVerseny(@PathVariable String id) {
        Uszoverseny uszoverseny;
        try {
            uszoverseny = retrieveUszoverseny(id);
        } catch (UszoversenyNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Hibás azonosító formátum."));
        }

        uszoversenyRepository.delete(uszoverseny);

        return ResponseEntity.ok(new MessageResponse("Úszóverseny törölve."));
    }

    private Uszoverseny retrieveUszoverseny(String idString) {
        long id = Long.parseLong(idString);
        return uszoversenyRepository.findById(id)
            .orElseThrow(() -> new UszoversenyNotFoundException(id));
    }
}
