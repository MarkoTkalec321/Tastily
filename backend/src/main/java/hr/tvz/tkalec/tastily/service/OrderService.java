package hr.tvz.tkalec.tastily.service;

import hr.tvz.tkalec.tastily.domain.Order;
import hr.tvz.tkalec.tastily.dto.ItemDTO;
import hr.tvz.tkalec.tastily.dto.OrderDTO;
import hr.tvz.tkalec.tastily.dto.OrderDetailsDTO;
import hr.tvz.tkalec.tastily.dto.command.ItemCommand;
import hr.tvz.tkalec.tastily.dto.command.OrderCommand;

import java.util.List;
import java.util.Optional;

public interface OrderService {

    List<OrderDTO> findAll();

    Optional<OrderDTO> saveOrderAndOrderDetails(OrderCommand orderCommand);

    List<OrderDTO> findByUserIdAndOrderStatusId(Long user_id, Long status_id);

    List<OrderDTO> findByUserId(Long user_id);

    Optional<OrderDTO> updateOrder(Long id, OrderCommand orderCommand);

    Optional<OrderDTO> deleteOrder(Long id);

}
