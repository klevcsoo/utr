package hu.bathorydse.utrserver.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.io.Serializable;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
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

    @Column(name = "nem")
    private String nem;

    private Integer valto;

    @JsonIgnore
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JoinColumn(name = "versenyszam_id")
    private List<Futam> futamok;

    public Versenyszam(Long verseny_id, Integer hossz, Integer uszasnemId,
        String nem, Integer valto) {
        this.verseny_id = verseny_id;
        this.hossz = hossz;
        this.uszasnemId = uszasnemId;
        this.nem = nem;
        this.valto = valto;
    }
}
