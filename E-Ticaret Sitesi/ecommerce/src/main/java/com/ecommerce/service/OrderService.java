package com.ecommerce.service;

import com.ecommerce.model.Order;
import com.ecommerce.model.User;
import com.ecommerce.model.OrderStatus;

import java.util.List;


public interface OrderService {
    Order checkout(User user);
    List<Order> getUserOrders(User user);
    void updateOrderStatus(Long orderId, OrderStatus status);


}
