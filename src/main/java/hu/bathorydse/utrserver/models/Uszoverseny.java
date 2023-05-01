package hu.bathorydse.utrserver.models;

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
@Table(name = "uszoversenyek")
@Data
@NoArgsConstructor
public class Uszoverseny {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String nev;

    private String helyszin;

    private Date datum;

    public Uszoverseny(String nev, String helyszin, Date datum) {
        this.nev = nev;
        this.helyszin = helyszin;
        this.datum = datum;
    }
}
