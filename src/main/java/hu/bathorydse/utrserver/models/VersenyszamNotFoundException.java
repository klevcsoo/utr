package hu.bathorydse.utrserver.models;

public class VersenyszamNotFoundException extends RuntimeException {

    public VersenyszamNotFoundException(long id) {
        super("Nincs ilyen versenyszám (azonosító: " + id + ").");
    }
}
