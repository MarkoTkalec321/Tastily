package hr.tvz.tkalec.tastily.service;

import hr.tvz.tkalec.tastily.domain.OrderStatus;
import hr.tvz.tkalec.tastily.dto.OrderStatusDTO;
import hr.tvz.tkalec.tastily.repository.OrderStatusRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderStatusServiceImpl implements OrderStatusService{

    private final OrderStatusRepository orderStatusRepository;

    public OrderStatusServiceImpl(OrderStatusRepository orderStatusRepository) {
        this.orderStatusRepository = orderStatusRepository;
    }

    @Override
    public List<OrderStatusDTO> findAll() {
        return orderStatusRepository.findAll().stream().map(this::mapOrderStatusToDTO).collect(Collectors.toList());
    }

    @Override
    public OrderStatusDTO findById(Long id) {
        return orderStatusRepository.findById(id)
                .map(this::mapOrderStatusToDTO)
                .orElse(null);
    }


    private OrderStatusDTO mapOrderStatusToDTO(final OrderStatus orderStatus) {
        return new OrderStatusDTO(orderStatus.getId(), orderStatus.getStatusValue());
    }
}
