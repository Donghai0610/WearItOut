package com.g4.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
@Data@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ImportResultMessage {
    private String importId;
    private String userId;
    private String fileName;
    private int totalProducts;
    private int successCount;
    private int errorCount;
    private List<String> errors;
    private LocalDateTime completedAt;
    private String status; // SUCCESS, FAILED, PARTIAL_SUCCESS
}
