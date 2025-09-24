package com.g4.backend.repository;

import com.g4.backend.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query(
            value = """
                    SELECT DISTINCT p.*
                    FROM product p
                    LEFT JOIN setting st ON p.setting_id = st.setting_id
                    LEFT JOIN shop sh ON p.shop_id = sh.shop_id
                    WHERE
                    p.product_name LIKE COALESCE(CONCAT('%', :productName, '%'), p.product_name)
                    AND p.price >= COALESCE(:priceMin, p.price)
                    AND p.price <= COALESCE(:priceMax, p.price)
                    AND p.rating >= COALESCE(:ratingMin, p.rating)
                    AND p.rating <= COALESCE(:ratingMax, p.rating)
                    AND st.name LIKE COALESCE(CONCAT('%', :setting, '%'), st.name)
                    AND sh.name LIKE COALESCE(CONCAT('%', :shop, '%'), sh.name)
                    """,
            countQuery = """
                    SELECT COUNT(DISTINCT p.product_id)
                    FROM product p
                    LEFT JOIN setting st ON p.setting_id = st.setting_id
                    LEFT JOIN shop sh ON p.shop_id = sh.shop_id
                    WHERE
                    p.product_name LIKE COALESCE(CONCAT('%', :productName, '%'), p.product_name)
                    AND p.price >= COALESCE(:priceMin, p.price)
                    AND p.price <= COALESCE(:priceMax, p.price)
                    AND p.rating >= COALESCE(:ratingMin, p.rating)
                    AND p.rating <= COALESCE(:ratingMax, p.rating)
                    AND st.name LIKE COALESCE(CONCAT('%', :setting, '%'), st.name)
                    AND sh.name LIKE COALESCE(CONCAT('%', :shop, '%'), sh.name)
                    """,
            nativeQuery = true)
    Page<Product> searchByProductFields(
            @Param("productName") String productName,
            @Param("priceMin") Double priceMin,
            @Param("priceMax") Double priceMax,
            @Param("ratingMin") Double ratingMin,
            @Param("ratingMax") Double ratingMax,
            @Param("setting") String setting,
            @Param("shop") String shop,
            Pageable pageable);

    @Query(value = "SELECT p.* FROM product p " +
            "LEFT JOIN setting st ON p.setting_id = st.setting_id " +
            "WHERE p.shop_id = :shopId " +
            "AND (:productName IS NULL OR LOWER(p.product_name) LIKE LOWER(CONCAT('%', :productName, '%'))) "
            +
            "AND (:price IS NULL OR p.price = :price) " +
            "AND (:setting IS NULL OR LOWER(st.name) LIKE LOWER(CONCAT('%', :setting, '%'))) " +
            "ORDER BY p.price ASC", nativeQuery = true)
    Page<Product> findProductsByShopId(
            @Param("shopId") Long shopId,
            @Param("productName") String productName,
            @Param("price") Double price,
            @Param("setting") String setting,
            Pageable pageable);

    @Query(value = "SELECT p.* FROM product p " +
            "WHERE p.shop_id = :shopId " +
            "AND p.product_id = :productId", nativeQuery = true)
    Optional<Product> findProductByShopIdAndProductId(
            @Param("shopId") Long shopId,
            @Param("productId") Long productId);

    @Query(value = "SELECT p.* FROM product p " +
            "WHERE p.status = true " +
            "ORDER BY p.rating DESC", nativeQuery = true)
    List<Product> findTopRatedProducts(Pageable pageable);

    @Query(value = "SELECT p.* FROM product p " +
            "WHERE p.status = true AND p.setting_id = :settingId " +
            "ORDER BY p.rating DESC", nativeQuery = true)
    List<Product> findTrendingProducts(Long settingId, Pageable pageable);

    @Query(value = "SELECT p.* FROM product p " +
            "WHERE p.shop_id = (SELECT p2.shop_id FROM product p2 WHERE p2.product_id = :productId) " +
            "AND p.product_id != :productId", nativeQuery = true)
    List<Product> findProductsFromSameShop(@Param("productId") Long productId);

}
