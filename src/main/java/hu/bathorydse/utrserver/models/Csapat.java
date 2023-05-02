package hu.bathorydse.utrserver.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;
import javax.persistence.CascadeType;
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
@Table(name = "csapatok")
@Data
@NoArgsConstructor
public class Csapat {

    @Id
    @GeneratedValue
    private Long id;

    private String nev;

    private String varos;

    @JsonIgnore
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JoinColumn(name = "csapat_id")
    private List<Uszo> uszok;

    public Csapat(String nev, String varos) {
        this.nev = nev;
        this.varos = varos;
    }
}
