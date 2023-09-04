package hr.tvz.tkalec.tastily.repository;

import hr.tvz.tkalec.tastily.domain.OrderDetails;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderDetailsRepository extends JpaRepository<OrderDetails, Long> {

    List<OrderDetails> findByOrderId(Long order_id);

}
