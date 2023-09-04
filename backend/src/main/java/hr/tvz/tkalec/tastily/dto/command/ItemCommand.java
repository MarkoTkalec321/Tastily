package hr.tvz.tkalec.tastily.dto.command;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ItemCommand {

    private Long id;

    @NotNull(message = "Item name can't be null!")
    @NotBlank(message = "Item name can't be blank!")
    @Size(max = 50)
    private String name;

    @NotNull(message = "Image can't be null!")
    private byte[] image;

    private String imageMimeType;

    @NotNull(message = "Street name can't be null!")
    @NotBlank(message = "Street name can't be blank!")
    @Size(max = 255)
    private String description;

    @Positive(message = "Price must be a positive number!")
    private Float price;

    @DecimalMin(value = "1.0", message = "The price must be greater than or equal to 0!")
    @DecimalMax(value = "100.0", message = "The price must be less than or equal to 100!")
    private Float discount;

    @NotNull(message = "Category id can't be null!")
    private Long category_id;
}
