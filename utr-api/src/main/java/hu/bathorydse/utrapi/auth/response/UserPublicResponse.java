package hu.bathorydse.utrapi.auth.response;

import hu.bathorydse.utrapi.auth.model.ERole;
import hu.bathorydse.utrapi.auth.model.Role;
import hu.bathorydse.utrapi.auth.model.User;
import java.util.List;
import java.util.stream.Collectors;
import lombok.Data;

@Data
public class UserPublicResponse {

    private final Long id;
    private final String username;
    private final String displayName;
    private final List<ERole> roles;

    public UserPublicResponse(User user) {
        id = user.getId();
        username = user.getUsername();
        displayName = user.getDisplayName();
        roles = user.getRoles().stream().map(Role::getName).collect(Collectors.toList());
    }
}
