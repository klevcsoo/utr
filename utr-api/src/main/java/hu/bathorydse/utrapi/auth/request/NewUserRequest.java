package hu.bathorydse.utrapi.auth.request;

import java.util.Set;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import lombok.Data;

@Data
public class NewUserRequest {

    @NotBlank
    @Size(min = 3, max = 20)
    private String username;

    @NotBlank
    @Size(max = 50)
    private String displayName;

    private Set<String> role;

    @NotBlank
    @Size(min = 6, max = 40)
    private String password;
}
