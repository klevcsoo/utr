package hu.bathorydse.utrserver.repository;

import hu.bathorydse.utrserver.models.Uszoverseny;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UszoversenyRepository extends
    JpaRepository<Uszoverseny, Long> {

    Optional<Uszoverseny> findByNyitott(Boolean nyitott);
}
