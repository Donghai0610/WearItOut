package com.g4.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NewProductResponseDTO {
    private Long productId;
    private String productName;
    private String description;
    private Double price;
    private Integer stockQuantity;
    private String status;
    private Double rating;
    private String settingName;
    private String shopName;
    private List<String> imageUrls;
}
