package com.g4.backend.model.dto;

import lombok.Data;

import java.util.Date;

@Data
public class PaymentDTO {
    private Long id;

    private Long orderId;

    private Long paymentGateway;

    private Long paymentStatus;

    private Date paymentDate;

    private Date createAt;

    private Long createBy;

    private Date updateAt;

    private Long updateBy;

    private Date deleteAt;

    private Long deleteBy;
}
