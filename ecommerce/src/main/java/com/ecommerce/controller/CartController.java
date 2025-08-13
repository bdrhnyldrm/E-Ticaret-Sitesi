package com.ecommerce.controller;

import com.ecommerce.model.CartItem;
import com.ecommerce.model.Order;
import com.ecommerce.model.Product;
import com.ecommerce.model.User;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.service.CartService;
import com.ecommerce.service.OrderService;
import com.ecommerce.service.impl.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final ProductRepository productRepository;
    private final UserService userService;
    private final OrderService orderService;

    /** SecurityContext'ten giriş yapmış kullanıcıyı al */
    private User currentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Yetkisiz erişim");
        }
        Object principal = authentication.getPrincipal();
        String email;
        if (principal instanceof UserDetails ud) {
            email = ud.getUsername(); // bizde username = email
        } else if (principal instanceof User u) {
            email = u.getEmail();
        } else {
            email = authentication.getName(); // yedek
        }
        return userService.findByEmail(email);
    }

    // ✅ Sepete ürün ekle
    @PostMapping("/add")
    public ResponseEntity<CartItem> addToCart(
            Authentication authentication,
            @RequestParam Long productId,
            @RequestParam int quantity
    ) {
        User user = currentUser(authentication);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Ürün bulunamadı"));

        CartItem item = cartService.addToCart(user, product, quantity);
        return ResponseEntity.ok(item);
    }

    // ✅ Sepetten ürün sil
    @DeleteMapping("/remove/{id}")
    public ResponseEntity<?> removeFromCart(
            Authentication authentication,
            @PathVariable Long id
    ) {
        User user = currentUser(authentication);
        cartService.removeFromCart(id, user.getEmail());
        return ResponseEntity.ok("Ürün sepetten silindi");
    }

    // ✅ Kullanıcının sepetini listele
    @GetMapping("/my")
    public ResponseEntity<List<CartItem>> getCart(Authentication authentication) {
        User user = currentUser(authentication);
        List<CartItem> items = cartService.getUserCart(user.getEmail());
        return ResponseEntity.ok(items);
    }

    // ✅ Sepeti temizle
    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart(Authentication authentication) {
        User user = currentUser(authentication);
        cartService.clearCart(user);
        return ResponseEntity.ok("Sepet başarıyla temizlendi.");
    }

    // ✅ Ödeme yap ve siparişi oluştur
    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(Authentication authentication) {
        User user = currentUser(authentication);
        Order order = orderService.checkout(user);
        return ResponseEntity.ok(order);
    }

    // ✅ Kullanıcının siparişlerini listele
    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getUserOrders(Authentication authentication) {
        User user = currentUser(authentication);
        List<Order> orders = orderService.getUserOrders(user);
        return ResponseEntity.ok(orders);
    }
}
