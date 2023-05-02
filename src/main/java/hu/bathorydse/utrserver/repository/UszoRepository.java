package hu.bathorydse.utrserver.repository;

import hu.bathorydse.utrserver.models.Uszo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UszoRepository extends JpaRepository<Uszo, Long> {

}
