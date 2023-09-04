package hr.tvz.tkalec.tastily.service;

import hr.tvz.tkalec.tastily.domain.*;
import hr.tvz.tkalec.tastily.dto.CategoryDTO;
import hr.tvz.tkalec.tastily.dto.command.CartItemCommand;
import hr.tvz.tkalec.tastily.dto.command.CategoryCommand;
import hr.tvz.tkalec.tastily.dto.command.OrderCommand;
import hr.tvz.tkalec.tastily.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService{

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<CategoryDTO> findAll() {
        return categoryRepository.findAll().stream().map(this::mapCategoryToDTO).collect(Collectors.toList());
    }

    @Override
    public Boolean ifNameExists(String name) {
        return categoryRepository.findByName(name).isPresent();
    }

    @Override
    public Optional<CategoryDTO> saveCategory(final CategoryCommand categoryCommand) {

        Category savedCategory = categoryRepository.save(mapCommandToCategory(categoryCommand));
        return Optional.ofNullable(savedCategory).map(this::mapCategoryToDTO);
    }

    @Override
    public Optional<CategoryDTO> updateCategory(final Long id, CategoryCommand categoryCommand) {

        Optional<Category> foundCategoryOptional = categoryRepository.findById(id);

        if (foundCategoryOptional.isPresent()) {

            Category foundCategory = foundCategoryOptional.get();

            foundCategory.setName(categoryCommand.getName());
            foundCategory.setDescription(categoryCommand.getDescription());

            Category updatedCategory = categoryRepository.save(foundCategory);
            CategoryDTO updatedCategoryDTO = mapCategoryToDTO(updatedCategory);

            return Optional.of(updatedCategoryDTO);
        }

        return Optional.empty();
    }

    @Override
    public Optional<CategoryDTO> deleteCategory(final Long id){

        Optional<Category> foundCategoryOptional = categoryRepository.findById(id);

        if (foundCategoryOptional.isPresent()) {

            Category foundCategory = foundCategoryOptional.get();
            categoryRepository.delete(foundCategory);
            return Optional.of(mapCategoryToDTO(foundCategory));
        }
        return Optional.empty();
    }

    private Category mapCommandToCategory(final CategoryCommand categoryCommand) {
        return new Category(categoryCommand.getName(), categoryCommand.getDescription());
    }

    private CategoryDTO mapCategoryToDTO(final Category category) {
        return new CategoryDTO(category.getId(), category.getName(), category.getDescription());
    }
}
