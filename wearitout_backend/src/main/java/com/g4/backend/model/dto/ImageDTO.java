package com.g4.backend.model.dto;

import lombok.Data;

import java.util.Date;

@Data
public class ImageDTO {
    private Long id;

    private Long productId;

    private String imageUrl;

    private Long isDelete;

    private Date createAt;

    private Long createBy;

    private Date updateAt;

    private Long updateBy;

    private Date deleteAt;

    private Long deleteBy;
}
