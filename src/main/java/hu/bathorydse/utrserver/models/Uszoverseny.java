package hu.bathorydse.utrserver.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.io.Serializable;
import java.util.Date;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "uszoversenyek")
@Data
@NoArgsConstructor
public class Uszoverseny implements Serializable {

    private static final long serialVersionUID = 7963534554160364961L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String nev;

    private String helyszin;

    private Date datum;

    @JsonIgnore
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JoinColumn(name = "verseny_id")
    private List<Versenyszam> versenyszamok;

    public Uszoverseny(String nev, String helyszin, Date datum) {
        this.nev = nev;
        this.helyszin = helyszin;
        this.datum = datum;
    }
}
