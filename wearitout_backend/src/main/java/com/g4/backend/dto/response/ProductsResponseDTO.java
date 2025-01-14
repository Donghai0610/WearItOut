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
public class ProductsResponseDTO {
    private Long id;
    private String productName;
    private String description;
    private Double price;
    private Integer stockQuantity;
    private String status;
    private Double rating;

    // DTO có thể chứa URL của hình ảnh sản phẩm thay vì object phức tạp
    private List<String> imageUrls;

    // Tên của setting và shop thay vì object đầy đủ để tránh truy xuất thông tin quá nhiều
    private String settingName;
    private String shopName;
}
