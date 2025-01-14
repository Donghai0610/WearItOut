package com.g4.backend.model.key;

import jakarta.persistence.Embeddable;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@ToString
@Data
@EqualsAndHashCode
@Embeddable
@Builder
public class KeyOrderShipping  implements java.io.Serializable{
    private Long orderId;
    private int settingId;
}
