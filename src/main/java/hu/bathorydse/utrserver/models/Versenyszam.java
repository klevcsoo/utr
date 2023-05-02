package hu.bathorydse.utrserver.models;

import java.io.Serializable;
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

    private Integer uszasnem_id;

    private String emberi_nem_id;

    private Integer valto;

    public Versenyszam(Long verseny_id, Integer hossz, Integer uszasnem_id,
        String emberi_nem_id, Integer valto) {
        this.verseny_id = verseny_id;
        this.hossz = hossz;
        this.uszasnem_id = uszasnem_id;
        this.emberi_nem_id = emberi_nem_id;
        this.valto = valto;
    }
}
