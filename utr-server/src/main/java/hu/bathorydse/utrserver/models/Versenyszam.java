package hu.bathorydse.utrserver.models;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "versenyszamok")
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

    @Column(name = "uszasnem_id")
    private Integer uszasnemId;

    @Column(name = "nem")
    private String nem;

    private Integer valto;

    public Versenyszam(Long versenyId, Integer hossz, Integer uszasnemId,
        String nem, Integer valto) {
        this.versenyId = versenyId;
        this.hossz = hossz;
        this.uszasnemId = uszasnemId;
        this.nem = nem;
        this.valto = valto;
    }
}
