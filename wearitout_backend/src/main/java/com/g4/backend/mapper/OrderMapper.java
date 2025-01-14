package com.g4.backend.mapper;

import com.g4.backend.dto.response.OrderResponseDTO;
import com.g4.backend.model.Order;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OrderMapper {

    @Mapping(source = "user.username", target = "customerName")
    @Mapping(source = "user.email", target = "customerEmail")
    @Mapping(source = "user.phone", target = "customerPhone")
    OrderResponseDTO orderToOrderResponseDTO(Order order);
}
