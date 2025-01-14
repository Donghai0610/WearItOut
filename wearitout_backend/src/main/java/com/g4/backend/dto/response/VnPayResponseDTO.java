package com.g4.backend.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
public class VnPayResponseDTO implements Serializable {
    private String status;
    private String message;
    private String url;
}
