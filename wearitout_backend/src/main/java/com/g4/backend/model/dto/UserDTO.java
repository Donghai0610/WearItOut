package com.g4.backend.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private int userId;
    private String username;
    private String email;
    private String fullName;
    private String phoneNumber;
    private String address;
    private String avatar;
    private String balance;
    private boolean gender;
    private LocalDate dob;
    private boolean isActive;
}
