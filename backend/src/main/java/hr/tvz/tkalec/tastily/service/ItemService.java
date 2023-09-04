package hr.tvz.tkalec.tastily.service;

import hr.tvz.tkalec.tastily.dto.CategoryDTO;
import hr.tvz.tkalec.tastily.dto.ItemDTO;
import hr.tvz.tkalec.tastily.dto.command.ItemCommand;

import java.util.List;
import java.util.Optional;

public interface ItemService {

    List<ItemDTO> findAll();

    Optional<ItemDTO> save(ItemCommand itemCommand);

    List<ItemDTO> findByCategoryId(Long id);

    //List<ItemDTO> findItemById(Long id);

    List<ItemDTO> findItemsByIds(List<Long> ids);

    Boolean ifNameExists(String name);

    Optional<ItemDTO> updateItem(Long id, ItemCommand itemCommand);

    Optional<ItemDTO> deleteItem(Long id);

}
