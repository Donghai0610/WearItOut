package com.g4.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class CartItemResponseDTO {
    private Long productId;
    private String productName;
    private Double price;
    private Integer quantity;
    private Double totalPrice;

}
