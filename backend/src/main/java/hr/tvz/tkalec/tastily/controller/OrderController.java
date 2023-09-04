package hr.tvz.tkalec.tastily.controller;

import hr.tvz.tkalec.tastily.dto.OrderDTO;
import hr.tvz.tkalec.tastily.dto.command.OrderCommand;
import hr.tvz.tkalec.tastily.repository.UserRepository;
import hr.tvz.tkalec.tastily.security.payload.response.MessageResponse;
import hr.tvz.tkalec.tastily.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = {"order", "/order/"})
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class OrderController {

    private final OrderService orderService;
    private final UserRepository userRepository;

    @Autowired
    public OrderController(OrderService orderService, UserRepository userRepository) {
        this.orderService = orderService;
        this.userRepository = userRepository;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<OrderDTO> getAllOrders() {
        return orderService.findAll();
    }

    @GetMapping("/user/{user_id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<OrderDTO>> getOrderByUserId(@PathVariable("user_id") Long user_id) {
        List<OrderDTO> ordersDTO = orderService.findByUserId(user_id);

        if (ordersDTO != null && !ordersDTO.isEmpty()) {
            return ResponseEntity.ok(ordersDTO);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> saveOrder(@Valid @RequestBody final OrderCommand command) {
        System.out.println("test" + command);
        if (userRepository.existsById(command.getUser_id())) {
            return orderService.saveOrderAndOrderDetails(command)
                    .map(
                            orderDTO -> ResponseEntity.status(HttpStatus.CREATED).body(orderDTO)
                    )
                    .orElseGet(
                            () -> ResponseEntity.status(HttpStatus.CONFLICT).build()
                    );
        }
        else {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: This user doesn't exist!"));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateOrderWithStatus(@PathVariable Long id, @Valid @RequestBody OrderCommand orderData) {
        return orderService.updateOrder(id, orderData)
                .map(
                        orderDTO -> ResponseEntity.ok(orderDTO)
                )
                .orElseGet(
                        () -> ResponseEntity.status(HttpStatus.CONFLICT).build()
                );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteOrder(@PathVariable Long id) {
        return orderService.deleteOrder(id)
                .map(
                        orderDTO -> ResponseEntity.ok(orderDTO)
                )
                .orElseGet(
                        () -> ResponseEntity.status(HttpStatus.CONFLICT).build()
                );
    }

}
