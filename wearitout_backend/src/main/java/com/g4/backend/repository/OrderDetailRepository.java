package com.g4.backend.repository;

import com.g4.backend.model.OrderDetail;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {
    List<OrderDetail> getOrderDetailsByOrder_OrderId(long orderId);

    @Query("SELECT s.name, os.updateAt " +
            " FROM OrderSetting os" +
            " LEFT JOIN os.setting s" +
            " WHERE os.order.orderId = :orderId" +
            " ORDER BY os.updateAt DESC")
    List<Object[]> getOrderShippingStatus(@Param("orderId") long orderId);
}