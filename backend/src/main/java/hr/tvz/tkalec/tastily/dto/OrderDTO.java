package hr.tvz.tkalec.tastily.dto;

import lombok.Data;

@Data
public class OrderDTO {

    private Long id;
    private Long user_id;
    private Long status_id;
    private String status_value;
    private String username;
    private String email;

    public OrderDTO(Long id, Long user_id, Long status_id, String status_value,
                    String username, String email) {
        this.id = id;
        this.user_id = user_id;
        this.status_id = status_id;
        this.status_value = status_value;
        this.username = username;
        this.email = email;
    }
}
