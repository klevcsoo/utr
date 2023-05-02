package hu.bathorydse.utrserver.models;

public class CsapatNotFoundException extends RuntimeException {

    private static final long serialVersionUID = -7221835898219750727L;

    public CsapatNotFoundException(long id) {
        super("Nincs ilyen csapat (azonosító: " + id + ")");
    }
}
