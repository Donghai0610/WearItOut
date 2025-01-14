package com.g4.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderDetailResponseDTO {
    private long orderId;
    private Double totalPrice;
    private String paymentStatus;
    private String shippingStatus;
    private Integer totalQuantity;
    private String shipAddress;
    private String paymentMethod;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private long productId;
    private String productName;
    private Double productPrice;
    private Integer quantity;
}
