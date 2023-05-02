package hu.bathorydse.utrserver.models;

public class FutamNotFoundException extends RuntimeException {

    private static final long serialVersionUID = 2117377001736065792L;

    public FutamNotFoundException(Long id) {
        super("Nincs ilyen futam (azonosító: " + id + ")");
    }
}
