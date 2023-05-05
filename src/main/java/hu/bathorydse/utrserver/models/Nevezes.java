package hu.bathorydse.utrserver.models;

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
@Table(name = "nevezesek")
@Data
@NoArgsConstructor
public class Nevezes {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "uszo_id")
    private Uszo uszo;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "versenyszam_id")
    private Versenyszam versenyszam;

    @Column(name = "nevezesi_ido")
    private String nevezesiIdo;

    @Column(name = "idoeredmeny")
    private String idoeredmeny;

    @Column(name = "megjelent")
    private Boolean megjelent;

    public Nevezes(Uszo uszo, Versenyszam versenyszam, String nevezesiIdo) {
        this.uszo = uszo;
        this.versenyszam = versenyszam;
        this.nevezesiIdo = nevezesiIdo;
    }

    public Nevezes(Uszo uszo, Versenyszam versenyszam) {
        this(uszo, versenyszam, null);
    }
}
