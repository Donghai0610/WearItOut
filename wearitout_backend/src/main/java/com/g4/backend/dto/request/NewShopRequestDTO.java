package com.g4.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class NewShopRequestDTO {
    private String shopName;
    private String shopAddress;
    private int settingId;
    private String isActive;
    private Double rating;
    private Long userId;
}
