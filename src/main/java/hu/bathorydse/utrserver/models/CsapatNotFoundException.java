package hu.bathorydse.utrserver.models;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class CsapatNotFoundException extends RuntimeException {

    private static final long serialVersionUID = -7221835898219750727L;

    public CsapatNotFoundException(long id) {
        super("Nincs ilyen csapat (azonosító: " + id + ")");
    }
}
