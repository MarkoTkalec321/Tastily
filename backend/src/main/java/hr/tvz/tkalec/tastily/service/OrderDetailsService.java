package hr.tvz.tkalec.tastily.service;

import hr.tvz.tkalec.tastily.dto.OrderDetailsDTO;
import hr.tvz.tkalec.tastily.dto.OrderStatusDTO;
import hr.tvz.tkalec.tastily.dto.command.OrderDetailsCommand;

import java.util.List;
import java.util.Optional;

public interface OrderDetailsService {

    List<OrderDetailsDTO> findAll();

    List<OrderDetailsDTO> findByOrderId(Long order_id);

}
