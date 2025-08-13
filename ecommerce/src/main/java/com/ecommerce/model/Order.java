package com.ecommerce.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.*;

@Entity
@Table(name = "orders") // <-- tablo adı değişti
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id") // FK kolon adı net
    private User user;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    @Temporal(TemporalType.TIMESTAMP)
    private Date orderDate;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items;
}
