package com.g4.backend.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderRequestDTO {
    @NotNull(message = "Cart id is required")
    private Long cartId;
    @NotNull(message = "User id is required")
    private Long userId;
    @NotNull(message = "Shop id is required")
    private Long shopId;
    @NotEmpty(message = "Shipping address cannot be empty")
    private String shipAddress;
    @NotEmpty(message = "Payment status cannot be empty")
    private String paymentStatus;

    private List<CartItemRequestDTO> cartItems;

}
