package com.g4.backend.repository;

import com.g4.backend.model.Order;
import com.g4.backend.model.Shop;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ShopRepositoryAdmin extends JpaRepository<Shop, Long> {
    @Query("SELECT s FROM Shop s WHERE s.shopId IN :ids")
    List<Shop> findAllByShopId(@Param("ids") List<Long> ids);

    @Query("SELECT distinct s FROM Shop s " +
            "LEFT JOIN s.users u " +
            "LEFT JOIN s.setting c " +
            "WHERE " +
            "(:keyword IS NULL OR LOWER(s.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(s.address) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND (:category IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :category, '%'))) " +
            "AND (:isActive IS NULL OR s.status = :isActive)" +
            "ORDER BY s.shopId DESC")
    Page<Shop> searchByAllFields(@Param("keyword") String keyword,
                                 @Param("category") String category,
                                 @Param("isActive") Boolean isActive,
                                 Pageable pageable);

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO user_shop (shop_id, user_id) VALUES (:shopId, :userId)", nativeQuery = true)
    void insertUserShop(@Param("shopId") Long shopId, @Param("userId") Long userId);

    Optional<Shop> findByName(String name);

    @Query("SELECT distinct s FROM Shop s " +
            "LEFT JOIN s.users u " +
            "LEFT JOIN s.setting c " +
            "WHERE u.userId = :userId " +
            "AND (:keyword IS NULL OR LOWER(s.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(s.address) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND (:category IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :category, '%'))) " +
            "AND (:isActive IS NULL OR s.status = :isActive) " +
            "ORDER BY s.shopId DESC")
    Page<Shop> searchByAllFieldsAndUser(@Param("keyword") String keyword,
                                        @Param("category") String category,
                                        @Param("isActive") Boolean isActive,
                                        @Param("userId") Long userId,
                                        Pageable pageable);

    @Query("SELECT COUNT(o) FROM Order o " +
            "JOIN OrderSetting os ON o.orderId = os.order.orderId " +
            "JOIN Setting s ON os.setting.settingId = s.settingId " +
            "WHERE s.name = 'Bills' AND o.shop.shopId = :shopId " +
            "AND FUNCTION('MONTH', o.createAt) = FUNCTION('MONTH', CURRENT_DATE) " +
            "AND FUNCTION('YEAR', o.createAt) = FUNCTION('YEAR', CURRENT_DATE)")
    long countBillsForShop(Long shopId);

    @Query("SELECT o FROM Order o " +
            "JOIN OrderSetting os ON o.orderId = os.order.orderId " +
            "WHERE os.setting.settingId = 16 AND o.createAt >= :startDate AND o.createAt < :endDate " +
            "AND o.shop.shopId = :shopId AND o.paymentStatus = 'PAID'")
    List<Order> findPaidOrdersForLastMonth(Long shopId, LocalDate startDate, LocalDate endDate);

    @Query("SELECT o FROM Order o " +
            "JOIN OrderSetting os ON o.orderId = os.order.orderId " +
            "JOIN Setting s ON os.setting.settingId = s.settingId " +
            "WHERE s.name = 'Bills' AND o.shop.shopId = :shopId " +
            "AND MONTH(o.createAt) = MONTH(CURRENT_DATE) " +
            "AND YEAR(o.createAt) = YEAR(CURRENT_DATE)")
    Order findSingleBillForShop(Long shopId);

    @Query("SELECT s FROM Shop s JOIN s.users u WHERE u.userId = :userId")
    List<Shop> findShopsByUserId(Long userId);

}
