package com.g4.backend.controller;

import com.g4.backend.dto.request.OrderRequestDTO;
import com.g4.backend.dto.response.*;
import com.g4.backend.model.Order;
import com.g4.backend.service.OrderDetailService;
import com.g4.backend.service.OrderService;
import com.g4.backend.utils.PaymentMethod;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/user/order")
public class UserOrderController {
    private final OrderService orderService;
    private final OrderDetailService orderDetailService;

    @GetMapping("/list")
    public ResponseEntity<?> getOrdersByUserAndFilter(
            @RequestParam(value = "paymentStatus", required = false) String paymentStatus,
            @RequestParam(value = "shippingStatus", required = false) String shippingStatus,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        Page<OrderResponseDTO> orderResponseDTOS = orderService.getOrderByUser(paymentStatus, shippingStatus, page, size);
        List<OrderResponseDTO> orders = orderResponseDTOS.getContent();
        return ResponseEntity.ok(new OrderResponse(orders, orderResponseDTOS.getTotalPages()));
    }

    @GetMapping("/{orderId}/details")
    public ResponseEntity<?> getOrderDetailByOrderId(@PathVariable long orderId) {
        List<OrderDetailResponseDTO> orderDetails = orderDetailService.getOrderDetailByOrderId(orderId);
        return ResponseEntity.ok(orderDetails);
    }

    @GetMapping("/{orderId}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable long orderId) {
        orderService.cancelOrder(orderId);
        return ResponseEntity.ok("Cancel Order success");
    }

    @GetMapping("/{orderId}/shipping-status")
    public ResponseEntity<?> getOrderShippingStatus(@PathVariable long orderId) {
        List<OrderShippingStatusDTO> orderShippingStatusDTOS = orderDetailService.getOrderShippingStatus(orderId);
        return ResponseEntity.ok(orderShippingStatusDTOS);
    }


    @PostMapping("/create")
    public ResponseEntity<String> createOrder(@RequestParam Long userId, @RequestParam String shipAddress, @RequestParam PaymentMethod paymentMethod) {
        try {
            // Gọi service để tạo đơn hàng
            orderService.createOrdersForCart(userId, shipAddress, paymentMethod);
            return ResponseEntity.ok("Đơn hàng đã được tạo thành công!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Có lỗi xảy ra: " + e.getMessage());
        }
    }

    // Lấy đơn hàng theo ID
    @GetMapping("/{orderId}")
    public NewOrderResponseDTO getOrder(@PathVariable Long orderId) {
        try {
            Order order = orderService.getOrderById(orderId);
            return new NewOrderResponseDTO(order.getOrderId(), order.getTotalPrice(), order.getTotalQuantity());
        } catch (Exception e) {
            throw new RuntimeException("Order not found for id: " + orderId);
        }
    }

    @GetMapping("/{userId}/purchased-products")
    public ResponseEntity<List<OrderDetailResponseDTO>> getUserPurchasedProducts(@PathVariable("userId") Long userId) {
        List<OrderDetailResponseDTO> orderDetails = orderService.getPurchasedProductsByUser(userId);

        if (orderDetails.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(orderDetails);
    }
}
