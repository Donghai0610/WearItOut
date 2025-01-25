package com.g4.backend.controller;

import com.g4.backend.dto.request.AddProductToCartRequestDTO;
import com.g4.backend.dto.request.UpdateProductInCartRequestDTO;
import com.g4.backend.dto.response.CartProductCountResponseDTO;
import com.g4.backend.dto.response.CartResponseDTO;
import com.g4.backend.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cart")
public class CartController {
    private final CartService cartService;

    @Autowired
    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping("/{userId}")
    public CartResponseDTO getCart(@PathVariable Long userId) {
        return cartService.getCart(userId);
    }

    // Thêm sản phẩm vào giỏ hàng
    @PostMapping("/{userId}/add")
    public CartResponseDTO addProductToCart(@PathVariable Long userId, @RequestBody AddProductToCartRequestDTO request) {
        return cartService.addProductToCart(userId, request);
    }

    // Cập nhật số lượng sản phẩm trong giỏ hàng
    @PostMapping("/{userId}/update")
    public CartResponseDTO updateProductInCart(@PathVariable Long userId, @RequestBody UpdateProductInCartRequestDTO request) {
        return cartService.updateProductInCart(userId, request);
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
