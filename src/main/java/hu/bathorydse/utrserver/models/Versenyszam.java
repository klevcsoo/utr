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

    private Long verseny_id;

    private Integer hossz;

    @Column(name = "uszasnem_id")
    private Integer uszasnemId;

    @Column(name = "emberi_nem_id")
    private String emberiNemId;

    private Integer valto;

    public Versenyszam(Long verseny_id, Integer hossz, Integer uszasnemId,
        String emberiNemId, Integer valto) {
        this.verseny_id = verseny_id;
        this.hossz = hossz;
        this.uszasnemId = uszasnemId;
        this.emberiNemId = emberiNemId;
        this.valto = valto;
    }
}
