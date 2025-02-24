package com.g4.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.g4.backend.utils.PaymentMethod;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Nationalized;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity(name = "Order")
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "`order`")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Long orderId;

    private Double totalPrice;

    private String paymentStatus;

    private Integer totalQuantity;

    @Nationalized
    private String shipAddress;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDate  createAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    @JsonBackReference
    private List<OrderDetail> orderDetails;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false,
            foreignKey = @ForeignKey(name = "FK_Order_User")
    )
    @JsonBackReference
    private User user;

    @ManyToOne
    @JoinColumn(name = "shop_id", nullable = false,
            foreignKey = @ForeignKey(name = "FK_Order_Shop")
    )
    @JsonBackReference
    private Shop shop;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OrderSetting> orderSettings;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method")
    private PaymentMethod paymentMethod;

    @Column(name = "payment_link_url")
    private String paymentLinkUrl;

    @Column(name = "cart_id")
    private Long cartId;  // Lưu cartId vào Order để liên kết với giỏ hàng

}
