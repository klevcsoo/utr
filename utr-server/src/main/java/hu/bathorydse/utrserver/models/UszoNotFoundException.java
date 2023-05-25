package hu.bathorydse.utrserver.models;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class UszoNotFoundException extends RuntimeException {

    private static final long serialVersionUID = 2422444917493104463L;

    public UszoNotFoundException(Long id) {
        super("Nincs ilyen úszó (azonosító: " + id + ")");
    }
}
