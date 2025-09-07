package com.g4.backend.dto.response;

import com.g4.backend.dto.request.KeyCloakCredentialRequestDTO;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreationParamResponseDTO {
    String username;
    boolean enabled;
    String email;
    boolean emailVerified;
    String firstName;
    String lastName;
    List<KeyCloakCredentialRequestDTO> credentials;
}
