package com.g4.backend.repository;

import com.g4.backend.model.Cart;
import com.g4.backend.model.Product;
import com.g4.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    @Query("SELECT c FROM Cart c WHERE c.user.userId = :userId")
    Cart findCartByUserId(@Param("userId") Long userId);

    @Query("SELECT COALESCE(SUM(ci.quantity), 0) FROM CartItem ci WHERE ci.product.id = :productId")
    Integer findTotalQuantityByProductId(@Param("productId") Long productId);

Cart findByCartId(Long cartId);

Optional<Cart> findCartByUser(User user);
//

    Cart findByUser(User user);

    @Modifying
    @Transactional
    @Query("delete from Cart c where c.cartId = :cartId")
    void deleteCartByCartId(@Param("cartId") Long cartId);
}

