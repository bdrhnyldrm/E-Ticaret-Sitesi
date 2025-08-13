package com.ecommerce.controller;

import com.ecommerce.dto.CategoryCreateRequest;
import com.ecommerce.dto.CategorySummary;
import com.ecommerce.model.Category;
import com.ecommerce.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    // Tüm kategoriler: yalın DTO (id, name)
    @GetMapping
    public ResponseEntity<List<CategorySummary>> getAll() {
        List<Category> entities = categoryService.getAllCategories();
        List<CategorySummary> dto = entities.stream()
                .map(CategorySummary::from)
                .toList();
        return ResponseEntity.ok(dto);
    }

    // Kategori oluştur: JSON { "name": "Elektronik" }
    @PostMapping
    public ResponseEntity<CategorySummary> create(@RequestBody CategoryCreateRequest req) {
        Category created = categoryService.createCategory(req.name());
        CategorySummary dto = CategorySummary.from(created);
        return ResponseEntity
                .created(URI.create("/api/categories/" + created.getId()))
                .body(dto);
    }

    // Kategori sil
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}
