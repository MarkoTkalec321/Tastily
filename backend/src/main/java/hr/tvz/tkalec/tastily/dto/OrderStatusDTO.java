package hr.tvz.tkalec.tastily.dto;

import lombok.Data;

@Data
public class OrderStatusDTO {

    private Long id;
    private String status_value;

    public OrderStatusDTO(Long id, String status_value) {
        this.id = id;
        this.status_value = status_value;
    }
}
