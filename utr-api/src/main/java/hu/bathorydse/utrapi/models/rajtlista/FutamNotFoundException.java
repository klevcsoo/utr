package hu.bathorydse.utrapi.models.rajtlista;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class FutamNotFoundException extends RuntimeException {

    private static final long serialVersionUID = 2117377001736065792L;

    public FutamNotFoundException(Long id) {
        super("Nincs ilyen futam (azonosító: " + id + ")");
    }
}
