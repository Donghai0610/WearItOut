package com.g4.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@AllArgsConstructor
@Data
@Slf4j
@NoArgsConstructor
@Builder
public class ShopDetailDTO {
    private Long shopId;
    private String shopName;
    private String email;
    private String shopAddress;
    private String settingName;
    private int settingId;
    private String isActive;
    private Double rating;
    private String ownerName;
    private String value;
    private String bin;
    private String bankAccount;
}
