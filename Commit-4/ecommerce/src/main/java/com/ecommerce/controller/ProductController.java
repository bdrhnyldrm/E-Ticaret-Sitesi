package com.ecommerce.controller;

import com.ecommerce.dto.ProductRequest;
import com.ecommerce.dto.ProductResponse;
import com.ecommerce.model.Product;
import com.ecommerce.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // ✔️ Yeni ürün oluştur → DTO döndür
    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(@RequestBody ProductRequest request) {
        Product created = productService.createProduct(request);
        return ResponseEntity.ok(ProductResponse.from(created));
    }

    // ✔️ Ürün güncelle → DTO döndür
    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Long id,
            @RequestBody ProductRequest request
    ) {
        Product updated = productService.updateProduct(id, request);
        return ResponseEntity.ok(ProductResponse.from(updated));
    }

    // ✔️ Ürün sil
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok("Ürün silindi");
    }

    // ✔️ Tüm ürünleri listele → her zaman LİSTE döner (DTO) + cache kapalı
    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAll() {
        List<Product> list = productService.getAllProducts();
        List<ProductResponse> dto = list.stream()
                .map(ProductResponse::from)
                .toList();
        return ResponseEntity
                .ok()
                .cacheControl(CacheControl.noStore())
                .body(dto);
    }

    // ✔️ ID'ye göre ürün getir → DTO
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        Product p = productService.getProductById(id);
        return ResponseEntity.ok(ProductResponse.from(p));
    }

    // ✔️ Ada göre arama → DTO liste
    @GetMapping("/search")
    public ResponseEntity<List<ProductResponse>> searchByName(@RequestParam String name) {
        return ResponseEntity.ok(
                productService.searchByName(name).stream()
                        .map(ProductResponse::from)
                        .toList()
        );
    }

    // ✔️ Kategoriye göre filtre → DTO liste
    @GetMapping("/filter")
    public ResponseEntity<List<ProductResponse>> filterByCategory(@RequestParam String category) {
        return ResponseEntity.ok(
                productService.filterByCategory(category).stream()
                        .map(ProductResponse::from)
                        .toList()
        );
    }

    // ✔️ Fiyata göre artan sıralama → DTO liste
    @GetMapping("/sort/asc")
    public ResponseEntity<List<ProductResponse>> sortByPriceAsc() {
        return ResponseEntity.ok(
                productService.sortByPriceAsc().stream()
                        .map(ProductResponse::from)
                        .toList()
        );
    }

    // ✔️ Fiyata göre azalan sıralama → DTO liste
    @GetMapping("/sort/desc")
    public ResponseEntity<List<ProductResponse>> sortByPriceDesc() {
        return ResponseEntity.ok(
                productService.sortByPriceDesc().stream()
                        .map(ProductResponse::from)
                        .toList()
        );
    }
}
