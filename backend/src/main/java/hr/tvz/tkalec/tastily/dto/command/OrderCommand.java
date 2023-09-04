package hr.tvz.tkalec.tastily.dto.command;

import lombok.Data;

import java.util.List;

@Data
public class OrderCommand {

    private Long id;

    //@NotNull(message = "User id can't be null!")
    private Long user_id;

    //@NotNull(message = "Username can't be null!")
    private String username;

    //@NotNull(message = "Email can't be null!")
    private String email;

    //@NotNull(message = "Order status value can't be null!")
    private String status_value;

    //@NotNull(message = "Order status id can't be null!")
    private Long status_id;

    //@NotNull(message = "Item list can't be null!")
    private List<CartItemCommand> cartItems;
}

