package hu.bathorydse.utrapi.controllers;


import hu.bathorydse.utrapi.language.UtrMessageSource;
import hu.bathorydse.utrapi.models.ENem;
import hu.bathorydse.utrapi.models.Uszo;
import hu.bathorydse.utrapi.models.UszoNotFoundException;
import hu.bathorydse.utrapi.payload.response.MessageResponse;
import hu.bathorydse.utrapi.repository.UszoRepository;
import java.util.List;
import java.util.Locale;
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
@RequestMapping("/api/uszok")
@PreAuthorize("hasRole('ADMIN')")
public class UszokController {

    @Autowired
    private UszoRepository uszoRepository;

    @Autowired
    private UtrMessageSource messageSource;

    @GetMapping("/")
    public ResponseEntity<List<Uszo>> getAllUszok(@RequestParam Long csapatId) {
        return ResponseEntity.ok(uszoRepository.findAllByCsapatId(csapatId));
    }

    @PutMapping("/")
    public ResponseEntity<MessageResponse> createUszo(@RequestParam Long csapatId,
        @RequestParam String nev, @RequestParam Short szuletesiEv, @RequestParam ENem nem,
        Locale locale) {
        Uszo uszo = new Uszo(nev, szuletesiEv, csapatId, nem);
        uszoRepository.save(uszo);

        return ResponseEntity.ok(new MessageResponse(messageSource.get(locale, "uszok.created")));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Uszo> getUszo(@PathVariable Long id) {
        Uszo uszo = uszoRepository.findById(id).orElseThrow(() -> new UszoNotFoundException(id));

        return ResponseEntity.ok(uszo);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<MessageResponse> editUszo(@PathVariable Long id,
        @RequestParam(required = false) String nev,
        @RequestParam(required = false) String szuletesiEv,
        @RequestParam(required = false) Long csapat, @RequestParam(required = false) ENem nem,
        Locale locale) {
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

        return ResponseEntity.ok(
            new MessageResponse(messageSource.get(locale, "generic.changes_saved")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteUszo(@PathVariable Long id, Locale locale) {
        Uszo uszo = uszoRepository.findById(id).orElseThrow(() -> new UszoNotFoundException(id));

        uszoRepository.delete(uszo);

        return ResponseEntity.ok(new MessageResponse(messageSource.get(locale, "uszok.deleted")));
    }
}
