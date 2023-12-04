package hu.bathorydse.utrapi.auth.repository;

import hu.bathorydse.utrapi.auth.model.Role;
import hu.bathorydse.utrapi.auth.model.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Boolean existsByUsername(String username);

    Boolean existsByRolesContaining(Role role);
}
