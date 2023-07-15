package hu.bathorydse.utrapi.models.rajtlista;

import java.util.HashSet;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "futam")
@Data
@NoArgsConstructor
public class Futam {

    @Id
    @GeneratedValue
    private Long id;

    @Column(name = "versenyszam_id")
    private Long versenyszamId;

    @OneToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "rajtlista",
        joinColumns = @JoinColumn(name = "futam_id"),
        inverseJoinColumns = @JoinColumn(name = "nevezes_id"))
    private Set<NevezesDetailed> rajtlista = new HashSet<>();

    public Futam(Long versenyszamId) {
        this.versenyszamId = versenyszamId;
    }
}
