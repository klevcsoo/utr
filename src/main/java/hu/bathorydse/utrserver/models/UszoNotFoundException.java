package hu.bathorydse.utrserver.models;

public class UszoNotFoundException extends RuntimeException {

    private static final long serialVersionUID = 2422444917493104463L;

    public UszoNotFoundException(Long id) {
        super("Nincs ilyen úszó (azonosító: " + id + ")");
    }
}
