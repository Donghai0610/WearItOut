package com.g4.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ShopsResponseDTO {
    private Long shopId;
    private String shopName;
    private String email;
    private String shopAddress;
    private String settingName;
    private String isActive;
    private Double rating;
}
