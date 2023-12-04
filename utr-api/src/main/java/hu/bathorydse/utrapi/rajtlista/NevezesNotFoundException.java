package hu.bathorydse.utrapi.rajtlista;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class NevezesNotFoundException extends RuntimeException {

    private static final long serialVersionUID = 3195394338356585414L;

    public NevezesNotFoundException(Long id) {
        super("Nincs ilyen nevezés (azonosító: " + id + ")");
    }
}
