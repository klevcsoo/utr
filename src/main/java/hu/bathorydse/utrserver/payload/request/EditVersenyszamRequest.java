package hu.bathorydse.utrserver.payload.request;

import javax.validation.constraints.Size;
import lombok.Data;

@Data
public class EditVersenyszamRequest {

    private Integer hossz;
    private Integer uszasnemId;
    @Size(min = 1, max = 1)
    private String emberiNemId;
    private Integer valto;
}
