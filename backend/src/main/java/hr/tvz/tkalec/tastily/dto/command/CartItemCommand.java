package hr.tvz.tkalec.tastily.dto.command;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CartItemCommand {
    @NotNull(message = "Item id can't be null!")
    private Long item_id;

    @Min(value = 1, message = "Quantity must be greater than zero")
    @Max(value = 100, message = "The number must be less than 100!")
    @NotNull(message = "Quantity can't be null!")
    private Integer quantity;
}

