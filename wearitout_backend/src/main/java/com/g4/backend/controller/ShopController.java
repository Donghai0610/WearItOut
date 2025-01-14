package com.g4.backend.controller;

import com.g4.backend.dto.ShopDetailDTO;
import com.g4.backend.dto.response.ResponseDTO;
import com.g4.backend.dto.response.SearchResponse;
import com.g4.backend.dto.response.ShopsResponseDTO;
import com.g4.backend.dto.response.VnPayResponseDTO;
import com.g4.backend.model.Order;
import com.g4.backend.service.ShopService;
import com.g4.backend.service.VnPayService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/shop")
public class ShopController {
    private final ShopService shopService;
    private final VnPayService paymentService;


    public ShopController(ShopService shopService, VnPayService paymentService) {
        this.shopService = shopService;
        this.paymentService = paymentService;
    }

    @GetMapping("/search/{userId}")
    public ResponseEntity<?> searchShops(
            @PathVariable Long userId,
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "isActive", required = false) String isActive,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        Page<ShopsResponseDTO> shopPage = shopService.searchShopsByUser(keyword, category, isActive, page, size, userId);
        List<ShopsResponseDTO> content = shopPage.getContent();
        return ResponseEntity.ok(new SearchResponse(content, shopPage.getTotalPages()));
    }

    @GetMapping("/create_payment/vn-pay/{orderId}")
    public ResponseEntity<?> createPayment(
            @PathVariable int orderId,
            @RequestParam(value = "total") Double total
    ) throws UnsupportedEncodingException {
        Long amount = Math.round(total * 100);
        VnPayResponseDTO paymentResponse = paymentService.createPayment(amount, orderId);
        return  ResponseEntity.ok(paymentResponse);
    }

    @GetMapping("/vn-pay-callback")
    public ResponseEntity<?> payCallbackHandler(
            @RequestParam String vnp_ResponseCode,
            @RequestParam String vnp_TxnRef
    ){
        if(vnp_ResponseCode.equals("00")) {
            Long orderId = Long.parseLong(vnp_TxnRef.split("_")[0]);
            Order updatedOrder = shopService.updateOrderStatusToPaid(orderId);
            return ResponseEntity.ok(ResponseDTO.builder()
                    .code(200)
                    .message("Payment successful")
                    .data(updatedOrder)
                    .build());
        } else {
            return ResponseEntity.badRequest().body(ResponseDTO.builder()
                    .code(400)
                    .message("Payment failed")
                    .data(null)
                    .build());
        }
    }

    @GetMapping("/shop-payment/{shopId}")
    public ResponseEntity<?> payment(
            @PathVariable Long shopId) {
        ShopDetailDTO shopDetailDTO = shopService.viewShopDetail(shopId);
        Long tax = Long.parseLong(shopDetailDTO.getValue());
    ResponseDTO order = shopService.processBills(shopId,tax);
    if(order!=null){
        return ResponseEntity.ok(order);
    }else{
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
    }
    }
}
