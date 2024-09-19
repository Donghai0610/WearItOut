package com.g4.backend.model.dto;

import lombok.Data;

import java.util.Date;

@Data
public class CategoryProductDTO {
    private Long productId;

    private Long categoryId;

    private Date createAt;

    private Long createBy;

    private Date updateAt;

    private Long updateBy;

    private Date deleteAt;

    private Long deleteBy;
}
