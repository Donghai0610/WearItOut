package com.g4.backend.model.dto;

import lombok.Data;

import java.util.Date;

@Data
public class CategoryDTO {
    private Long id;

    private String categoryName;

    private Boolean isDelete;

    private Date createAt;

    private Date updateAt;

    private Date deleteAt;

    private Long createBy;

    private Long deleteBy;

    private Long updateBy;
}
