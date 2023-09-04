package hr.tvz.tkalec.tastily.domain;

import jakarta.persistence.*;

import java.io.Serializable;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderDetails> orderDetailsList;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "status_id", nullable = false)
    private OrderStatus orderStatus;


    public Order(User user, OrderStatus orderStatus) {
        this.user = user;
        this.orderStatus = orderStatus;
    }

    public Order(Long id, List<OrderDetails> orderDetailsList, User user, OrderStatus status) {
        this.id = id;
        this.orderDetailsList = orderDetailsList;
        this.user = user;
        this.orderStatus = status;
    }

    public Order() {
    }

    public Long getId() {
        return this.id;
    }

    public User getUser() {
        return this.user;
    }
    public OrderStatus getOrderStatus() {
        return this.orderStatus;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setOrderStatus(OrderStatus status) {
        this.orderStatus = status;
    }
}
