package com.ecommerce.repository;

import com.ecommerce.model.Product;
import com.ecommerce.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory(Category category);

    // İsme göre arama (case insensitive)
    List<Product> findByNameContainingIgnoreCase(String name);

    // Kategori adına göre filtreleme
    List<Product> findByCategory_NameIgnoreCase(String categoryName);

    // Fiyat sıralaması
    List<Product> findAllByOrderByPriceAsc();
    List<Product> findAllByOrderByPriceDesc();
}
