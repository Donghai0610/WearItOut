package com.g4.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "orderDetail")
public class OrderDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "orderDetail_id")
    private Long orderDetailId;

    private Integer quantity;

    @ManyToOne
    @JoinColumn(name = "orderId", nullable = false,
            foreignKey = @ForeignKey(name = "FK_OrderDetail_Order")
    )
    @JsonBackReference
    private Order order;

    @ManyToOne
    @JoinColumn(name = "productId")
    @JsonBackReference
    private Product product;
}
