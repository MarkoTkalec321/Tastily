package hr.tvz.tkalec.tastily.dto;

import lombok.Data;

@Data
public class CategoryDTO {

    private Long id;
    private String name;
    private String description;

    public CategoryDTO(Long id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }
}
