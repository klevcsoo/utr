package hu.bathorydse.utrapi.payload.request;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import lombok.Data;

@Data
public class ChangePasswordRequest {

    Long userId;

    String oldPassword;

    @NotBlank
    @Size(min = 6, max = 40)
    private String newPassword;
}
