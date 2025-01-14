package com.g4.backend.repository;

import com.g4.backend.model.OrderSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderHistoryRepository extends JpaRepository<OrderSetting, Long> {
}
