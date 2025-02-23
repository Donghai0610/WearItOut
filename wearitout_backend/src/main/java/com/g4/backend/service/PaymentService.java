package com.g4.backend.service;

import com.g4.backend.dto.response.OrderResponseDTO;
import com.g4.backend.mapper.OrderMapper;
import com.g4.backend.repository.*;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Service
@AllArgsConstructor
public class PaymentService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;

    public Map<String, Object> processVNPayPayment(Long orderId, Double amount) {
        // Giả lập URL thanh toán VNPay
        String paymentUrl = "https://sandbox.vnpayment.vn/payment?orderId=" + orderId + "&amount=" + amount;

        // Cập nhật trạng thái thanh toán
        updatePaymentStatus(orderId, "Paid");

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("url", paymentUrl);
        return response;
    }

    public Map<String, Object> processQRPayment(Long orderId, Double amount) {
        // Giả lập mã QR (thực tế sẽ dùng API để tạo mã QR thực)
        String qrCodeUrl = "https://example.com/qr-code?orderId=" + orderId + "&amount=" + amount;

        // Cập nhật trạng thái thanh toán
        updatePaymentStatus(orderId, "Paid");

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("qrCode", qrCodeUrl);
        return response;
    }

    public Map<String, Object> processCODPayment(Long orderId) {
        // Cập nhật trạng thái thanh toán và vận chuyển
        updatePaymentStatus(orderId, "COD");
        updateShippingStatus(orderId, "Confirmed");

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Đơn hàng đã được xác nhận, thanh toán khi nhận hàng.");
        return response;
    }

    private void updatePaymentStatus(Long orderId, String status) {
        orderRepository.findById(orderId).ifPresent(order -> {
            order.setPaymentStatus(status);
            orderRepository.save(order);
        });
    }

    private void updateShippingStatus(Long orderId, String status) {
        orderRepository.findById(orderId).ifPresent(order -> {
            order.setShipAddress(status);
            orderRepository.save(order);
        });
    }

}
