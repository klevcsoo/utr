package hu.bathorydse.utrserver.models;

import java.util.List;
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
@Table(name = "futamok")
@Data
@NoArgsConstructor
public class Futam {

    @Id
    @GeneratedValue
    private Long id;

    @Column(name = "versenyszam_id")
    private Long versenyszamId;

    @OneToMany(fetch = FetchType.EAGER)
    @JoinColumn(name = "futam_id")
    private List<Rajt> rajtlista;

    public Futam(Long versenyszamId) {
        this.versenyszamId = versenyszamId;
    }
}
