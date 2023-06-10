package hu.bathorydse.utrserver.models;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "uszo")
@Data
@NoArgsConstructor
public class UszoDetailed {

    @Id
    @GeneratedValue
    private Long id;

    private String nev;

    @Column(name = "szuletesi_ev")
    private Short szuletesiDatum;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "csapat_id")
    private Csapat csapat;

    @Column(name = "nem")
    @Size(min = 1, max = 1)
    private String nem;
}
