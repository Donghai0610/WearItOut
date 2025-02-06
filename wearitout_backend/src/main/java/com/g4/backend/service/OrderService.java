package com.g4.backend.service;

import com.g4.backend.dto.request.OrderRequestDTO;
import com.g4.backend.dto.response.NewOrderResponseDTO;
import com.g4.backend.dto.response.OrderResponseDTO;
import com.g4.backend.mapper.OrderMapper;
import com.g4.backend.model.*;

import com.g4.backend.repository.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;

    public Page<OrderResponseDTO> getOrderByShop(long shopId, String searchKeyword, String paymentStatus, String shippingStatus, int page, int size) {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        Object principal = authentication.getPrincipal();
//
//        String username;
//        if (principal instanceof UserDetails) {
//            username = ((UserDetails) principal).getUsername();
//        } else {
//            username = principal.toString();
//        }

        Pageable pageable = PageRequest.of(page, size);
        Page<OrderResponseDTO> orders = orderRepository.getOrdersByShopAndFilter(shopId, searchKeyword, paymentStatus, shippingStatus, pageable);
        return orders;
    }

    public Page<OrderResponseDTO> getOrderByUser(String paymentStatus, String shippingStatus, int page, int size) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();

        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }

        Pageable pageable = PageRequest.of(page, size);
        Page<OrderResponseDTO> orders = orderRepository.getOrdersByUserAndFilter(username, paymentStatus, shippingStatus, pageable);
        return orders;
    }

    public void cancelOrder(long orderId) {
        Optional<Order> orderOptional = orderRepository.findById(orderId);
        if (orderOptional.isPresent()) {
            Order order = orderOptional.get();
            order.setPaymentStatus("CANCEL");
            orderRepository.save(order);
        }
    }

    public void changeStatusOrderToPaid(long orderId) {
        Optional<Order> orderOptional = orderRepository.findById(orderId);
        if (orderOptional.isPresent()) {
            Order order = orderOptional.get();
            order.setPaymentStatus("PAID");
            orderRepository.save(order);
        }
    }

    public Order getOrderById(long orderId) {
        Optional<Order> orderOptional = orderRepository.findById(orderId);
        return unwarppedOrder(orderOptional, orderId);
    }

    static Order unwarppedOrder(Optional<Order> entity, Long id) {
        if (entity.isPresent()) {
            return entity.get();
        } else {
            throw new EntityNotFoundException("Order with ID " + id + " not found");
        }
    }

    public NewOrderResponseDTO createOrder(OrderRequestDTO orderRequestDTO, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findCartByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        List<CartItem> cartItems = cartItemRepository.findByCart(cart);

        Order order = orderMapper.mapToOrder(orderRequestDTO, cartItems);

        List<OrderDetail> orderDetails = orderMapper.mapToOrderDetails(cartItems);

        order.setOrderDetails(orderDetails);

        order = orderRepository.save(order);

        return new NewOrderResponseDTO(order.getOrderId(), order.getTotalPrice(), order.getTotalQuantity());
    }



}
