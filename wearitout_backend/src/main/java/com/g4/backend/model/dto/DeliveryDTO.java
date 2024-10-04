package com.g4.backend.model.dto;

import lombok.Data;
import org.mapstruct.Mapper;

import java.util.Date;
@Data
public class DeliveryDTO {
    private Long id;

    private Long orderId;

    private String serviceName;

    private Long trackingNumber;

    private Long deliveryStatus;

    private Date shippedDate;

    private Date deliveredDate;

    private Date createAt;

    private Long createBy;

    private Date updateAt;

    private Long updateBy;

    private Date deleteAt;

    private Long deleteBy;
}
