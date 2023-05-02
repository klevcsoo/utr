package hu.bathorydse.utrserver.models;

import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "rajtlista")
@Data
@NoArgsConstructor
public class Rajt {

    @EmbeddedId
    private RajtId id;

    @Column(name = "nevezesi_ido")
    private String nevezesiIdo;

    @Column(name = "idoeredmeny")
    private String idoeredmeny;

    @Column(name = "megjelent")
    private Boolean megjelent;

    public Rajt(String nevezesiIdo, String idoeredmeny) {
        this.nevezesiIdo = nevezesiIdo;
        this.idoeredmeny = idoeredmeny;
    }
}
