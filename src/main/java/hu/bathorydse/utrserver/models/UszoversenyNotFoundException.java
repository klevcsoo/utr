package hu.bathorydse.utrserver.models;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class UszoversenyNotFoundException extends RuntimeException {

    private static final long serialVersionUID = -8226574403027900304L;

    public UszoversenyNotFoundException(Long id) {
        super("Nincs ilyen úszóverseny (azonosító: " + id + ").");
    }
}
