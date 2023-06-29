package hu.bathorydse.utrapi.repository;

import hu.bathorydse.utrapi.models.Futam;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

@Repository
public interface FutamRepository extends JpaRepository<Futam, Long> {

    @NonNull
    List<Futam> findAllByVersenyszamId(@NonNull Long id);
}
