package com.g4.backend.model.enity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "orders")
@JsonIgnoreProperties(ignoreUnknown = true)
public class OrderEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "status_id")
    private Long statusId;

    @Column(name = "buyer_id")
    private Long buyerId;

    @Column(name = "seller_id")
    private Long sellerId;

    @Column(name = "total_price")
    private Long totalPrice;

    @Column(name = "is_delete")
    private Long isDelete;

    @Column(name = "create_at")
    private Date createAt;

    @Column(name = "create_by")
    private Long createBy;

    @Column(name = "update_at")
    private Date updateAt;

    @Column(name = "update_by")
    private Long updateBy;

    @Column(name = "delete_at")
    private Date deleteAt;

    @Column(name = "delete_by")
    private Long deleteBy;
}
