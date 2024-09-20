package com.g4.backend.model.enity;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.g4.backend.model.enity.Key.KeyOrderProduct;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "order_items")
@JsonIgnoreProperties(ignoreUnknown = true)
public class OrderItem {

   @EmbeddedId
    private KeyOrderProduct keyOrderProduct;

    @Column(name = "quantity")
    private int quantity;

    @Column(name = "price")
    private double price;

    @Column(name = "is_delete")
    private Long isDelete;

    @Column(name = "create_at")
    private Date createAt;

    @Column(name = "update_at")
    private Date updateAt;

    @Column(name = "delete_at")
    private Date deleteAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("orderId")
    @JoinColumn(name = "order_id", nullable = false,
            foreignKey = @ForeignKey(name = "FK_OrderItem_Order")
    )
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("productId")
    @JoinColumn(name = "product_id", nullable = false,
            foreignKey = @ForeignKey(name = "FK_OrderItem_Product")
    )
    private Product product;

}
