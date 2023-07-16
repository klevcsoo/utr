package hu.bathorydse.utrapi.repository;


import hu.bathorydse.utrapi.models.csapat.Csapat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CsapatRepository extends JpaRepository<Csapat, Long> {

}
