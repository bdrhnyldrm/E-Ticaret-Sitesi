package com.ecommerce.controller;

import com.ecommerce.model.Order;
import org.springframework.security.access.prepost.PreAuthorize;

import com.ecommerce.model.OrderStatus;
import com.ecommerce.model.User;
import com.ecommerce.service.OrderService;
import com.ecommerce.config.JwtUtil;
import com.ecommerce.service.impl.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final JwtUtil jwtUtil;
    private final UserService userService;

    private User getCurrentUser(String authHeader) {
        String token = authHeader.substring(7); // "Bearer ...”
        String email = jwtUtil.extractUsername(token);
        return userService.findByEmail(email);
    }

    // ✅ Sipariş Oluştur
    @PostMapping("/checkout")
    public ResponseEntity<Order> checkout(@RequestHeader("Authorization") String authHeader) {
        User user = getCurrentUser(authHeader);
        Order order = orderService.checkout(user);
        return ResponseEntity.ok(order);
    }

    // ✅ Kullanıcının Siparişlerini Listele
    @GetMapping
    public ResponseEntity<List<Order>> getUserOrders(@RequestHeader("Authorization") String authHeader) {
        User user = getCurrentUser(authHeader);
        List<Order> orders = orderService.getUserOrders(user);
        return ResponseEntity.ok(orders);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/status/{orderId}")
    public ResponseEntity<String> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam OrderStatus status
    ) {
        orderService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok("Sipariş durumu güncellendi");
    }



}
