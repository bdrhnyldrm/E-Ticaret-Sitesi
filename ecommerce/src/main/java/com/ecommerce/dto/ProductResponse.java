package com.ecommerce.dto;

import com.ecommerce.model.Product;
import java.math.BigDecimal;

public record ProductResponse(
        Long id,
        String name,
        String description,
        BigDecimal price,
        String imageUrl,
        Long categoryId
) {
    public static ProductResponse from(Product p) {
        return new ProductResponse(
                p.getId(),
                p.getName(),
                p.getDescription(),
                p.getPrice(),
                p.getImageUrl(),
                p.getCategory() != null ? p.getCategory().getId() : null
        );
    }
}
