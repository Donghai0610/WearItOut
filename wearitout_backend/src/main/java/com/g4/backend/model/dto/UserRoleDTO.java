package com.g4.backend.model.dto;

import lombok.Data;

import java.util.Date;

@Data
public class UserRoleDTO {
    private Long userId;

    private Long roleId;

    private Long createBy;

    private Date createAt;

    private Date updateAt;

    private Long updateBy;

    private Long deleteBy;

    private Date deleteAt;
}
