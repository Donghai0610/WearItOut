package com.g4.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
@Data
@Slf4j
@NoArgsConstructor
@Builder
public class UserDetailDTO {
    private Long userId;
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private Boolean gender;
    private String address;
    private String phone;
    private String avatar;
    private String note;
    private LocalDate createAt;
    private LocalDate updateAt;
    private String isActive;
    private String settingName;
    private List<Long> shopIds;
    private List<String> shopNames;
}

