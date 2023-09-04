package hr.tvz.tkalec.tastily.dto;

import lombok.Data;

@Data
public class ItemDTO {

    private Long id;
    private String name;
    private byte[] image;
    private String description;
    private Float price;
    private Float discount;
    private long category_id;
    private String imageMimeType;

    public ItemDTO(Long id, String name, byte[] image, String description, Float price, Float discount, long category_id, String imageMimeType) {
        this.id = id;
        this.name = name;
        this.image = image;
        this.description = description;
        this.price = price;
        this.discount = discount;
        this.category_id = category_id;
        this.imageMimeType = imageMimeType;
    }
}
