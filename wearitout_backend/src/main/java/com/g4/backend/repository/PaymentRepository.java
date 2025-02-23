package com.g4.backend.repository;

import com.g4.backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Order, Long> {

}
