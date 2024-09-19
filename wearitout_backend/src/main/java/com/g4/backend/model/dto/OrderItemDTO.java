package com.g4.backend.model.dto;

import lombok.Data;

import java.util.Date;

@Data
public class OrderItemDTO {
    private Long id;

    private Long orderId;

    private Long productId;

    private Long quantity;

    private Long price;

    private Long isDelete;

    private Date createAt;

    private Long createBy;

    private Date updateAt;

    private Long updateBy;

    private Date deleteAt;

    private Long deleteBy;
}
