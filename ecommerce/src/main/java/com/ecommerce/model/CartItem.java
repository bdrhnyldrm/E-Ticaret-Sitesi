package com.ecommerce.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore; // <-- EKLENDİ

@Entity
@Table(name = "cart_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int quantity;

    @ManyToOne
    private Product product;

    @ManyToOne
    @JsonIgnore // Kullanıcı bilgisi JSON'a dahil edilmez, döngü ve gereksiz veri önlenir
    private User user;
}
