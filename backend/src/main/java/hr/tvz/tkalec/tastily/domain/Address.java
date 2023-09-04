package hr.tvz.tkalec.tastily.domain;

import hr.tvz.tkalec.tastily.dto.AddressDTO;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "addresses")
public class Address implements Serializable {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @Column(name = "street_name", nullable = false, length = 255)
    private String streetName;

    @Column(name = "latitude", precision = 9, scale = 6, length = 255)
    private BigDecimal latitude;

    @Column(name = "longitude", precision = 9, scale = 6, length = 255)
    private BigDecimal longitude;

    @OneToMany(mappedBy = "address", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<User> userList;

    public Address(String streetName, BigDecimal latitude, BigDecimal longitude) {
        this.streetName = streetName;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public AddressDTO toAddressDTO() {
        return new AddressDTO(this.id, this.streetName, this.latitude, this.longitude);
    }

}
