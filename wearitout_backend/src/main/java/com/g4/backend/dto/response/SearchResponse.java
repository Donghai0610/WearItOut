package com.g4.backend.dto.response;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public  class SearchResponse<T> {
    private List<T> content;
    private int totalPages;
}
