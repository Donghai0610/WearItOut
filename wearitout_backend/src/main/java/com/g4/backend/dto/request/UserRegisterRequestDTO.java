package com.g4.backend.dto.request;

import com.g4.backend.model.Setting;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class UserRegisterRequestDTO {
    @NotNull

    private String username;
    @NotNull
    private String password;
    @NotNull
    @Email(message = "Email should be valid")
    private String email;

    private String phone;



}
