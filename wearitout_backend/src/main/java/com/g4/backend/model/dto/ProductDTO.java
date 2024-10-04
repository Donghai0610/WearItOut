package com.g4.backend.model.dto;

import lombok.Data;

import java.util.Date;

@Data
public class ProductDTO {
    private Long id;

    private Long size;

    private String productName;

    private String description;

    private Long price;

    private Long stockQuantity;

    private Long solded;

    private Long codidtion;

    private Long isDelete;

    private Date createAt;

    private Long createBy;

    private Date updateAt;

    private Long updateBy;

    private Date deleteAt;

    private Long deleteBy;
}
