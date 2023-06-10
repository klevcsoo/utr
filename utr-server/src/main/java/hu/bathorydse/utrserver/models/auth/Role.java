package hu.bathorydse.utrserver.models.auth;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "auth_role")
@Data
@NoArgsConstructor
public class Role implements Serializable {

    private static final long serialVersionUID = 7227441009017620806L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ERole name;

    @SuppressWarnings("unused")
    public Role(ERole name) {
        this.name = name;
    }
}
