package com.g4.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.g4.backend.model.key.KeyOrderShipping;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "order_settings")
public class OrderSetting {
    @EmbeddedId
    private KeyOrderShipping keyOrderSetting;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false,
            foreignKey = @ForeignKey(name = "FK_OrderSetting_Order")
    )
    @MapsId(value = "orderId")
    @JsonBackReference
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "setting_id", nullable = false,
            foreignKey = @ForeignKey(name = "FK_OrderSetting_Setting")
    )
    @MapsId(value = "settingId")
    @JsonBackReference
    private Setting setting;

    @CreationTimestamp
    @Column(updatable = true)
    private LocalDateTime updateAt;

}
