package com.g4.backend.repository;

import com.g4.backend.dto.response.OrderResponseDTO;
import com.g4.backend.model.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    @Query("SELECT new com.g4.backend.dto.response.OrderResponseDTO(o.orderId, o.totalPrice, o.paymentStatus, s.name, o.totalQuantity, o.createAt, o.shipAddress, " +
            " o.user.username, o.user.email, o.user.phone) " +
            " FROM Order o" +
            " LEFT JOIN User u ON o.user.userId = u.userId" +
            " LEFT JOIN OrderSetting os ON o.orderId = os.order.orderId" +
            " LEFT JOIN Setting s ON os.setting.settingId = s.settingId" +
            " WHERE (:search IS NULL OR " +
            " LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%'))" +
            " OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))" +
            " OR LOWER(u.phone) LIKE LOWER(CONCAT('%', :search, '%')))" +
            " AND os.updateAt = ( " +
            " SELECT MAX(os1.updateAt) FROM OrderSetting os1" +
            " WHERE os1.order.orderId = os.order.orderId)" +
            " AND o.shop.shopId = :shopId" +
            " AND s.type.typeId = 4 " +
            " AND (:shippingStatus IS NULL OR s.name = :shippingStatus)" +
            " AND (:paymentStatus IS NULL OR o.paymentStatus = :paymentStatus)" +
            " ORDER BY o.createAt DESC")
    Page<OrderResponseDTO> getOrdersByShopAndFilter(@Param("shopId") long shopId,
                                                    @Param("search") String search,
                                                    @Param("paymentStatus") String paymentStatus,
                                                    @Param("shippingStatus") String shippingStatus,
                                                    Pageable pageable);

    @Query("SELECT new com.g4.backend.dto.response.OrderResponseDTO(o.orderId, o.totalPrice, o.paymentStatus, s.name, o.totalQuantity, o.createAt, o.shipAddress, " +
            " o.user.username, o.user.email, o.user.phone) " +
            " FROM Order o " +
            " LEFT JOIN o.orderSettings os" +
            " LEFT JOIN os.setting s" +
            " WHERE o.user.username = :username" +
            " AND os.updateAt = ( " +
            " SELECT MAX(os1.updateAt) FROM OrderSetting os1" +
            " WHERE os1.order.orderId = os.order.orderId)" +
            " AND s.type.typeId = 4 " +
            " AND (:shippingStatus IS NULL OR s.name = :shippingStatus)" +
            " AND (:paymentStatus IS NULL OR o.paymentStatus = :paymentStatus)" +
            " ORDER BY o.createAt DESC")
    Page<OrderResponseDTO> getOrdersByUserAndFilter(@Param("username") String username,
                                                    @Param("paymentStatus") String paymentStatus,
                                                    @Param("shippingStatus") String shippingStatus,
                                                    Pageable pageable);
}
