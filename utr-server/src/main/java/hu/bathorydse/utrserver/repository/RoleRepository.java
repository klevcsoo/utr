package hu.bathorydse.utrserver.repository;

import hu.bathorydse.utrserver.models.auth.ERole;
import hu.bathorydse.utrserver.models.auth.Role;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    Optional<Role> findByName(ERole name);
}
