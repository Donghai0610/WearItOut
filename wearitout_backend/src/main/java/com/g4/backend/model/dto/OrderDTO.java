package com.g4.backend.model.dto;

import lombok.Data;

import java.util.Date;

@Data
public class OrderDTO {

    private Long id;

    private Long statusId;

    private Long buyerId;

    private Long sellerId;

    private Long totalPrice;

    private Long isDelete;

    private Date createAt;

    private Long createBy;

    private Date updateAt;

    private Long updateBy;

    private Date deleteAt;

    private Long deleteBy;
}
