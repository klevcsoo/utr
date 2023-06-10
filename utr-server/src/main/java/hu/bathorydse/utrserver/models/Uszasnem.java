package hu.bathorydse.utrserver.models;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "uszasnem")
@Data
public class Uszasnem implements Serializable {

    private static final long serialVersionUID = 8656966970137125569L;

    @Id
    @GeneratedValue
    private Integer id;

    @Column(name = "elnevezes")
    private String elnevezes;
}
