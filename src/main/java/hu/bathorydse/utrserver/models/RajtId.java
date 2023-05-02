package hu.bathorydse.utrserver.models;

import java.io.Serializable;
import java.util.Objects;
import javax.persistence.Embeddable;

@Embeddable
public class RajtId implements Serializable {

    private static final long serialVersionUID = -1000634503247955007L;

    private Long uszo_id;

    private Long futam_id;

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        RajtId rajtId = (RajtId) o;
        return uszo_id.equals(rajtId.uszo_id) && futam_id.equals(
            rajtId.futam_id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(uszo_id, futam_id);
    }
}
