package hu.bathorydse.utrserver.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "csapatok")
@Data
@NoArgsConstructor
public class Csapat {

    @Id
    @GeneratedValue
    private Long id;

    private String nev;

    private String varos;

    public Csapat(String nev, String varos) {
        this.nev = nev;
        this.varos = varos;
    }
}
