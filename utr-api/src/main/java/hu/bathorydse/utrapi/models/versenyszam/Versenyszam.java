package hu.bathorydse.utrapi.models.versenyszam;

import hu.bathorydse.utrapi.models.uszo.ENem;
import java.io.Serializable;
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
@Table(name = "versenyszam")
@Data
@NoArgsConstructor
public class Versenyszam implements Serializable {

    private static final long serialVersionUID = 408486709107104955L;

    @Id
    @GeneratedValue
    private Long id;

    @Column(name = "verseny_id")
    private Long versenyId;

    @Column(name = "hossz")
    private Integer hossz;

    @Column(name = "uszasnem")
    @Enumerated(EnumType.STRING)
    private EUszasnem uszasnem;

    @Column(name = "nem")
    @Enumerated(EnumType.STRING)
    private ENem nem;

    private Integer valto;

    public Versenyszam(Long versenyId, Integer hossz, EUszasnem uszasnem,
        ENem nem, Integer valto) {
        this.versenyId = versenyId;
        this.hossz = hossz;
        this.uszasnem = uszasnem;
        this.nem = nem;
        this.valto = valto;
    }
}
