package hu.bathorydse.utrserver.models;

public class NoNyitottUszoversenyException extends RuntimeException {

    private static final long serialVersionUID = -8509335288426630811L;

    public NoNyitottUszoversenyException() {
        super("Jelenleg nincs megnyitott úszóverseny.");
    }
}
