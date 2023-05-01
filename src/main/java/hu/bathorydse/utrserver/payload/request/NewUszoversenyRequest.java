package hu.bathorydse.utrserver.payload.request;

import java.util.Date;
import javax.validation.constraints.NotBlank;

public class NewUszoversenyRequest {

    @NotBlank
    private String nev;

    private String helyszin;

    private Date datum;

    public String getNev() {
        return nev;
    }

    public void setNev(String nev) {
        this.nev = nev;
    }

    public String getHelyszin() {
        return helyszin;
    }

    public void setHelyszin(String helyszin) {
        this.helyszin = helyszin;
    }

    public Date getDatum() {
        return datum;
    }

    public void setDatum(Date datum) {
        this.datum = datum;
    }
}
