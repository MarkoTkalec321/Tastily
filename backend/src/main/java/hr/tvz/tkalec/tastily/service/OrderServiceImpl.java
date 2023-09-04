package hr.tvz.tkalec.tastily.service;

import hr.tvz.tkalec.tastily.domain.*;
import hr.tvz.tkalec.tastily.dto.ItemDTO;
import hr.tvz.tkalec.tastily.dto.OrderDTO;
import hr.tvz.tkalec.tastily.dto.OrderDetailsDTO;
import hr.tvz.tkalec.tastily.dto.command.CartItemCommand;
import hr.tvz.tkalec.tastily.dto.command.ItemCommand;
import hr.tvz.tkalec.tastily.dto.command.OrderCommand;
import hr.tvz.tkalec.tastily.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService{

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final OrderStatusRepository orderStatusRepository;
    private final OrderDetailsRepository orderDetailsRepository;
    private final ItemRepository itemRepository;

    @Autowired
    public OrderServiceImpl(OrderRepository orderRepository, UserRepository userRepository,
                            OrderStatusRepository orderStatusRepository,
                            OrderDetailsRepository orderDetailsRepository,
                            ItemRepository itemRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.orderStatusRepository = orderStatusRepository;
        this.orderDetailsRepository = orderDetailsRepository;
        this.itemRepository = itemRepository;
    }

    @Override
    public List<OrderDTO> findAll() {
        return orderRepository.findAll().stream().map(this::mapOrderToDTO).collect(Collectors.toList());
    }

    @Override
    public Optional<OrderDTO> saveOrderAndOrderDetails(final OrderCommand orderCommand) {
        Order savedOrder = orderRepository.save(mapCommandToOrder(orderCommand));

        for (CartItemCommand cartItem : orderCommand.getCartItems()) {
            OrderDetails orderDetail = new OrderDetails();

            orderDetail.setQuantity(cartItem.getQuantity());

            Item item = itemRepository.findById(cartItem.getItem_id())
                    .orElseThrow(() -> new IllegalArgumentException("Item not found: " + cartItem.getItem_id()));

            orderDetail.setItem(item);
            orderDetail.setOrder(savedOrder);
            orderDetailsRepository.save(orderDetail);
        }

        return Optional.ofNullable(savedOrder).map(this::mapOrderToDTO);
    }

    @Override
    public List<OrderDTO> findByUserIdAndOrderStatusId(Long user_id, Long status_id){

        Optional<User> foundUser = userRepository.findById(user_id);
        Optional<OrderStatus> foundOrderStatus = orderStatusRepository.findById(status_id);

        if (foundUser.isPresent() && foundOrderStatus.isPresent()) {

            List<Order> orders = orderRepository.findByUserIdAndOrderStatusId(user_id, status_id);

            return orders.stream().map(this::mapOrderToDTO).collect(Collectors.toList());
        } else {

            throw new IllegalArgumentException("Order or order status not found!");
        }

    }

    @Override
    public List<OrderDTO> findByUserId(Long user_id) {

        Optional<User> foundUser = userRepository.findById(user_id);

        if (foundUser.isPresent()) {

            List<Order> orders = orderRepository.findByUserId(user_id);

            return orders.stream().map(this::mapOrderToDTO).collect(Collectors.toList());

        } else {

            throw new IllegalArgumentException("Order or order status not found!");
        }
    }

    @Override
    public Optional<OrderDTO> updateOrder(Long id, OrderCommand orderCommand){

        Optional<Order> foundOrderOptional = orderRepository.findById(id);

        if(foundOrderOptional.isPresent()) {
            Order foundOrder = foundOrderOptional.get();

            Optional<OrderStatus> foundOrderStatusOptional = orderStatusRepository.findById(orderCommand.getStatus_id());

            foundOrderStatusOptional.ifPresent(foundOrder::setOrderStatus);

            Order updatedOrder = orderRepository.save(foundOrder);
            OrderDTO updatedOrderDTO = mapOrderToDTO(updatedOrder);

            return Optional.of(updatedOrderDTO);
        }

        return Optional.empty();
    }

    @Override
    public Optional<OrderDTO> deleteOrder(final Long id){
        Optional<Order> foundOrderOptional = orderRepository.findById(id);

        if (foundOrderOptional.isPresent()) {

            Order foundOrder = foundOrderOptional.get();
            orderRepository.delete(foundOrder);
            return Optional.of(mapOrderToDTO(foundOrder));
        }

        return Optional.empty();
    }

    private Order mapCommandToOrder(final OrderCommand orderCommand) {

        User user = userRepository.findById(orderCommand.getUser_id())
                .orElseThrow(() -> new IllegalArgumentException("User not found!"));

        OrderStatus orderStatus = orderStatusRepository.findById(orderCommand.getStatus_id())
                .orElseThrow(() -> new IllegalArgumentException("Order status not found!"));

        return new Order(user, orderStatus);
    }

    private OrderDTO mapOrderToDTO(final Order order) {
        return new OrderDTO(order.getId(), order.getUser().getId(), order.getOrderStatus().getId(),
                order.getOrderStatus().getStatusValue(), order.getUser().getUsername(), order.getUser().getEmail());
    }
}
