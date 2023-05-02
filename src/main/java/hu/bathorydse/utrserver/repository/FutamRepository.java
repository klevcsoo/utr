package hu.bathorydse.utrserver.repository;

import hu.bathorydse.utrserver.models.Futam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FutamRepository extends JpaRepository<Futam, Long> {

}
