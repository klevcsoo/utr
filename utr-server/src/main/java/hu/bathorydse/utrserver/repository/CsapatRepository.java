package hu.bathorydse.utrserver.repository;


import hu.bathorydse.utrserver.models.Csapat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CsapatRepository extends JpaRepository<Csapat, Long> {
    
}
