package hr.tvz.tkalec.tastily.dto;

import lombok.Data;

@Data
public class OrderDetailsDTO {

    private Long id;
    private Long order_id;
    private Long item_id;
    private Integer quantity;

    public OrderDetailsDTO(Long id, Long order_id, Long item_id, Integer quantity) {
        this.id = id;
        this.order_id = order_id;
        this.item_id = item_id;
        this.quantity = quantity;
    }
}
