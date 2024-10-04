package com.g4.backend.model.dto;

import lombok.Data;

import java.util.Date;

@Data
public class AuthTokenDTO {
    private Long id;

    private Long userId;

    private String accessToken;

    private String refreshToken;

    private Long expiresAt;

    private Date createdAt;
}
