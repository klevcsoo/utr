package hu.bathorydse.utrserver.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import javax.persistence.CascadeType;
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
@Table(name = "versenyszamok")
@Data
@NoArgsConstructor
public class Versenyszam {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "verseny_id")
    @JsonIgnore
    private Uszoverseny uszoverseny;

    private Integer hossz;

    private Integer uszasnem_id;

    private String emberi_nem_id;

    private Integer valto;

    public Versenyszam(Uszoverseny uszoverseny, Integer hossz,
        Integer uszasnem_id,
        String emberi_nem_id, Integer valto) {
        this.uszoverseny = uszoverseny;
        this.hossz = hossz;
        this.uszasnem_id = uszasnem_id;
        this.emberi_nem_id = emberi_nem_id;
        this.valto = valto;
    }
}
