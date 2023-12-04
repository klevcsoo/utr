package hu.bathorydse.utrapi.rajtlista.repository;

import hu.bathorydse.utrapi.rajtlista.model.Nevezes;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

@Repository
public interface NevezesRepository extends JpaRepository<Nevezes, Long> {

    @NonNull
    List<Nevezes> findAllByVersenyszamId(@NonNull Long id);

    @NonNull
    List<Nevezes> findAllByVersenyszamIdAndUszoId(
        @NonNull Long versenyszamId,
        @NonNull Long uszoId);
}
