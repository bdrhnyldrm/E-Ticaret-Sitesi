package com.ecommerce.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties; // <-- EKLENDİ

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, length = 150)
    private String name;

    @Column(length = 1000)
    private String description;

    @NotNull
    @PositiveOrZero
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @PositiveOrZero
    @Column(nullable = false)
    private int stock;

    @Builder.Default
    @Column(length = 500)
    private String imageUrl = "/img/default.jpg";

    @ManyToOne
    @JoinColumn(name = "category_id")
    @JsonIgnoreProperties({"products"}) // category.products alanını JSON'a dahil etme
    private Category category;

    @PrePersist
    public void prePersist() {
        if (imageUrl == null || imageUrl.isBlank()) {
            imageUrl = "/img/default.jpg";
        }
    }
}
