package hu.bathorydse.utrserver.models;

public class NevezesNotFoundException extends RuntimeException {

    private static final long serialVersionUID = 3195394338356585414L;

    public NevezesNotFoundException(Long id) {
        super("Nincs ilyen nevezés (azonosító: " + id + ")");
    }
}
