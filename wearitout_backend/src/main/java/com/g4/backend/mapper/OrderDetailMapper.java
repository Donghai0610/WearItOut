package com.g4.backend.mapper;

import com.g4.backend.dto.response.OrderDetailResponseDTO;
import com.g4.backend.model.OrderDetail;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OrderDetailMapper {

    @Mapping(source = "order.orderId", target = "orderId")
    @Mapping(source = "order.totalPrice", target = "totalPrice")
    @Mapping(source = "order.paymentStatus", target = "paymentStatus")
    @Mapping(source = "order.totalQuantity", target = "totalQuantity")
    @Mapping(source = "order.shipAddress", target = "shipAddress")
    @Mapping(source = "order.user.username", target = "customerName")
    @Mapping(source = "order.user.email", target = "customerEmail")
    @Mapping(source = "order.user.phone", target = "customerPhone")
    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "product.price", target = "productPrice")
    @Mapping(source = "product.productName", target = "productName")
    OrderDetailResponseDTO orderDetailToDTO(OrderDetail orderDetail);
}
