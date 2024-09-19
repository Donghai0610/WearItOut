package com.g4.backend.model.dto;

import lombok.Data;

import java.util.Date;

@Data
public class ReviewDTO {
    private Long id;

    private Long productId;

    private Long buyerId;

    private Long rating;

    private String reviewText;

    private Date createdAt;

    private Long createBy;

    private Date updateAt;

    private Long updateBy;

    private Date deleteAt;

    private Long deleteBy;

    private Long isDelete;
}
