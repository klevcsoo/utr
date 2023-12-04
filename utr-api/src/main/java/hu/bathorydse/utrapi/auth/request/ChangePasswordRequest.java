package hu.bathorydse.utrapi.auth.request;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import lombok.Data;

@Data
public class ChangePasswordRequest {

    String oldPassword;

    @NotBlank
    @Size(min = 6, max = 40)
    private String newPassword;
}
