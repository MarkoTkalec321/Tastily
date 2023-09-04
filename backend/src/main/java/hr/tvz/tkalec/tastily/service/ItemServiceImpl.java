package hr.tvz.tkalec.tastily.service;

import hr.tvz.tkalec.tastily.domain.Category;
import hr.tvz.tkalec.tastily.domain.Item;
import hr.tvz.tkalec.tastily.domain.Order;
import hr.tvz.tkalec.tastily.domain.User;
import hr.tvz.tkalec.tastily.dto.CategoryDTO;
import hr.tvz.tkalec.tastily.dto.ItemDTO;
import hr.tvz.tkalec.tastily.dto.command.ItemCommand;
import hr.tvz.tkalec.tastily.repository.CategoryRepository;
import hr.tvz.tkalec.tastily.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.OptionalLong;
import java.util.stream.Collectors;

@Service
public class ItemServiceImpl implements ItemService{

    private final ItemRepository itemRepository;
    private final CategoryRepository categoryRepository;

    @Autowired
    public ItemServiceImpl(ItemRepository itemRepository, CategoryRepository categoryRepository) {
        this.itemRepository = itemRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<ItemDTO> findAll() {
        return itemRepository.findAll().stream().map(this::mapItemToDTO).collect(Collectors.toList());
    }

/*    @Override
    public List<ItemDTO> findItemById(Long id) {

        Optional<Item> foundItem = itemRepository.findById(id);

        if (foundItem.isPresent()) {
            return foundItem.stream().map(this::mapItemToDTO).collect(Collectors.toList());

        } else {
            throw new IllegalArgumentException("Order or order status not found!");
        }

    }*/

    public List<ItemDTO> findItemsByIds(List<Long> ids) {
        return itemRepository.findAllById(ids).stream().map(this::mapItemToDTO).collect(Collectors.toList());
    }

    @Override
    public Boolean ifNameExists(String name) {
        return itemRepository.findByName(name).isPresent();
    }

    @Override
    public Optional<ItemDTO> save(final ItemCommand itemCommand) {

        Item savedItem = itemRepository.save(mapCommandToItem(itemCommand));

        return Optional.ofNullable(savedItem).map(this::mapItemToDTO);
    }

    @Override
    public List<ItemDTO> findByCategoryId(Long category_id) {

        Optional<Category> foundCategory = categoryRepository.findById(category_id);

        if (foundCategory.isPresent()) {

            List<Item> items = itemRepository.findByCategoryId(category_id);

            return items.stream().map(this::mapItemToDTO).collect(Collectors.toList());
        } else {

            throw new IllegalArgumentException("Category not found");
        }
    }

    @Override
    public Optional<ItemDTO> updateItem(Long id, ItemCommand itemCommand) {

        Optional<Item> foundItemOptional = itemRepository.findById(id);

        if(foundItemOptional.isPresent()) {

            Item foundItem = foundItemOptional.get();

            foundItem.setName(itemCommand.getName());
            foundItem.setDescription(itemCommand.getDescription());
            foundItem.setPrice(itemCommand.getPrice());
            foundItem.setDiscount(itemCommand.getDiscount());
            foundItem.setImage(itemCommand.getImage());
            foundItem.setImageMimeType(itemCommand.getImageMimeType());

            Optional<Category> foundCategoryOptional = categoryRepository.findById(itemCommand.getCategory_id());

            foundCategoryOptional.ifPresent(foundItem::setCategory);

            Item updatedItem = itemRepository.save(foundItem);
            ItemDTO updatedItemDTO = mapItemToDTO(updatedItem);

            return Optional.of(updatedItemDTO);
        }

        return Optional.empty();
    }

    @Override
    public Optional<ItemDTO> deleteItem(final Long id){

        Optional<Item> foundItemOptional = itemRepository.findById(id);

        if (foundItemOptional.isPresent()) {

            Item foundItem = foundItemOptional.get();
            itemRepository.delete(foundItem);
            return Optional.of(mapItemToDTO(foundItem));
        }
        return Optional.empty();
    }

    private Item mapCommandToItem(final ItemCommand itemCommand) {

        Category category = categoryRepository.findById(itemCommand.getCategory_id())
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));


        return new Item(itemCommand.getName(), itemCommand.getImage(), itemCommand.getDescription(), itemCommand.getPrice(),
                itemCommand.getDiscount(), category, itemCommand.getImageMimeType());
    }

    private ItemDTO mapItemToDTO(final Item item) {
        return new ItemDTO(item.getId(), item.getName(), item.getImage(), item.getDescription(), item.getPrice(), item.getDiscount(), item.getCategory().getId(), item.getImageMimeType());
    }
}
