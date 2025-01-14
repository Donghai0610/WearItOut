package com.t3.mapper;

import com.t3.dto.response.OrderResponseDTO;
import com.t3.dto.response.OrderResponseDTO.OrderResponseDTOBuilder;
import com.t3.model.Order;
import com.t3.model.User;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-10-28T13:09:02+0700",
    comments = "version: 1.4.2.Final, compiler: javac, environment: Java 17.0.10 (Oracle Corporation)"
)
@Component
public class OrderMapperImpl implements OrderMapper {

    @Override
    public OrderResponseDTO orderToOrderResponseDTO(Order order) {
        if ( order == null ) {
            return null;
        }

        OrderResponseDTOBuilder orderResponseDTO = OrderResponseDTO.builder();

        orderResponseDTO.customerName( orderUserUsername( order ) );
        orderResponseDTO.customerEmail( orderUserEmail( order ) );
        orderResponseDTO.customerPhone( orderUserPhone( order ) );
        orderResponseDTO.orderId( order.getOrderId() );
        orderResponseDTO.totalPrice( order.getTotalPrice() );
        orderResponseDTO.paymentStatus( order.getPaymentStatus() );
        orderResponseDTO.totalQuantity( order.getTotalQuantity() );
        orderResponseDTO.createAt( order.getCreateAt() );
        orderResponseDTO.shipAddress( order.getShipAddress() );

        return orderResponseDTO.build();
    }

    private String orderUserUsername(Order order) {
        if ( order == null ) {
            return null;
        }
        User user = order.getUser();
        if ( user == null ) {
            return null;
        }
        String username = user.getUsername();
        if ( username == null ) {
            return null;
        }
        return username;
    }

    private String orderUserEmail(Order order) {
        if ( order == null ) {
            return null;
        }
        User user = order.getUser();
        if ( user == null ) {
            return null;
        }
        String email = user.getEmail();
        if ( email == null ) {
            return null;
        }
        return email;
    }

    private String orderUserPhone(Order order) {
        if ( order == null ) {
            return null;
        }
        User user = order.getUser();
        if ( user == null ) {
            return null;
        }
        String phone = user.getPhone();
        if ( phone == null ) {
            return null;
        }
        return phone;
    }
}
