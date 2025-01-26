package com.g4.backend.service;

import com.g4.backend.dto.response.CartItemCountDTOResponse;
import com.g4.backend.repository.CartItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CartItemService {
    private final CartItemRepository cartItemRepository;

    @Autowired
    public CartItemService(CartItemRepository cartItemRepository) {
        this.cartItemRepository = cartItemRepository;
    }
    public CartItemCountDTOResponse getTotalItemsInCart(Long cartId) {
        Long totalItems = cartItemRepository.countTotalItemsInCart(cartId);

        // If no items found, return 0 as default
        if (totalItems == null) {
            totalItems = 0L;
        }

        // Return DTO with cartId and total items count
        return new CartItemCountDTOResponse(cartId, totalItems);
    }

}
