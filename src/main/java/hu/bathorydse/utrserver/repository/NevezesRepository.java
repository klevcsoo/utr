package hu.bathorydse.utrserver.repository;

import hu.bathorydse.utrserver.models.Nevezes;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

@Repository
public interface NevezesRepository extends JpaRepository<Nevezes, Long> {

    @NonNull
    List<Nevezes> findAllByVersenyszamId(@NonNull Long id);

    @NonNull
    List<Nevezes> findAllByUszoId(@NonNull Long id);
}
