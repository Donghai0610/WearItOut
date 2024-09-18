package com.g4.backend.model.dto;

import lombok.Data;

import java.util.Date;
@Data
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String phoneNumber;
    private String address;
    private String avatar;
    private String balance;
    private String accessToken;
    private String refreshToken;
    private Long tokenExpiresAt;
    private Long isActive;
    private Long isDelete;
    private Date createAt;
    private Date updateAt;
    private Date deleteAt;

}
