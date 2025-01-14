package com.g4.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UsersResponseDTO {
    private Long userId;
    private String username;
    private String email;
    private String phone;
    private String isActive;
    private List<String> shopName;
    private String settingName;
}
