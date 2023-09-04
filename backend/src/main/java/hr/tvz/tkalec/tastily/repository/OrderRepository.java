package hr.tvz.tkalec.tastily.repository;

import hr.tvz.tkalec.tastily.domain.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdAndOrderStatusId(Long userId, Long statusId);

    List<Order> findByUserId(Long userId);
}
