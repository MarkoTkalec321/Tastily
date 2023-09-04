package hr.tvz.tkalec.tastily.dto.command;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CategoryCommand {

    private Long id;

    @NotNull(message = "Category name can't be null!")
    @NotBlank(message = "Category name can't be blank!")
    @Size(max = 50)
    private String name;

    @NotNull(message = "Category description can't be null!")
    @Size(max = 255)
    private String description;
}
