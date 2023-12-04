package hu.bathorydse.utrapi.uszoverseny;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class VersenyszamNotFoundException extends RuntimeException {

    private static final long serialVersionUID = 7403248641665395293L;

    public VersenyszamNotFoundException(long id) {
        super("Nincs ilyen versenyszám (azonosító: " + id + ").");
    }
}
