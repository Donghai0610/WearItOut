package com.g4.backend.controller;

import com.g4.backend.dto.request.OrderRequestDTO;
import com.g4.backend.dto.response.*;
import com.g4.backend.model.Cart;
import com.g4.backend.model.Order;
import com.g4.backend.model.User;
import com.g4.backend.repository.CartRepository;
import com.g4.backend.repository.OrderRepository;
import com.g4.backend.repository.UserRepository;
import com.g4.backend.service.OrderDetailService;
import com.g4.backend.service.OrderService;
import com.g4.backend.utils.PaymentMethod;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/user/order")
public class UserOrderController {
    private final OrderService orderService;
    private final OrderDetailService orderDetailService;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
private final CartRepository cartRepository;

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

    @PostMapping("/create-payment")
    public ResponseEntity<NewOrderMessageResponseDTO> createOrderAndPayment(
            @RequestParam Long userId,
            @RequestParam String shipAddress,
            @RequestParam PaymentMethod paymentMethod) {

        try {
            // Gọi Service để tạo đơn hàng và thanh toán
            NewOrderMessageResponseDTO responseDTO = orderService.createOrdersForCart(userId, shipAddress, paymentMethod);
            return ResponseEntity.ok(responseDTO);

        } catch (Exception e) {
            return ResponseEntity.status(400).body(new NewOrderMessageResponseDTO("Đã xảy ra lỗi: " + e.getMessage(),null,null));
        }
    }




    @PostMapping("/payment-success")
    public ResponseEntity<String> handlePaymentSuccess(@RequestParam Long orderId) {
        try {
            // Cập nhật trạng thái thanh toán của đơn hàng thành "PAID"
            orderService.changeStatusOrderToPaid(orderId);

            // Trả về phản hồi thành công
            return ResponseEntity.ok("Trạng thái thanh toán đã được cập nhật thành công!");

        } catch (Exception e) {
            return ResponseEntity.status(400).body("Lỗi khi cập nhật trạng thái thanh toán: " + e.getMessage());
        }
    }

    @PostMapping("/cancel-payment/{orderId}")
    public ResponseEntity<String> cancelPayment(@PathVariable long orderId) {
        try {
            // Gọi service để hủy thanh toán và cập nhật số lượng sản phẩm
            orderService.cancelPaymentAndUpdateStock(orderId);
            return ResponseEntity.ok("Đơn hàng đã bị hủy thanh toán và số lượng sản phẩm đã được cập nhật.");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy đơn hàng với ID: " + orderId);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Có lỗi xảy ra trong quá trình hủy thanh toán.");
        }
    }


}
