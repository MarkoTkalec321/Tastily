package hr.tvz.tkalec.tastily.controller;

import hr.tvz.tkalec.tastily.dto.OrderDetailsDTO;
import hr.tvz.tkalec.tastily.service.OrderDetailsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = {"order-details", "/order-details/"})
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class OrderDetailsController {

    private final OrderDetailsService orderDetailsService;

    public OrderDetailsController(OrderDetailsService orderDetailsService) {
        this.orderDetailsService = orderDetailsService;
    }

    @GetMapping
    public List<OrderDetailsDTO> getAllOrderDetails() {
        return orderDetailsService.findAll();
    }

    @GetMapping("/order/{order_id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<OrderDetailsDTO>> getOrderDetailsById (@PathVariable("order_id") Long order_id) {

        List<OrderDetailsDTO> orderDetailsDTO = orderDetailsService.findByOrderId(order_id);

        if (orderDetailsDTO != null && !orderDetailsDTO.isEmpty()) {
            return ResponseEntity.ok(orderDetailsDTO);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

}
