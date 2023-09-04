package hr.tvz.tkalec.tastily.security.payload.response;

import hr.tvz.tkalec.tastily.dto.AddressDTO;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String username;
    private String fullname;
    private String email;
    private List<String> authoritiesList;
    private AddressDTO addressDTO;

    public JwtResponse(String accessToken, Long id, String username, String fullname, String email, List<String> authoritiesList, AddressDTO addressDTO) {
        this.token = accessToken;
        this.id = id;
        this.username = username;
        this.fullname = fullname;
        this.email = email;
        this.authoritiesList = authoritiesList;
        this.addressDTO = addressDTO;
    }
}
