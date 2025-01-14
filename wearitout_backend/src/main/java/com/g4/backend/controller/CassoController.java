package com.g4.backend.controller;

import com.g4.backend.dto.TransactionData;
import com.g4.backend.dto.request.TransactionRequest;
import com.g4.backend.dto.response.ApiResponse;
import com.g4.backend.model.Order;
import com.g4.backend.service.OrderService;
import com.g4.backend.utils.CassoUtil;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;

@RestController
@AllArgsConstructor
@RequestMapping("/api")
public class CassoController {
    private static final String TRANSACTION_PREFIX = "OD";
    private static final boolean CASE_INSENSITIVE = false;
    private static final int EXPIRATION_DAYS = 3;
    private static final String API_KEY = "AK_CS.c7b9a5d0942811efa865954870c6d3a1.TSr2bo9gdoxhDAy40QbDbzwQxXCgq6CY8Q8EGM2Qy7d8ZBo4pWGdS2zU1Lqa1rY0lp2WBKFn";
    private static final String WEBHOOK_URL = "https://ten-mien-cua-ban.com/api/webhook/handler-bank-transfer";
    private static final String SECURE_TOKEN = "abcxyz";

    private final CassoUtil cassoUtil;
    private final OrderService orderService;

    @PostMapping("/webhook/handler-bank-transfer")
    public ResponseEntity<?> handleBankTransfer(@RequestHeader("secure-token") String secureToken,
                                                @RequestBody TransactionRequest transactionRequest) {
        if (secureToken == null || !secureToken.equals(SECURE_TOKEN)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing secure-token or wrong secure-token");
        }

        List<TransactionData> dataRequest = transactionRequest.getData();
        for (TransactionData item : dataRequest) {
            String orderId = cassoUtil.parseOrderId(CASE_INSENSITIVE, TRANSACTION_PREFIX, item.getDescription());
            if (orderId == null) continue;

            long daysDifference = TimeUnit.MILLISECONDS.toDays(new Date().getTime() - item.getWhen().getTime());
            if (daysDifference >= EXPIRATION_DAYS) continue;

            // Further processing of the orderId, updating transaction status, etc.
            Long orderID = Long.parseLong(orderId);
            Order order = orderService.getOrderById(orderID);
            double priceOrder = order.getTotalPrice();
            if (Math.abs(item.getAmount()) < priceOrder) continue;

            orderService.changeStatusOrderToPaid(orderID);
        }
        return ResponseEntity.ok(new ApiResponse(200, "success", null));
    }
}
