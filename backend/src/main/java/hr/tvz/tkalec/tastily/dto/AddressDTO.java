package hr.tvz.tkalec.tastily.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class AddressDTO {

    private Long id;
    private String streetName;
    private BigDecimal latitude;
    private BigDecimal longitude;
    public AddressDTO(Long id, String streetName, BigDecimal latitude, BigDecimal longitude) {
        this.id = id;
        this.streetName = streetName;
        this.latitude = latitude;
        this.longitude = longitude;
    }
}
