package com.g4.backend.model.dto;

import lombok.Data;

import java.util.Date;

@Data
public class ResetPasswordDTO {

    private Long id;

    private Long userId;

    private String passwordResetLink;

    private Date createAt;

    private Long createBy;

    private Date updateAt;

    private Long updateBy;

    private Date deleteAt;

    private Long deleteBy;
}
