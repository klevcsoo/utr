package hu.bathorydse.utrapi.auth.repository;

import hu.bathorydse.utrapi.auth.model.ERole;
import hu.bathorydse.utrapi.auth.model.Role;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    Optional<Role> findByName(ERole name);
}
