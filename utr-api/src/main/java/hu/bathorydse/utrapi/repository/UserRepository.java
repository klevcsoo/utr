package hu.bathorydse.utrapi.repository;

import hu.bathorydse.utrapi.models.auth.Role;
import hu.bathorydse.utrapi.models.auth.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Boolean existsByUsername(String username);

    Boolean existsByRolesContaining(Role role);
}
