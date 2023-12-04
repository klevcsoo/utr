package hu.bathorydse.utrapi.csapat.repository;


import hu.bathorydse.utrapi.csapat.model.Csapat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CsapatRepository extends JpaRepository<Csapat, Long> {

}
