package com.ecommerce.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_id") // <-- FK kolon adı net
    private Order order;

    @ManyToOne
    @JoinColumn(name = "product_id") // (opsiyonel ama netlik için iyi)
    private Product product;

    private int quantity;
}
