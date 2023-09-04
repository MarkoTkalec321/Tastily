package hr.tvz.tkalec.tastily.security.payload.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Set;

@Data
public class SignupRequest {
    @NotBlank
    @Size(min = 6, max = 50)
    private String username;

    @NotBlank
    @Size(max = 255)
    private String fullname;

    @NotBlank
    @Size(max = 255)
    @Email
    private String email;

    @NotBlank
    @Size(max = 255)
    private String streetName;

    private BigDecimal latitude;

    private BigDecimal longitude;

    private Set<String> authoritiesSet;

    @NotBlank
    @Size(min = 6, max = 255)
    private String password;

}
