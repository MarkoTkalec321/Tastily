package hr.tvz.tkalec.tastily.security.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank
    @Size(min = 6, max = 50)
    private String username;

    @NotBlank
    @Size(max = 255)
    private String password;

}
