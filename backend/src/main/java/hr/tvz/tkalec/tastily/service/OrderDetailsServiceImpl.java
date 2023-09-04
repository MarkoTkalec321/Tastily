package hr.tvz.tkalec.tastily.service;

import hr.tvz.tkalec.tastily.domain.*;
import hr.tvz.tkalec.tastily.dto.OrderDetailsDTO;
import hr.tvz.tkalec.tastily.dto.command.ItemCommand;
import hr.tvz.tkalec.tastily.dto.command.OrderDetailsCommand;
import hr.tvz.tkalec.tastily.repository.OrderDetailsRepository;
import hr.tvz.tkalec.tastily.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderDetailsServiceImpl implements OrderDetailsService{

    private final OrderDetailsRepository orderDetailsRepository;


    public OrderDetailsServiceImpl(OrderDetailsRepository orderDetailsRepository) {
        this.orderDetailsRepository = orderDetailsRepository;
    }

    @Override
    public List<OrderDetailsDTO> findAll() {
        return orderDetailsRepository.findAll().stream().map(this::mapOrderDetailsToDTO).collect(Collectors.toList());
    }

    @Override
    public List<OrderDetailsDTO> findByOrderId(Long order_id) {


        List<OrderDetails> foundOrderDetails = orderDetailsRepository.findByOrderId(order_id);
        System.out.println("LISTA: ");
        foundOrderDetails.forEach(System.out::println);


        if (foundOrderDetails != null) {

            return foundOrderDetails.stream().map(this::mapOrderDetailsToDTO).collect(Collectors.toList());

        } else {

            throw new IllegalArgumentException("Order or order status not found!");
        }

    }

/*    @Override
    public Optional<OrderDetailsDTO> save(final OrderDetailsCommand orderDetailsCommand) {

        return orderDetailsRepository.save(mapCommandToOrderDetails(orderDetailsCommand)).map(this::OrderDetailsDTO);

*//*        OrderDetails orderDetailsSaved = orderDetailsRepository.save(mapCommandToOrderDetails(orderDetailsCommand));

        return Optional.ofNullable(orderDetailsSaved).map(this::mapOrderDetailsToDTO);*//*
    }*/

/*    private OrderDetails mapCommandToOrderDetails(final OrderDetailsCommand orderDetailsCommand) {

        Item item = itemRepository.findById(orderDetailsCommand.getItem_id())
                .orElseThrow(() -> new IllegalArgumentException("Item not found"));

        Order order = orderRepository.findById(orderDetailsCommand.getOrder_id())
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));


        return new OrderDetails(orderDetailsCommand.getQuantity(), );
    }*/

    private OrderDetailsDTO mapOrderDetailsToDTO(final OrderDetails orderDetails) {
        return new OrderDetailsDTO(orderDetails.getId(), orderDetails.getOrder().getId(), orderDetails.getItem().getId(), orderDetails.getQuantity());
    }
}
