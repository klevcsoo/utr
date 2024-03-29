package hu.bathorydse.utrapi.models.uszoverseny;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "uszoverseny")
@Data
@NoArgsConstructor
public class Uszoverseny implements Serializable {

    private static final long serialVersionUID = 7963534554160364961L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String nev;

    private String helyszin;

    private Date datum;

    private Boolean nyitott;

    public Uszoverseny(String nev, String helyszin, Date datum) {
        this.nev = nev;
        this.helyszin = helyszin;
        this.datum = datum;
        this.nyitott = false;
    }
}
