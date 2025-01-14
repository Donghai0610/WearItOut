package com.g4.backend.dto.response;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ServiceApiDTO {
    private int serviceID;
    private String shortName;
    private int serviceTypeID;
}
