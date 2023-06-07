package hu.bathorydse.utrserver.controllers;

import hu.bathorydse.utrserver.models.Futam;
import hu.bathorydse.utrserver.models.Nevezes;
import hu.bathorydse.utrserver.models.NevezesNotFoundException;
import hu.bathorydse.utrserver.models.NoNyitottUszoversenyException;
import hu.bathorydse.utrserver.models.Uszoverseny;
import hu.bathorydse.utrserver.models.UszoversenyNotFoundException;
import hu.bathorydse.utrserver.models.Versenyszam;
import hu.bathorydse.utrserver.models.VersenyszamNotFoundException;
import hu.bathorydse.utrserver.payload.response.MessageResponse;
import hu.bathorydse.utrserver.repository.FutamRepository;
import hu.bathorydse.utrserver.repository.NevezesRepository;
import hu.bathorydse.utrserver.repository.UszoversenyRepository;
import hu.bathorydse.utrserver.repository.VersenyszamRepository;
import java.util.List;
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

@CrossOrigin(origins = "*", maxAge = 3600)
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

    @PostMapping("/megnyitas")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> uszoversenyMegnyitasa(@RequestParam Long versenyId) {
        Uszoverseny uszoverseny = uszoversenyRepository.findById(versenyId)
            .orElseThrow(() -> new UszoversenyNotFoundException(versenyId));

        uszoverseny.setNyitott(true);
        uszoversenyRepository.save(uszoverseny);

        return ResponseEntity.ok(new MessageResponse("Úszóverseny megnyitva."));
    }

    @PostMapping("/lezaras")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> uszoversenyLezarasa() {
        Uszoverseny uszoverseny = uszoversenyRepository.findByNyitott(true)
            .orElseThrow(NoNyitottUszoversenyException::new);

        uszoverseny.setNyitott(false);
        uszoversenyRepository.save(uszoverseny);

        return ResponseEntity.ok(new MessageResponse("Úszóverseny lezárva."));
    }

    @GetMapping("/reszletek")
    @PreAuthorize("hasAnyRole('ADMIN', 'IDOROGZITO', 'ALLITOBIRO', 'SPEAKER')")
    public ResponseEntity<?> nyitottVersenyReszletek() {
        Uszoverseny uszoverseny = uszoversenyRepository.findByNyitott(true)
            .orElseThrow(NoNyitottUszoversenyException::new);

        return ResponseEntity.ok(uszoverseny);
    }

    @GetMapping("/versenyszamok")
    @PreAuthorize("hasAnyRole('ADMIN', 'IDOROGZITO', 'ALLITOBIRO', 'SPEAKER')")
    public ResponseEntity<?> nyitottVersenyszamok() {
        Uszoverseny uszoverseny = uszoversenyRepository.findByNyitott(true)
            .orElseThrow(NoNyitottUszoversenyException::new);

        List<Versenyszam> versenyszamok = versenyszamRepository.findAllByVersenyId(
            uszoverseny.getId());

        return ResponseEntity.ok(versenyszamok);
    }

    @GetMapping("/rajtlista")
    @PreAuthorize("hasAnyRole('ADMIN', 'IDOROGZITO', 'ALLITOBIRO', 'SPEAKER')")
    public ResponseEntity<?> getRajtlista(@RequestParam Long versenyszamId) {
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
    public ResponseEntity<?> editJelenlet(@RequestParam Long uszoId,
        @RequestParam Boolean megjelent) {
        Uszoverseny uszoverseny = uszoversenyRepository.findByNyitott(true)
            .orElseThrow(NoNyitottUszoversenyException::new);

        List<Nevezes> uszoNevezesek = nevezesRepository.findAllByVersenyszamIdAndUszoId(
            uszoverseny.getId(), uszoId);

        uszoNevezesek.forEach(nevezes -> nevezes.setMegjelent(megjelent));
        nevezesRepository.saveAll(uszoNevezesek);

        return ResponseEntity.ok(new MessageResponse(uszoNevezesek.size() + " nevezés módosítva."));
    }

    @PatchMapping("/idoeredmeny")
    @PreAuthorize("hasAnyRole('ADMIN', 'IDOROGZITO')")
    public ResponseEntity<?> editIdoeredmeny(@RequestParam Long nevezesId,
        @RequestParam String idoeredmeny) {
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

        return ResponseEntity.ok(new MessageResponse("Időeredmény mentve."));
    }

    @DeleteMapping("/idoeredmeny")
    @PreAuthorize("hasAnyRole('ADMIN', 'IDOROGZITO')")
    public ResponseEntity<?> deleteIdoeredmeny(@RequestParam Long nevezesId) {
        if (!uszoversenyRepository.existsByNyitott(true)) {
            throw new NoNyitottUszoversenyException();
        }

        Nevezes nevezes = nevezesRepository.findById(nevezesId)
            .orElseThrow(() -> new NevezesNotFoundException(nevezesId));

        nevezes.setIdoeredmeny(null);
        nevezesRepository.save(nevezes);

        return ResponseEntity.ok(new MessageResponse("Időeredmény törölve"));
    }
}
