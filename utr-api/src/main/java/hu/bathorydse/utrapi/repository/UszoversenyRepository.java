package hu.bathorydse.utrapi.repository;

import hu.bathorydse.utrapi.models.uszoverseny.Uszoverseny;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

@Repository
public interface UszoversenyRepository extends
    JpaRepository<Uszoverseny, Long> {

    @NonNull
    Optional<Uszoverseny> findByNyitott(@NonNull Boolean nyitott);

    @NonNull
    Boolean existsByNyitott(@NonNull Boolean nyitott);
}
