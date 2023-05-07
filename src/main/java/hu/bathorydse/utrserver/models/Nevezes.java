package hu.bathorydse.utrserver.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
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

    @Column(name = "uszo_id")
    private Long uszoId;

    @Column(name = "versenyszam_id")
    private Long versenyszamId;

    @Column(name = "nevezesi_ido")
    private Integer nevezesiIdo;

    @Column(name = "idoeredmeny")
    private Integer idoeredmeny;

    @Column(name = "megjelent")
    private Boolean megjelent;

    public Nevezes(Long uszoId, Long versenyszamId, Integer nevezesiIdo) {
        this.uszoId = uszoId;
        this.versenyszamId = versenyszamId;
        this.nevezesiIdo = nevezesiIdo;
        this.megjelent = true;
    }
}
