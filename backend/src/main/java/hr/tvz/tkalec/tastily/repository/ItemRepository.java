package hr.tvz.tkalec.tastily.repository;

import hr.tvz.tkalec.tastily.domain.Item;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ItemRepository extends JpaRepository<Item, Long> {

    Optional<Item> findByName(String name);
    List<Item> findByCategoryId(Long categoryId);
}
