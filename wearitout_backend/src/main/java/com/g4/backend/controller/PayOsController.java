package com.g4.backend.controller;

import com.g4.backend.service.OrderService;
import lombok.AllArgsConstructor;
import org.apache.commons.codec.digest.HmacUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import vn.payos.type.WebhookData;

@RestController

public class PayOsController {

    private final OrderService orderService;

    public PayOsController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/confirm-webhook")
    public ResponseEntity<String> handlePaymentWebhook(@RequestBody WebhookData webhookData) {
        try {
            // Kiểm tra webhook data và cập nhật trạng thái thanh toán nếu thanh toán thành công
            if ("00".equals(webhookData.getCode()) && "success".equals(webhookData.getDesc())) {
                Long orderId = webhookData.getOrderCode(); // Lấy mã đơn hàng từ webhookData
                int amount = webhookData.getAmount(); // Lấy số tiền thanh toán từ webhookData
                String paymentLinkId = webhookData.getPaymentLinkId(); // Lấy paymentLinkId từ webhookData

                // Cập nhật trạng thái thanh toán của đơn hàng
                orderService.changeStatusOrderToPaid(orderId);

                // Trả về phản hồi thành công
                return ResponseEntity.ok("Thanh toán thành công và trạng thái đã được cập nhật!");
            }

            // Nếu thanh toán không thành công, trả về lỗi
            return ResponseEntity.status(400).body("Thanh toán không thành công.");
        } catch (Exception e) {
            // Xử lý lỗi và trả về phản hồi lỗi
            return ResponseEntity.status(400).body("Lỗi khi xử lý webhook: " + e.getMessage());
        }
    }
}