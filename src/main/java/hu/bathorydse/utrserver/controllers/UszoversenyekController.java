package hu.bathorydse.utrserver.controllers;

import hu.bathorydse.utrserver.core.ControllerUtils;
import hu.bathorydse.utrserver.models.Uszoverseny;
import hu.bathorydse.utrserver.models.UszoversenyNotFoundException;
import hu.bathorydse.utrserver.models.Versenyszam;
import hu.bathorydse.utrserver.payload.response.MessageResponse;
import hu.bathorydse.utrserver.repository.UszoversenyRepository;
import java.util.Date;
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
@RequestMapping("/api/uszoversenyek")
public class UszoversenyekController {

    @Autowired
    private UszoversenyRepository uszoversenyRepository;

    @GetMapping("/")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllVersenyek() {
        return ResponseEntity.ok(uszoversenyRepository.findAll());
    }

    @PutMapping("/")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createNewVerseny(
        @RequestParam() String nev,
        @RequestParam(required = false) String helyszin,
        @RequestParam(required = false) String datum
    ) {
        Date date = ControllerUtils.createDate(datum);

        Uszoverseny uszoverseny = new Uszoverseny(nev, helyszin, date);
        uszoversenyRepository.save(uszoverseny);

        return ResponseEntity.ok(
            new MessageResponse("Úszóverseny létrehozva.")
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'IDOROGZITO', 'ALLITOBIRO', 'SPEAKER')")
    public ResponseEntity<?> getVerseny(@PathVariable String id) {
        Uszoverseny uszoverseny;
        try {
            uszoverseny = retrieveUszoverseny(id);
        } catch (UszoversenyNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(
                new MessageResponse("Hibás azonosító formátum.")
            );
        }

        return ResponseEntity.ok(uszoverseny);
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> editVerseny(
        @PathVariable String id,
        @RequestParam(required = false) String nev,
        @RequestParam(required = false) String helyszin,
        @RequestParam(required = false) String datum
    ) {
        Date date = ControllerUtils.createDate(datum);

        Uszoverseny uszoverseny;
        try {
            uszoverseny = retrieveUszoverseny(id);
        } catch (UszoversenyNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(
                new MessageResponse("Hibás azonosító formátum.")
            );
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
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteVerseny(@PathVariable String id) {
        Uszoverseny uszoverseny;
        try {
            uszoverseny = retrieveUszoverseny(id);
        } catch (UszoversenyNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(
                new MessageResponse("Hibás azonosító formátum.")
            );
        }

        uszoversenyRepository.delete(uszoverseny);

        return ResponseEntity.ok(
            new MessageResponse("Úszóverseny törölve.")
        );
    }

    @GetMapping("/{id}/versenyszamok/")
    @PreAuthorize("hasAnyRole('ADMIN', 'IDOROGZITO', 'ALLITOBIRO', 'SPEAKER')")
    public ResponseEntity<?> getAllVersenyszamok(@PathVariable String id) {
        Uszoverseny uszoverseny;
        try {
            uszoverseny = retrieveUszoverseny(id);
        } catch (UszoversenyNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(
                new MessageResponse("Hibás azonosító formátum.")
            );
        }

        return ResponseEntity.ok(uszoverseny.getVersenyszamok());
    }

    @PutMapping("/{id}/versenyszamok/")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createNewVersenyszam(
        @PathVariable String id,
        @RequestParam Integer hossz,
        @RequestParam Integer uszasnemId,
        @RequestParam @Size(min = 1, max = 1) String emberiNemId,
        @RequestParam(required = false) Integer valto
    ) {
        Uszoverseny uszoverseny;
        try {
            uszoverseny = retrieveUszoverseny(id);
        } catch (UszoversenyNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(
                new MessageResponse("Hibás azonosító formátum.")
            );
        }

        uszoverseny.getVersenyszamok().add(new Versenyszam(
            uszoverseny, hossz, uszasnemId, emberiNemId, valto
        ));

        uszoversenyRepository.save(uszoverseny);

        return ResponseEntity.ok(
            new MessageResponse("Versenyszám hozzáadva")
        );
    }

    private Uszoverseny retrieveUszoverseny(String idString) {
        long id = Long.parseLong(idString);
        return uszoversenyRepository.findById(id)
            .orElseThrow(() -> new UszoversenyNotFoundException(id));
    }
}
