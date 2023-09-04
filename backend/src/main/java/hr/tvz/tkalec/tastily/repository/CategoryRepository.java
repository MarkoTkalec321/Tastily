package hr.tvz.tkalec.tastily.repository;

import hr.tvz.tkalec.tastily.domain.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByName(String name);
}
