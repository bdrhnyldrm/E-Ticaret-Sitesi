package com.ecommerce.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    // One category → many products
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    @JsonIgnore // JSON serileştirmede products alanını atla (döngüyü kırar)
    private List<Product> products;
}
