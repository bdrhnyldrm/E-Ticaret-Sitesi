package com.ecommerce.controller;

import com.ecommerce.dto.ProductRequest;
import com.ecommerce.model.Product;
import com.ecommerce.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // ✔️ Yeni ürün oluştur
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody ProductRequest request) {
        Product createdProduct = productService.createProduct(request);
        return ResponseEntity.ok(createdProduct);
    }

    // ✔️ Ürün güncelle
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @RequestBody ProductRequest request
    ) {
        Product updatedProduct = productService.updateProduct(id, request);
        return ResponseEntity.ok(updatedProduct);
    }

    // ✔️ Ürün sil
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok("Ürün silindi");
    }

    // ✔️ Tüm ürünleri listele
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    // ✔️ ID'ye göre ürün getir
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    // ✔️ Ada göre arama
    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchByName(@RequestParam String name) {
        return ResponseEntity.ok(productService.searchByName(name));
    }

    // ✔️ Kategoriye göre filtreleme
    @GetMapping("/filter")
    public ResponseEntity<List<Product>> filterByCategory(@RequestParam String category) {
        return ResponseEntity.ok(productService.filterByCategory(category));
    }

    // ✔️ Fiyata göre artan sıralama
    @GetMapping("/sort/asc")
    public ResponseEntity<List<Product>> sortByPriceAsc() {
        return ResponseEntity.ok(productService.sortByPriceAsc());
    }

    // ✔️ Fiyata göre azalan sıralama
    @GetMapping("/sort/desc")
    public ResponseEntity<List<Product>> sortByPriceDesc() {
        return ResponseEntity.ok(productService.sortByPriceDesc());
    }
}
