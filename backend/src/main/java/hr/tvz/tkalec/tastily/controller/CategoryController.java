package hr.tvz.tkalec.tastily.controller;

import hr.tvz.tkalec.tastily.dto.CategoryDTO;
import hr.tvz.tkalec.tastily.dto.command.CategoryCommand;
import hr.tvz.tkalec.tastily.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = {"category", "/category/"})
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class CategoryController {
    private final CategoryService categoryService;

    @Autowired
    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public List<CategoryDTO> getAllCategories() {
        return categoryService.findAll();
    }

    @GetMapping("/check-name/{name}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Boolean> ifNameExists(@PathVariable("name") String name) {
        Boolean exists = categoryService.ifNameExists(name);
        return ResponseEntity.ok(exists);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> saveCategory(@Valid @RequestBody final CategoryCommand command) {
        return categoryService.saveCategory(command)
                .map(
                        categoryDTO -> ResponseEntity.status(HttpStatus.CREATED).body(categoryDTO)
                )
                .orElseGet(
                        () -> ResponseEntity.status(HttpStatus.CONFLICT).build()
                );
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryCommand categoryData) {
        return categoryService.updateCategory(id, categoryData)
                .map(
                        categoryDTO -> ResponseEntity.ok(categoryDTO)
                )
                .orElseGet(
                        () -> ResponseEntity.status(HttpStatus.CONFLICT).build()
                );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        return categoryService.deleteCategory(id)
                .map(
                        categoryDTO -> ResponseEntity.ok(categoryDTO)
                )
                .orElseGet(
                        () -> ResponseEntity.status(HttpStatus.CONFLICT).build()
                );
    }

}
