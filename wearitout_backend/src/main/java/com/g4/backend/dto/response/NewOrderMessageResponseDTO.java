package com.g4.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.payos.type.CheckoutResponseData;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NewOrderMessageResponseDTO {
    private String code;
    private String desc;
    private String paymentUrl;
}
