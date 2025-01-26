package com.g4.backend.controller;

import com.g4.backend.dto.response.CartItemCountDTOResponse;
import com.g4.backend.service.CartItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cart_item")
public class CartItemController {

    private final CartItemService cartItemService;

    @Autowired
    public CartItemController(CartItemService cartItemService) {
        this.cartItemService = cartItemService;
    }


    @GetMapping("/total-items/{cartId}")
    public CartItemCountDTOResponse getTotalItemsInCart(@PathVariable Long cartId) {
        return cartItemService.getTotalItemsInCart(cartId);
    }

}
