package com.g4.backend.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TokenExchangeParamRequestDTO {
    String grant_type;
    String client_id;
    String client_secret;
    String scope;
}
