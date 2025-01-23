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
public interface ProductRepository extends JpaRepository<Product, Long>{

    @Query("SELECT distinct p FROM Product p " +
            "LEFT JOIN p.setting st " +
            "LEFT JOIN p.shop sh " +
            "WHERE " +
            "(:productName IS NULL OR LOWER(p.productName) LIKE LOWER(CONCAT('%', :productName, '%'))) " +
            "AND (:price IS NULL OR p.price = :price) " +
            "AND (:setting IS NULL OR LOWER(st.name) LIKE LOWER(CONCAT('%', :setting, '%'))) " +
            "AND (:shop IS NULL OR LOWER(sh.name) LIKE LOWER(CONCAT('%', :shop, '%')))")
    Page<Product> searchByProductFields(
            @Param("productName") String productName,
            @Param("price") Double price,
            @Param("setting") String setting,
            @Param("shop") String shop,
            Pageable pageable);


    @Query("SELECT p FROM Product p " +
            "WHERE p.shop.shopId = :shopId " +
            "AND (:productName IS NULL OR LOWER(p.productName) LIKE LOWER(CONCAT('%', :productName, '%'))) " +
            "AND (:price IS NULL OR p.price = :price) " +
            "AND (:setting IS NULL OR LOWER(p.setting.name) LIKE LOWER(CONCAT('%', :setting, '%'))) " +
            "ORDER BY p.price ASC")
    Page<Product> findProductsByShopId(
            @Param("shopId") Long shopId,
            @Param("productName") String productName,
            @Param("price") Double price,
            @Param("setting") String setting,
            Pageable pageable);

    @Query("SELECT p FROM Product p " +
            "WHERE p.shop.shopId = :shopId " +
            "AND p.id = :productId")
    Optional<Product> findProductByShopIdAndProductId(
            @Param("shopId") Long shopId,
            @Param("productId") Long productId);

    @Query("SELECT p FROM Product p " +
            "WHERE p.status = true " +
            "ORDER BY p.rating DESC")
    List<Product> findTopRatedProducts(Pageable pageable);

    @Query("SELECT p FROM Product p " +
            "WHERE p.status = true AND p.setting.settingId = :settingId " +
            "ORDER BY p.rating DESC")
    List<Product> findTrendingProducts(Long settingId, Pageable pageable);


}
