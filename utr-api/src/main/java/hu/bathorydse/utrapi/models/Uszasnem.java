package hu.bathorydse.utrapi.models;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "uszasnem")
@Data
public class Uszasnem implements Serializable {

    private static final long serialVersionUID = 8656966970137125569L;

    @Id
    @Column(name = "id")
    @Enumerated(EnumType.STRING)
    private EUszasnem id;
}
