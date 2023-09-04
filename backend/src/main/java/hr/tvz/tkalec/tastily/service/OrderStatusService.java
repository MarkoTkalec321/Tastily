package hr.tvz.tkalec.tastily.service;

import hr.tvz.tkalec.tastily.dto.OrderStatusDTO;

import java.util.List;

public interface OrderStatusService {

    List<OrderStatusDTO> findAll();

    OrderStatusDTO findById(Long id);
}
