package com.g4.backend.controller;

import com.g4.backend.dto.request.AddProductToCartRequestDTO;
import com.g4.backend.dto.request.UpdateProductInCartRequestDTO;
import com.g4.backend.dto.response.ApiResponse;
import com.g4.backend.dto.response.CartProductCountResponseDTO;
import com.g4.backend.dto.response.CartResponseDTO;
import com.g4.backend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;


    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<CartResponseDTO>> getCartByUserId(@PathVariable Long userId) {
            var result = cartService.getCart(userId);
            return ResponseEntity.ok(
                    ApiResponse.<CartResponseDTO>builder()
                            .code(200)
                            .message("Success")
                            .result(result)
                            .build()
            );



    }

    // Thêm sản phẩm vào giỏ hàng
    @PostMapping("/{userId}/add")
    public CartResponseDTO addProductToCart(@PathVariable Long userId, @RequestBody AddProductToCartRequestDTO request) {
        return cartService.addProductToCart(userId, request);
    }

    // Cập nhật số lượng sản phẩm trong giỏ hàng
    @PostMapping("/{userId}/update")
    public ResponseEntity<ApiResponse<CartResponseDTO>> updateProductInCart(@PathVariable Long userId, @RequestBody UpdateProductInCartRequestDTO request) {
        try {
            var response = cartService.updateProductInCart(userId, request);
            return ResponseEntity.ok(
                    ApiResponse.<CartResponseDTO>builder()
                            .code(200)
                            .message("Cập nhật sản phẩm trong giỏ hàng thành công")
                            .result(response)
                            .build()
            );

        } catch (Exception e) {
           return ResponseEntity.ok(
                   ApiResponse.<CartResponseDTO>builder()
                            .code(500)
                            .message("Server error")
                            .result(null)
                            .build()
           );

        }
    }

    // Xóa sản phẩm khỏi giỏ hàng
    @PostMapping("/{userId}/remove/{productId}")
    public CartResponseDTO removeProductFromCart(@PathVariable Long userId, @PathVariable Long productId) {
        return cartService.removeProductFromCart(userId, productId);
    }

    @GetMapping("/{cartId}/count-products")
    public CartProductCountResponseDTO countTotalProductsInCart(@PathVariable Long cartId) {
        return cartService.countTotalProductsInCart(cartId);
    }

}
