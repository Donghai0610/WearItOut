package com.g4.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NewProductRequestDTO {
    private String productName;
    private String description;
    private Double price;
    private Integer stockQuantity;
    private String status;
    private Double rating;
    private String settingName; // Thay đổi từ settingId sang settingName
    private String shopName;
    private List<MultipartFile> imageFiles;
}
