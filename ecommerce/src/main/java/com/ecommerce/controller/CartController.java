package com.ecommerce.controller;

import com.ecommerce.model.CartItem;
import com.ecommerce.model.Order;
import com.ecommerce.model.Product;
import com.ecommerce.model.User;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.service.CartService;
import com.ecommerce.service.OrderService;
import com.ecommerce.service.impl.UserService;
import com.ecommerce.config.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final ProductRepository productRepository;
    private final JwtUtil jwtUtil;
    private final UserService userService;
    private final OrderService orderService;


    private User getCurrentUser(String authHeader) {
        String token = authHeader.substring(7); // "Bearer <token>"
        String email = jwtUtil.extractUsername(token);
        return userService.findByEmail(email);
    }

    // ✅ Sepete ürün ekle
    @PostMapping("/add")
    public ResponseEntity<CartItem> addToCart(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam Long productId,
            @RequestParam int quantity
    ) {
        User user = getCurrentUser(authHeader);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Ürün bulunamadı"));

        CartItem item = cartService.addToCart(user, product, quantity);
        return ResponseEntity.ok(item);
    }

    // ✅ Sepetten ürün sil
    @DeleteMapping("/remove/{id}")
    public ResponseEntity<?> removeFromCart(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id
    ) {
        User user = getCurrentUser(authHeader);
        cartService.removeFromCart(id, user.getEmail());
        return ResponseEntity.ok("Ürün sepetten silindi");
    }

    // ✅ Kullanıcının sepetini listele
    @GetMapping("/my")
    public ResponseEntity<List<CartItem>> getCart(
            @RequestHeader("Authorization") String authHeader
    ) {
        User user = getCurrentUser(authHeader);
        List<CartItem> items = cartService.getUserCart(user.getEmail());
        return ResponseEntity.ok(items);
    }

    // ✅ Sepeti temizle
    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart(@RequestHeader("Authorization") String authHeader) {
        User user = getCurrentUser(authHeader);
        cartService.clearCart(user);
        return ResponseEntity.ok("Sepet başarıyla temizlendi.");
    }

    // ✅ Ödeme yap ve siparişi oluştur
    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@RequestHeader("Authorization") String authHeader) {
        User user = getCurrentUser(authHeader);
        Order order = orderService.checkout(user);
        return ResponseEntity.ok(order);
    }

    // ✅ Kullanıcının siparişlerini listele
    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getUserOrders(@RequestHeader("Authorization") String authHeader) {
        User user = getCurrentUser(authHeader);
        List<Order> orders = orderService.getUserOrders(user);
        return ResponseEntity.ok(orders);
    }
}
