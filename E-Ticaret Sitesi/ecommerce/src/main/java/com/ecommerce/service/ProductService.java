package com.ecommerce.service;

import com.ecommerce.dto.ProductRequest;
import com.ecommerce.model.Product;

import java.util.List;

public interface ProductService {
    Product createProduct(ProductRequest request);
    Product updateProduct(Long id, ProductRequest request);
    void deleteProduct(Long id);
    List<Product> getAllProducts();
    List<Product> getProductsByCategory(String categoryName);
    Product getProductById(Long id);
    List<Product> searchByName(String name);
    List<Product> filterByCategory(String category);
    List<Product> sortByPriceAsc();
    List<Product> sortByPriceDesc();
}
