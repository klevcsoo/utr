package hu.bathorydse.utrserver.models;

import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "uszok")
@Data
@NoArgsConstructor
public class Uszo {

    @Id
    @GeneratedValue
    private Long id;

    private String nev;

    @Column(name = "szuletesi_datum")
    private Date szuletesiDatum;

    @Column(name = "csapat_id")
    private Long csapatId;

    @Column(name = "nem")
    @Size(min = 1, max = 1)
    private String nem;

    public Uszo(String nev, Date szuletesiDatum, Long csapatId, String nem) {
        this.nev = nev;
        this.szuletesiDatum = szuletesiDatum;
        this.csapatId = csapatId;
        this.nem = nem;
    }
}
