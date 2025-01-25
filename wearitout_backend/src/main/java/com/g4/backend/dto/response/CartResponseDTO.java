package com.g4.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartResponseDTO {
    private Long cartId;
    private double totalPrice;
    private List<ProductCartResponseDTO> products;
}
