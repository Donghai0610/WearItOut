package com.g4.backend.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
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
    @Min(0) @Max(5)
    private Double rating = 0.0;
    private String settingName; // Thay đổi từ settingId sang settingName
    private String shopName;
    private List<MultipartFile> imageFiles;
}
