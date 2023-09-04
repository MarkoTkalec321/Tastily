package hr.tvz.tkalec.tastily.service;

import hr.tvz.tkalec.tastily.dto.CategoryDTO;
import hr.tvz.tkalec.tastily.dto.command.CategoryCommand;

import java.util.List;
import java.util.Optional;

public interface CategoryService {
    List<CategoryDTO> findAll();
    Boolean ifNameExists(String name);
    Optional<CategoryDTO> saveCategory(CategoryCommand categoryCommand);
    Optional<CategoryDTO> updateCategory(Long id, CategoryCommand categoryCommand);
    Optional<CategoryDTO> deleteCategory(Long id);
}
