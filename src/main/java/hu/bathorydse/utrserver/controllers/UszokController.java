package hu.bathorydse.utrserver.controllers;


import hu.bathorydse.utrserver.core.ControllerUtils;
import hu.bathorydse.utrserver.models.Uszo;
import hu.bathorydse.utrserver.models.UszoNotFoundException;
import hu.bathorydse.utrserver.payload.response.MessageResponse;
import hu.bathorydse.utrserver.repository.UszoRepository;
import javax.validation.constraints.Size;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/uszok")
public class UszokController {

    @Autowired
    UszoRepository uszoRepository;

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'IDOROGZITO', 'ALLITOBIRO', 'SPEAKER')")
    public ResponseEntity<?> getUszo(@PathVariable String id) {
        Uszo uszo;
        try {
            uszo = retrieveUszo(id);
        } catch (UszoNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(
                new MessageResponse("Hibás azonosító formátum.")
            );
        }

        return ResponseEntity.ok(uszo);
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> editUszo(
        @PathVariable String id,
        @RequestParam(required = false) String nev,
        @RequestParam(required = false) String szuletesiDatum,
        @RequestParam(required = false) Long csapat,
        @RequestParam(required = false) @Size(min = 1, max = 1) String nem
    ) {
        Uszo uszo;
        try {
            uszo = retrieveUszo(id);
        } catch (UszoNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(
                new MessageResponse("Hibás azonosító formátum.")
            );
        }

        if (nev != null) {
            uszo.setNev(nev);
        }

        if (szuletesiDatum != null) {
            uszo.setSzuletesiDatum(ControllerUtils.createDate(szuletesiDatum));
        }

        if (csapat != null) {
            uszo.setCsapatId(csapat);
        }

        if (nem != null) {
            uszo.setNem(nem);
        }

        uszoRepository.save(uszo);

        return ResponseEntity.ok(
            new MessageResponse("Módosítások mentve.")
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUszo(@PathVariable String id) {
        Uszo uszo;
        try {
            uszo = retrieveUszo(id);
        } catch (UszoNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(
                new MessageResponse("Hibás azonosító formátum.")
            );
        }

        uszoRepository.delete(uszo);

        return ResponseEntity.ok(
            new MessageResponse("Úszó törölve.")
        );
    }

    private Uszo retrieveUszo(String idString)
        throws UszoNotFoundException, NumberFormatException {
        long id = Long.parseLong(idString);
        return uszoRepository.findById(id)
            .orElseThrow(() -> new UszoNotFoundException(id));
    }
}
