package hr.tvz.tkalec.tastily.repository;

import hr.tvz.tkalec.tastily.domain.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderStatusRepository extends JpaRepository<OrderStatus, Long> {
}
