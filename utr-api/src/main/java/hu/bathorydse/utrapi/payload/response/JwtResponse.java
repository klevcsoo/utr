package hu.bathorydse.utrapi.payload.response;

import java.util.List;
import lombok.Data;

@Data
public class JwtResponse {

    private String token;
    private String type = "Bearer";
    private Long id;
    private String username;
    private String displayName;
    private List<String> roles;

    public JwtResponse(String accessToken, Long id, String username,
        String displayName, List<String> roles) {
        this.token = accessToken;
        this.id = id;
        this.username = username;
        this.displayName = displayName;
        this.roles = roles;
    }
}
