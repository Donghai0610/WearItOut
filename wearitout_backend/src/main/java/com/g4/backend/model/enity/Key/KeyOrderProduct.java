package com.g4.backend.model.enity.Key;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@ToString
@Data
@EqualsAndHashCode
@Embeddable
@Builder
public class KeyOrderProduct implements Serializable {
    private Integer orderId;
    private Integer productId;
}
