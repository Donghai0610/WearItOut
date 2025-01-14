package com.g4.backend.repository;


import com.g4.backend.model.OrderSetting;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderSettingRepository extends JpaRepository<OrderSetting, Long> {

}
