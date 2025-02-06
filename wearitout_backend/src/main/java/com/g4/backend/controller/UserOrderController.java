package com.g4.backend.controller;

import com.g4.backend.dto.request.OrderRequestDTO;
import com.g4.backend.dto.response.*;
import com.g4.backend.model.Order;
import com.g4.backend.service.OrderDetailService;
import com.g4.backend.service.OrderService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
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
    public NewOrderResponseDTO  createOrder(@Valid @RequestBody OrderRequestDTO orderRequestDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            List<String> errorMessages = bindingResult.getAllErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .collect(Collectors.toList());

            throw new IllegalArgumentException("Invalid input data: " + String.join(", ", errorMessages));
        }

        try {
            return orderService.createOrder(orderRequestDTO, orderRequestDTO.getUserId());
        } catch (RuntimeException e) {
            throw new IllegalArgumentException("Error creating order: " + e.getMessage());
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
}
