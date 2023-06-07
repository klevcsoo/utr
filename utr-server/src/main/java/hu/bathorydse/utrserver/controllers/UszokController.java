package hu.bathorydse.utrserver.controllers;


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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/uszok")
@PreAuthorize("hasRole('ADMIN')")
public class UszokController {

    @Autowired
    UszoRepository uszoRepository;

    @GetMapping("/")
    public ResponseEntity<?> getAllUszok(@RequestParam Long csapatId) {
        return ResponseEntity.ok(uszoRepository.findAllByCsapatId(csapatId));
    }

    @PutMapping("/")
    public ResponseEntity<?> createUszo(@RequestParam Long csapatId, @RequestParam String nev,
        @RequestParam Short szuletesiEv, @RequestParam @Size(min = 1, max = 1) String nem) {
        Uszo uszo = new Uszo(nev, szuletesiEv, csapatId, nem);
        uszoRepository.save(uszo);

        return ResponseEntity.ok(new MessageResponse("Úszó hozzáadva."));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUszo(@PathVariable Long id) {
        Uszo uszo = uszoRepository.findById(id).orElseThrow(() -> new UszoNotFoundException(id));

        return ResponseEntity.ok(uszo);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> editUszo(@PathVariable Long id,
        @RequestParam(required = false) String nev,
        @RequestParam(required = false) String szuletesiEv,
        @RequestParam(required = false) Long csapat,
        @RequestParam(required = false) @Size(min = 1, max = 1) String nem) {
        Uszo uszo = uszoRepository.findById(id).orElseThrow(() -> new UszoNotFoundException(id));

        if (nev != null) {
            uszo.setNev(nev);
        }

        if (szuletesiEv != null) {
            uszo.setSzuletesiEv(Short.parseShort(szuletesiEv));
        }

        if (csapat != null) {
            uszo.setCsapatId(csapat);
        }

        if (nem != null) {
            uszo.setNem(nem);
        }

        uszoRepository.save(uszo);

        return ResponseEntity.ok(new MessageResponse("Módosítások mentve."));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUszo(@PathVariable Long id) {
        Uszo uszo = uszoRepository.findById(id).orElseThrow(() -> new UszoNotFoundException(id));

        uszoRepository.delete(uszo);

        return ResponseEntity.ok(new MessageResponse("Úszó törölve."));
    }
}
