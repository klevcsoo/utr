package hu.bathorydse.utrserver.payload.request;

import java.util.Date;
import lombok.Data;

@Data
public class EditUszoversenyRequest {

    private String nev;
    private String helyszin;
    private Date datum;
}
