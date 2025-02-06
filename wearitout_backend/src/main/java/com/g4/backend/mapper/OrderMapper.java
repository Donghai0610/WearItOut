package com.g4.backend.mapper;

import com.g4.backend.dto.request.OrderRequestDTO;
import com.g4.backend.dto.response.OrderResponseDTO;
import com.g4.backend.model.CartItem;
import com.g4.backend.model.Order;
import com.g4.backend.model.OrderDetail;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface OrderMapper {


    @Mapping(source = "user.username", target = "customerName")
    @Mapping(source = "user.email", target = "customerEmail")
    @Mapping(source = "user.phone", target = "customerPhone")
    OrderResponseDTO orderToOrderResponseDTO(Order order);

    @Mapping(source = "orderRequestDTO.shipAddress", target = "shipAddress")
    @Mapping(source = "orderRequestDTO.paymentStatus", target = "paymentStatus")
    @Mapping(target = "totalPrice", expression = "java(cartItems.stream().mapToDouble(CartItem::getTotalPrice).sum())")
    @Mapping(target = "totalQuantity", expression = "java(cartItems.stream().mapToInt(CartItem::getQuantity).sum())")
    Order mapToOrder(OrderRequestDTO orderRequestDTO, List<CartItem> cartItems);

    // Ánh xạ từ CartItem sang OrderDetail
    @Mappings({
            @Mapping(source = "cartItem.quantity", target = "quantity"),
            @Mapping(source = "cartItem.product", target = "product")
    })
    OrderDetail mapToOrderDetail(CartItem cartItem);

    // Hàm chuyển danh sách CartItem thành danh sách OrderDetail
    default List<OrderDetail> mapToOrderDetails(List<CartItem> cartItems) {
        return cartItems.stream()
                .map(this::mapToOrderDetail)
                .collect(Collectors.toList());
    }

}
