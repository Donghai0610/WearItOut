package com.g4.backend.service;

import com.g4.backend.dto.response.CartItemCountDTOResponse;
import com.g4.backend.model.Cart;
import com.g4.backend.repository.CartItemRepository;
import com.g4.backend.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CartItemService {
    private final CartItemRepository cartItemRepository;
    private  final CartRepository cartRepository;

    @Autowired
    public CartItemService(CartItemRepository cartItemRepository, CartRepository cartRepository) {
        this.cartItemRepository = cartItemRepository;
        this.cartRepository = cartRepository;
    }
    public CartItemCountDTOResponse getTotalItemsInCart(Long cartId) {

        Cart cart = cartRepository.findCartByUserId(cartId);
        if (cart == null) {
            throw new RuntimeException("Cart not found");
        }

        Long totalItems = cartItemRepository.countTotalItemsInCart(cart.getCartId());

        // If no items found, return 0 as default
        if (totalItems == null) {
            totalItems = 0L;
        }

        // Return DTO with cartId and total items count
        return new CartItemCountDTOResponse(cartId, totalItems);
    }

}
