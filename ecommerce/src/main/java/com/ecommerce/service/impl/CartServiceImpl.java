package com.ecommerce.service.impl;

import com.ecommerce.model.CartItem;
import com.ecommerce.model.Product;
import com.ecommerce.model.User;
import com.ecommerce.repository.CartItemRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    public CartItem addToCart(User user, Product product, int quantity) {
        CartItem item = new CartItem();
        item.setUser(user);
        item.setProduct(product);
        item.setQuantity(quantity);
        return cartItemRepository.save(item);
    }

    @Override
    public void removeFromCart(Long productId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        if (user == null) throw new RuntimeException("Kullanıcı bulunamadı");

        CartItem item = cartItemRepository.findByUserAndProductId(user, productId);
        if (item == null) throw new RuntimeException("Sepette bu ürün yok");

        cartItemRepository.delete(item);
    }

    @Override
    public List<CartItem> getUserCart(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        if (user == null) throw new RuntimeException("Kullanıcı bulunamadı");

        return cartItemRepository.findAllByUser(user);
    }

    @Override
    public void clearCart(User user) {
        List<CartItem> cartItems = cartItemRepository.findByUser(user);
        cartItemRepository.deleteAll(cartItems);
    }

}
