package com.g4.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class NewOrderResponseDTO {
    private Long orderId;
    private Double totalPrice;
    private Integer totalQuantity;
}
