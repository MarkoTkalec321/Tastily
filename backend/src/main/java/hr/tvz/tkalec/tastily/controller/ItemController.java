package hr.tvz.tkalec.tastily.controller;

import hr.tvz.tkalec.tastily.dto.ItemDTO;
import hr.tvz.tkalec.tastily.dto.command.ItemCommand;
import hr.tvz.tkalec.tastily.repository.CategoryRepository;
import hr.tvz.tkalec.tastily.service.ItemService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping(value = {"item", "/item/"})
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class ItemController {

    private final ItemService itemService;

    @Autowired
    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    @GetMapping
    public List<ItemDTO> getAllItems() {
        return itemService.findAll();
    }

    @GetMapping(value = {"/category/{category_id}"})
    public ResponseEntity<List<ItemDTO>> getItemsByCategoryId(@PathVariable final Long category_id) {

        List<ItemDTO> itemsDTO = itemService.findByCategoryId(category_id);

        if (itemsDTO != null && !itemsDTO.isEmpty()) {
            return ResponseEntity.ok(itemsDTO);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/value")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<ItemDTO>> getItemsByIds(@RequestParam("ids") List<Long> ids) {
        List<ItemDTO> itemsDTO = itemService.findItemsByIds(ids);

        if (itemsDTO != null && !itemsDTO.isEmpty()) {
            return ResponseEntity.ok(itemsDTO);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }


    @GetMapping("/check-name/{name}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Boolean> ifNameExists(@PathVariable("name") String name) {

        Boolean exists = itemService.ifNameExists(name);
        return ResponseEntity.ok(exists);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> saveItem(
            @RequestPart("image") MultipartFile file,
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") Float price,
            @RequestParam("discount") Float discount,
            @RequestParam("category") Long category_id,
            @RequestParam("imageMimeType") String imageMimeType) {

        // Create a new ItemCommand object
        ItemCommand command = new ItemCommand();

        // Set the values
        command.setName(name);
        command.setDescription(description);
        command.setPrice(price);
        command.setDiscount(discount);
        command.setCategory_id(category_id);

        try {
            byte[] imageBytes = file.getBytes();
            command.setImage(imageBytes);
            command.setImageMimeType(imageMimeType);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing image");
        }

        // Save the item
        return itemService.save(command)
                .map(itemDTO -> ResponseEntity.status(HttpStatus.CREATED).body(itemDTO))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.CONFLICT).build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateItem(@PathVariable Long id, @Valid @RequestBody ItemCommand itemData){
        return itemService.updateItem(id, itemData)
            .map(
                    itemDTO -> ResponseEntity.ok(itemDTO)
            )
            .orElseGet(
                    () -> ResponseEntity.status(HttpStatus.CONFLICT).build()
            );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteItem(@PathVariable Long id) {
        return itemService.deleteItem(id)
                .map(
                        itemDTO -> ResponseEntity.ok(itemDTO)
                )
                .orElseGet(
                        () -> ResponseEntity.status(HttpStatus.CONFLICT).build()
                );
    }

}
