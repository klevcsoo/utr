package hu.bathorydse.utrapi.models;

import java.io.Serializable;
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

    private Integer hossz;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "uszasnem_id")
    private Uszasnem uszasnem;

    @Column(name = "nem")
    private String nem;

    private Integer valto;

    public Versenyszam(Long versenyId, Integer hossz, Uszasnem uszasnem,
        String nem, Integer valto) {
        this.versenyId = versenyId;
        this.hossz = hossz;
        this.uszasnem = uszasnem;
        this.nem = nem;
        this.valto = valto;
    }
}
