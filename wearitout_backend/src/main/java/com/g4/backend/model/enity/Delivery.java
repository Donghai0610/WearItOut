package com.g4.backend.model.enity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
@Table(name = "delivery")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Delivery {
    @Id
    @Column(name = "id")
    private int id;

    @Column(name = "order_id", nullable = false)
    private Long orderId;

    @Column(name = "service_name")
    private String serviceName;

    @Column(name = "tracking_number")
    private Long trackingNumber;

    @Column(name = "delivery_status")
    private Long deliveryStatus;

    @Column(name = "shipped_date")
    private Date shippedDate;

    @Column(name = "delivered_date")
    private Date deliveredDate;

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
