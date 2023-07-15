package hu.bathorydse.utrapi.models.rajtlista;

import hu.bathorydse.utrapi.models.uszo.UszoDetailed;
import hu.bathorydse.utrapi.models.versenyszam.Versenyszam;
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
public class NevezesDetailed {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "uszo_id")
    private UszoDetailed uszo;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "versenyszam_id")
    private Versenyszam versenyszam;

    @Column(name = "nevezesi_ido")
    private Integer nevezesiIdo;

    @Column(name = "idoeredmeny")
    private Integer idoeredmeny;

    @Column(name = "megjelent")
    private Boolean megjelent;
}
