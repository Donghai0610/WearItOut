package com.g4.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "cart_item")
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_item_id")
    private Long cartItemId;

    @ManyToOne
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart; // Tham chiếu đến giỏ hàng

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product; // Tham chiếu đến sản phẩm

    private int quantity; // Số lượng sản phẩm trong giỏ hàng

    private Double totalPrice; // Giá tổng của sản phẩm trong giỏ hàng (price * quantity)
}
