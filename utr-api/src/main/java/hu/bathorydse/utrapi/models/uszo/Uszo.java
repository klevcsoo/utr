package hu.bathorydse.utrapi.models.uszo;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "uszo")
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
    @Enumerated(EnumType.STRING)
    private ENem nem;

    public Uszo(String nev, Short szuletesiEv, Long csapatId, ENem nem) {
        this.nev = nev;
        this.szuletesiEv = szuletesiEv;
        this.csapatId = csapatId;
        this.nem = nem;
    }
}
