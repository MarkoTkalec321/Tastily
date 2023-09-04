package hr.tvz.tkalec.tastily.controller;

import hr.tvz.tkalec.tastily.dto.OrderStatusDTO;
import hr.tvz.tkalec.tastily.service.OrderStatusService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = {"order-status", "/order-status/"})
@CrossOrigin(origins = "http://localhost:4200")
public class OrderStatusController {

    private final OrderStatusService orderStatusService;

    public OrderStatusController(OrderStatusService orderStatusService) {
        this.orderStatusService = orderStatusService;
    }

    @GetMapping
    public List<OrderStatusDTO> getAllOrderStatuses() {
        return orderStatusService.findAll();
    }

    @GetMapping("/value/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<OrderStatusDTO> getOrderStatusById (@PathVariable("id") Long id) {

        OrderStatusDTO orderStatusDTO = orderStatusService.findById(id);

        if (orderStatusDTO != null) {
            return ResponseEntity.ok(orderStatusDTO);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

}
