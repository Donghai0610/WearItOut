package com.g4.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponeDTO {

    private int code;
    private String message;
    private String token;
    private Long userId;
    private String expirationTime;
    private String role;

}
