package hu.bathorydse.utrserver.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
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

    public Futam(Long versenyszamId) {
        this.versenyszamId = versenyszamId;
    }
}
