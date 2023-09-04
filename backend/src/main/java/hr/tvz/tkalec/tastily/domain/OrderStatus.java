package hr.tvz.tkalec.tastily.domain;

import com.fasterxml.jackson.annotation.JsonGetter;
import jakarta.persistence.*;

import java.io.Serializable;
import java.util.List;

@Entity
@Table(name = "order_status")
public class OrderStatus implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "status_value", nullable = false)
    private String status_value;

    @OneToMany(mappedBy = "orderStatus", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Order> orderList;


    public OrderStatus() {
    }

    public Long getId() {
        return this.id;
    }

    @JsonGetter("status_value")
    public String getStatusValue() {
        return this.status_value;
    }

    public List<Order> getOrderList() {
        return this.orderList;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setStatusValue(String status_value) {
        this.status_value = status_value;
    }

    public void setOrderList(List<Order> orderList) {
        this.orderList = orderList;
    }
}
