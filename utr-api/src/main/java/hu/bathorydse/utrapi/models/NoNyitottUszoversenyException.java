package hu.bathorydse.utrapi.models;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class NoNyitottUszoversenyException extends RuntimeException {

    private static final long serialVersionUID = -8509335288426630811L;

    public NoNyitottUszoversenyException() {
        super("Jelenleg nincs megnyitott úszóverseny.");
    }
}
