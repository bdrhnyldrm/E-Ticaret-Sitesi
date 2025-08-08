package com.ecommerce.service;

import com.ecommerce.model.Category;

import java.util.List;

public interface CategoryService {
    Category createCategory(String name);
    List<Category> getAllCategories();
    Category getByName(String name);
}
