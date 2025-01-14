package com.g4.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponseDTO {
    private Long orderId;
    private Double totalPrice;
    private String paymentStatus;
    private String shippingStatus;
    private Integer totalQuantity;
    private LocalDate createAt;
    private String shipAddress;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
}
