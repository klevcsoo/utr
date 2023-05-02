package hu.bathorydse.utrserver.repository;

import hu.bathorydse.utrserver.models.Versenyszam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VersenyszamRepository extends
    JpaRepository<Versenyszam, Long> {

}
