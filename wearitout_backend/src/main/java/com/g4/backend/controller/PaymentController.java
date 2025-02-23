package com.g4.backend.controller;

import com.g4.backend.service.OrderService;
import com.g4.backend.service.ShopService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@AllArgsConstructor
@RequestMapping("/payment")
public class PaymentController {
  private final OrderService orderService;
  private final ShopService shopService;

    @PostMapping("/vnpay")
    public ResponseEntity<Map<String, Object>> payWithVNPay(@RequestBody Map<String, Object> payload) {
        String orderId = (String) payload.get("orderId");
        Double amount = (Double) payload.get("amount");

        // Giả lập URL thanh toán VNPay
        String paymentUrl = "https://sandbox.vnpayment.vn/payment?orderId=" + orderId + "&amount=" + amount;

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("url", paymentUrl);
        return ResponseEntity.ok(response);
    }

    // 2. Thanh toán bằng mã QR
    @PostMapping("/qr")
    public ResponseEntity<Map<String, Object>> payWithQR(@RequestBody Map<String, Object> payload) {
        String orderId = (String) payload.get("orderId");
        Double amount = (Double) payload.get("amount");

        // Giả lập mã QR (thực tế sẽ dùng API để tạo mã QR thực)
        String qrCodeUrl = "https://example.com/qr-code?orderId=" + orderId + "&amount=" + amount;

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("qrCode", qrCodeUrl);
        return ResponseEntity.ok(response);
    }

    // 3. Thanh toán khi nhận hàng (COD)
    @PostMapping("/cod")
    public ResponseEntity<Map<String, Object>> payWithCOD(@RequestBody Map<String, Object> payload) {
        String orderId = (String) payload.get("orderId");
        String userId = (String) payload.get("userId");

        // Giả lập xác nhận đơn hàng COD
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Đơn hàng đã được xác nhận, thanh toán khi nhận hàng.");
        return ResponseEntity.ok(response);
    }
}
