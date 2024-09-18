package com.g4.backend.model.dto;

import lombok.Data;

import java.util.Date;

@Data
public class RoleDTO {
    private Long id;

    private String roleName;

    private Date createAt;

    private Long createBy;

    private Date updateAt;

    private Long updateBy;

    private Date deleteAt;

    private Long deleteBy;

    private Long isDelete;
}
