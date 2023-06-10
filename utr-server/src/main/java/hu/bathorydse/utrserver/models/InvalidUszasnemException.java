package hu.bathorydse.utrserver.models;

public class InvalidUszasnemException extends RuntimeException {

    private static final long serialVersionUID = 1758719242384388024L;

    public InvalidUszasnemException() {
        super("Érvénytelen úszásnem");
    }
}
