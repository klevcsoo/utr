package hu.bathorydse.utrserver.models;

public class UszoversenyNotFoundException extends RuntimeException {

    public UszoversenyNotFoundException(Long id) {
        super("Nincs ilyen úszóverseny (azonosító: " + id + ").");
    }
}
