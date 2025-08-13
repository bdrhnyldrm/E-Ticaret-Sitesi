package com.ecommerce.service;

import com.ecommerce.model.CartItem;
import com.ecommerce.model.Product;
import com.ecommerce.model.User;

import java.util.List;

public interface CartService {
    CartItem addToCart(User user, Product product, int quantity);
    void removeFromCart(Long productId, String userEmail);
    List<CartItem> getUserCart(String userEmail);
    void clearCart(User user);

}
