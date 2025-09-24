package com.g4.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductImportMessage {
     private String importId;
    private String userId;
    private List<NewProductRequestDTO> products;
    private String fileName;
    private LocalDateTime timestamp;
}
