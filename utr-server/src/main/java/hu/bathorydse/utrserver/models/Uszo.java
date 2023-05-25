package hu.bathorydse.utrserver.models;

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

    @Column(name = "szuletesi_ev")
    private Short szuletesiEv;

    @Column(name = "csapat_id")
    private Long csapatId;

    @Column(name = "nem")
    @Size(min = 1, max = 1)
    private String nem;

    public Uszo(String nev, Short szuletesiEv, Long csapatId, String nem) {
        this.nev = nev;
        this.szuletesiEv = szuletesiEv;
        this.csapatId = csapatId;
        this.nem = nem;
    }
}
