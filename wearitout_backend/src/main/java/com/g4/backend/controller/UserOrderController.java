package com.g4.backend.controller;

import com.g4.backend.dto.response.OrderDetailResponseDTO;
import com.g4.backend.dto.response.OrderResponse;
import com.g4.backend.dto.response.OrderResponseDTO;
import com.g4.backend.dto.response.OrderShippingStatusDTO;
import com.g4.backend.service.OrderDetailService;
import com.g4.backend.service.OrderService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}
