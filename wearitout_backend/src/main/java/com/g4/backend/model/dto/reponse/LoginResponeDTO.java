package com.g4.backend.model.dto.reponse;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponeDTO {
    private int code;
    private String message;
    private String token;
    private String expirationTime;
    private List<String> role;
}
