package hu.bathorydse.utrapi.rajtlista.model;

import hu.bathorydse.utrapi.csapat.model.UszoDetailed;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "nevezes")
@Data
@NoArgsConstructor
public class Nevezes {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "uszo_id")
    private UszoDetailed uszo;

    @Column(name = "versenyszam_id")
    private Long versenyszamId;

    @Column(name = "nevezesi_ido")
    private Integer nevezesiIdo;

    @Column(name = "idoeredmeny")
    private Integer idoeredmeny;

    @Column(name = "megjelent")
    private Boolean megjelent;

    public Nevezes(UszoDetailed uszo, Long versenyszamId, Integer nevezesiIdo) {
        this.uszo = uszo;
        this.versenyszamId = versenyszamId;
        this.nevezesiIdo = nevezesiIdo;
        this.megjelent = true;
    }
}
