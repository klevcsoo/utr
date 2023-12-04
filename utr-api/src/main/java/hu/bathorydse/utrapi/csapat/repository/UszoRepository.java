package hu.bathorydse.utrapi.csapat.repository;

import hu.bathorydse.utrapi.csapat.model.Uszo;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

@Repository
public interface UszoRepository extends JpaRepository<Uszo, Long> {

    @NonNull
    List<Uszo> findAllByCsapatId(@NonNull Long id);
}
