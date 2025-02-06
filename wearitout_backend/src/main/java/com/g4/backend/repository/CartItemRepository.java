package com.g4.backend.repository;

import com.g4.backend.model.Cart;
import com.g4.backend.model.CartItem;
import com.g4.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    @Query("SELECT SUM(c.quantity) FROM CartItem c WHERE c.cart.cartId = :cartId")
    Long countTotalItemsInCart(@Param("cartId") Long cartId);

    List<CartItem> findByCart(Cart cart);
}
