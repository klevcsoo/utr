package hu.bathorydse.utrapi.controllers;

import hu.bathorydse.utrapi.language.UtrMessageSource;
import hu.bathorydse.utrapi.models.Futam;
import hu.bathorydse.utrapi.models.Nevezes;
import hu.bathorydse.utrapi.models.NevezesNotFoundException;
import hu.bathorydse.utrapi.models.NoNyitottUszoversenyException;
import hu.bathorydse.utrapi.models.Uszoverseny;
import hu.bathorydse.utrapi.models.Versenyszam;
import hu.bathorydse.utrapi.models.VersenyszamNotFoundException;
import hu.bathorydse.utrapi.payload.response.MessageResponse;
import hu.bathorydse.utrapi.repository.FutamRepository;
import hu.bathorydse.utrapi.repository.NevezesRepository;
import hu.bathorydse.utrapi.repository.UszoversenyRepository;
import hu.bathorydse.utrapi.repository.VersenyszamRepository;
import java.util.List;
import java.util.Locale;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = {"http://localhost:3000", "https://utr.hu"}, maxAge = 3600)
@RestController
@RequestMapping("/api/nyitott")
public class NyitottController {

    @Autowired
    private UszoversenyRepository uszoversenyRepository;

    @Autowired
    private VersenyszamRepository versenyszamRepository;

    @Autowired
    private FutamRepository futamRepository;

    @Autowired
    private NevezesRepository nevezesRepository;

    @Autowired
    private UtrMessageSource messageSource;

    @PostMapping("/lezaras")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> uszoversenyLezarasa(Locale locale) {
        Uszoverseny uszoverseny = uszoversenyRepository.findByNyitott(true)
            .orElseThrow(NoNyitottUszoversenyException::new);

        uszoverseny.setNyitott(false);
        uszoversenyRepository.save(uszoverseny);

        return ResponseEntity.ok(
            new MessageResponse(messageSource.get(locale, "uszoversenyek.closed")));
    }

    @GetMapping("/reszletek")
    @PreAuthorize("hasAnyRole('ADMIN', 'IDOROGZITO', 'ALLITOBIRO', 'SPEAKER')")
    public ResponseEntity<Uszoverseny> nyitottVersenyReszletek() {
        Uszoverseny uszoverseny = uszoversenyRepository.findByNyitott(true)
            .orElseThrow(NoNyitottUszoversenyException::new);

        return ResponseEntity.ok(uszoverseny);
    }

    @GetMapping("/versenyszamok")
    @PreAuthorize("hasAnyRole('ADMIN', 'IDOROGZITO', 'ALLITOBIRO', 'SPEAKER')")
    public ResponseEntity<List<Versenyszam>> nyitottVersenyszamok() {
        Uszoverseny uszoverseny = uszoversenyRepository.findByNyitott(true)
            .orElseThrow(NoNyitottUszoversenyException::new);

        List<Versenyszam> versenyszamok = versenyszamRepository.findAllByVersenyId(
            uszoverseny.getId());

        return ResponseEntity.ok(versenyszamok);
    }

    @GetMapping("/rajtlista")
    @PreAuthorize("hasAnyRole('ADMIN', 'IDOROGZITO', 'ALLITOBIRO', 'SPEAKER')")
    public ResponseEntity<List<Futam>> getRajtlista(@RequestParam Long versenyszamId) {
        Uszoverseny uszoverseny = uszoversenyRepository.findByNyitott(true)
            .orElseThrow(NoNyitottUszoversenyException::new);

        // might seem unnecessary, but retrieving the Versenyszam via
        // the id AND the versenyId makes sure that the Versenyszam
        // is in the opened Úszóverseny
        // if it isn't, the VersenyszamNotFoundException will be thrown
        Versenyszam versenyszam = versenyszamRepository.findByIdAndVersenyId(versenyszamId,
            uszoverseny.getId()).orElseThrow(() -> new VersenyszamNotFoundException(versenyszamId));

        List<Futam> futamok = futamRepository.findAllByVersenyszamId(versenyszam.getId());

        return ResponseEntity.ok(futamok);
    }

    @PostMapping("/rajtlista")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> rajtlistaOsszeallitasa() {
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).build();
    }

    @PatchMapping("/jelenlet")
    @PreAuthorize("hasAnyRole('ADMIN', 'ALLITOBITO')")
    public ResponseEntity<MessageResponse> editJelenlet(@RequestParam Long uszoId,
        @RequestParam Boolean megjelent, Locale locale) {
        Uszoverseny uszoverseny = uszoversenyRepository.findByNyitott(true)
            .orElseThrow(NoNyitottUszoversenyException::new);

        List<Nevezes> uszoNevezesek = nevezesRepository.findAllByVersenyszamIdAndUszoId(
            uszoverseny.getId(), uszoId);

        uszoNevezesek.forEach(nevezes -> nevezes.setMegjelent(megjelent));
        nevezesRepository.saveAll(uszoNevezesek);

        return ResponseEntity.ok(new MessageResponse(
            messageSource.get(locale, "nevezesek.jelenlet.changed",
                Integer.toString(uszoNevezesek.size()))));
    }

    @PatchMapping("/idoeredmeny")
    @PreAuthorize("hasAnyRole('ADMIN', 'IDOROGZITO')")
    public ResponseEntity<MessageResponse> editIdoeredmeny(@RequestParam Long nevezesId,
        @RequestParam String idoeredmeny, Locale locale) {
        if (!uszoversenyRepository.existsByNyitott(true)) {
            throw new NoNyitottUszoversenyException();
        }

        Nevezes nevezes = nevezesRepository.findById(nevezesId)
            .orElseThrow(() -> new NevezesNotFoundException(nevezesId));

        int interval;
        String minString = idoeredmeny.split(":")[0];
        interval = Integer.parseInt(minString) * 60000;

        String secString = idoeredmeny.split(":")[1];
        interval += (int) (Double.parseDouble(secString) * 1000);

        nevezes.setIdoeredmeny(interval);
        nevezesRepository.save(nevezes);

        return ResponseEntity.ok(
            new MessageResponse(messageSource.get(locale, "nevezesek.idoeredmeny.changed")));
    }

    @DeleteMapping("/idoeredmeny")
    @PreAuthorize("hasAnyRole('ADMIN', 'IDOROGZITO')")
    public ResponseEntity<MessageResponse> deleteIdoeredmeny(@RequestParam Long nevezesId,
        Locale locale) {
        if (!uszoversenyRepository.existsByNyitott(true)) {
            throw new NoNyitottUszoversenyException();
        }

        Nevezes nevezes = nevezesRepository.findById(nevezesId)
            .orElseThrow(() -> new NevezesNotFoundException(nevezesId));

        nevezes.setIdoeredmeny(null);
        nevezesRepository.save(nevezes);

        return ResponseEntity.ok(
            new MessageResponse(messageSource.get(locale, "nevezesek.idoeredmeny.deleted")));
    }
}
