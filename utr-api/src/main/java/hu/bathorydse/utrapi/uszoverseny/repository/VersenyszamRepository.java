package hu.bathorydse.utrapi.uszoverseny.repository;

import hu.bathorydse.utrapi.uszoverseny.model.Versenyszam;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

@Repository
public interface VersenyszamRepository extends
    JpaRepository<Versenyszam, Long> {

    @NonNull
    List<Versenyszam> findAllByVersenyId(@NonNull Long id);

    @NonNull
    Optional<Versenyszam> findByIdAndVersenyId(@NonNull Long id,
        @NonNull Long versenyId);
}