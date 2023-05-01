package hu.bathorydse.utrserver.payload.request;

import java.util.Date;
import javax.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class NewUszoversenyRequest {

    @NotBlank
    private String nev;

    private String helyszin;

    private Date datum;
}
