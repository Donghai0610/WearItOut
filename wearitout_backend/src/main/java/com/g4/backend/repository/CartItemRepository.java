package com.g4.backend.repository;

import com.g4.backend.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.PathVariable;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    @Query("SELECT SUM(c.quantity) FROM CartItem c WHERE c.cart.cartId = :cartId")
    Long countTotalItemsInCart(@Param("cartId") Long cartId);
}
