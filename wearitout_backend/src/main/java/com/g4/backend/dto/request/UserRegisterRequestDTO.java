package com.g4.backend.dto.request;

import com.g4.backend.model.Setting;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class UserRegisterRequestDTO {
    private String username;
    private String password;
    private String email;
    private String phone;



}
