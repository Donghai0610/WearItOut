package com.g4.backend.dto.request;

import com.g4.backend.dto.TransactionData;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class TransactionRequest {
    private List<TransactionData> data;
}
