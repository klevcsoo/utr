package hu.bathorydse.utrserver.controllers;

import hu.bathorydse.utrserver.core.ControllerUtils;
import hu.bathorydse.utrserver.models.Csapat;
import hu.bathorydse.utrserver.models.CsapatNotFoundException;
import hu.bathorydse.utrserver.models.Uszo;
import hu.bathorydse.utrserver.payload.response.MessageResponse;
import hu.bathorydse.utrserver.repository.CsapatRepository;
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
@RequestMapping("/api/csapatok")
public class CsapatokController {

    @Autowired
    private CsapatRepository csapatRepository;

    @GetMapping("/")
    @PreAuthorize("hasAnyRole('ADMIN', 'IDOROGZITO', 'ALLITOBIRO', 'SPEAKER')")
    public ResponseEntity<?> getAllCsapatok() {
        return ResponseEntity.ok(csapatRepository.findAll());
    }

    @PutMapping("/")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createCsapat(
        @RequestParam String nev,
        @RequestParam(required = false) String varos
    ) {
        Csapat csapat = new Csapat(nev, varos);
        csapatRepository.save(csapat);
        return ResponseEntity.ok(
            new MessageResponse("Csapat létrehozva")
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'IDOROGZITO', 'ALLITOBIRO', 'SPEAKER')")
    public ResponseEntity<?> getCsapat(@PathVariable String id) {
        Csapat csapat;
        try {
            csapat = retrieveCsapat(id);
        } catch (CsapatNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(
                new MessageResponse("Hibás azonosító formátum")
            );
        }

        return ResponseEntity.ok(csapat);
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> editCsapat(
        @PathVariable String id,
        @RequestParam(required = false) String nev,
        @RequestParam(required = false) String varos
    ) {
        Csapat csapat;
        try {
            csapat = retrieveCsapat(id);
        } catch (CsapatNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(
                new MessageResponse("Hibás azonosító formátum")
            );
        }

        if (nev != null) {
            csapat.setNev(nev);
        }

        if (varos != null) {
            csapat.setVaros(varos);
        }

        csapatRepository.save(csapat);

        return ResponseEntity.ok(
            new MessageResponse("Módosítások mentve")
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteCsapat(@PathVariable String id) {
        Csapat csapat;
        try {
            csapat = retrieveCsapat(id);
        } catch (CsapatNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(
                new MessageResponse("Hibás azonosító formátum")
            );
        }

        csapatRepository.delete(csapat);

        return ResponseEntity.ok(
            new MessageResponse("Csapat törölve.")
        );
    }

    @GetMapping("/{id}/uszok/")
    @PreAuthorize("hasAnyRole('ADMIN', 'IDOROGZITO', 'ALLITOBIRO', 'SPEAKER')")
    public ResponseEntity<?> getAllUszok(@PathVariable String id) {
        Csapat csapat;
        try {
            csapat = retrieveCsapat(id);
        } catch (CsapatNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(
                new MessageResponse("Hibás azonosító formátum")
            );
        }

        return ResponseEntity.ok(csapat.getUszok());
    }

    @PutMapping("/{id}/uszok/")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createNewUszo(
        @PathVariable String id,
        @RequestParam String nev,
        @RequestParam String szuletesiDatum,
        @RequestParam @Size(min = 1, max = 1) String nem
    ) {
        Date date = ControllerUtils.createDate(szuletesiDatum);

        Csapat csapat;
        try {
            csapat = retrieveCsapat(id);
        } catch (CsapatNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(
                new MessageResponse("Hibás azonosító formátum")
            );
        }

        csapat.getUszok().add(new Uszo(nev, date, csapat.getId(), nem));
        csapatRepository.save(csapat);

        return ResponseEntity.ok(
            new MessageResponse("Úszó hozzáadva.")
        );
    }

    private Csapat retrieveCsapat(String idString)
        throws NumberFormatException, CsapatNotFoundException {
        long id = Long.parseLong(idString);
        return csapatRepository.findById(id)
            .orElseThrow(() -> new CsapatNotFoundException(id));
    }
}
