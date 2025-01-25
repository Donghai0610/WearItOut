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
public class ProductCartResponseDTO {
    private Long productId;
    private String productName;
    private String description;
    private Double price;
    private Integer quantity;
    private String status;
    private Double rating;

    // DTO có thể chứa URL của hình ảnh sản phẩm thay vì object phức tạp
    private List<String> imageUrls;
    private Double totalPrice; // Giá của sản phẩm trong giỏ hàng
    // Tên của setting và shop thay vì object đầy đủ để tránh truy xuất thông tin quá nhiều
    private String settingName;
    private String shopName;
}
