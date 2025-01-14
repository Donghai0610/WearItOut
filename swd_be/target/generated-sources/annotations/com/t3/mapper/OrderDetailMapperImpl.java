package com.t3.mapper;

import com.t3.dto.response.OrderDetailResponseDTO;
import com.t3.dto.response.OrderDetailResponseDTO.OrderDetailResponseDTOBuilder;
import com.t3.model.Order;
import com.t3.model.OrderDetail;
import com.t3.model.Product;
import com.t3.model.User;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-10-28T13:09:02+0700",
    comments = "version: 1.4.2.Final, compiler: javac, environment: Java 17.0.10 (Oracle Corporation)"
)
@Component
public class OrderDetailMapperImpl implements OrderDetailMapper {

    @Override
    public OrderDetailResponseDTO orderDetailToDTO(OrderDetail orderDetail) {
        if ( orderDetail == null ) {
            return null;
        }

        OrderDetailResponseDTOBuilder orderDetailResponseDTO = OrderDetailResponseDTO.builder();

        Long orderId = orderDetailOrderOrderId( orderDetail );
        if ( orderId != null ) {
            orderDetailResponseDTO.orderId( orderId );
        }
        orderDetailResponseDTO.totalPrice( orderDetailOrderTotalPrice( orderDetail ) );
        orderDetailResponseDTO.paymentStatus( orderDetailOrderPaymentStatus( orderDetail ) );
        orderDetailResponseDTO.totalQuantity( orderDetailOrderTotalQuantity( orderDetail ) );
        orderDetailResponseDTO.shipAddress( orderDetailOrderShipAddress( orderDetail ) );
        orderDetailResponseDTO.customerName( orderDetailOrderUserUsername( orderDetail ) );
        orderDetailResponseDTO.customerEmail( orderDetailOrderUserEmail( orderDetail ) );
        orderDetailResponseDTO.customerPhone( orderDetailOrderUserPhone( orderDetail ) );
        Long id = orderDetailProductId( orderDetail );
        if ( id != null ) {
            orderDetailResponseDTO.productId( id );
        }
        orderDetailResponseDTO.productPrice( orderDetailProductPrice( orderDetail ) );
        orderDetailResponseDTO.productName( orderDetailProductProductName( orderDetail ) );
        orderDetailResponseDTO.quantity( orderDetail.getQuantity() );

        return orderDetailResponseDTO.build();
    }

    private Long orderDetailOrderOrderId(OrderDetail orderDetail) {
        if ( orderDetail == null ) {
            return null;
        }
        Order order = orderDetail.getOrder();
        if ( order == null ) {
            return null;
        }
        Long orderId = order.getOrderId();
        if ( orderId == null ) {
            return null;
        }
        return orderId;
    }

    private Double orderDetailOrderTotalPrice(OrderDetail orderDetail) {
        if ( orderDetail == null ) {
            return null;
        }
        Order order = orderDetail.getOrder();
        if ( order == null ) {
            return null;
        }
        Double totalPrice = order.getTotalPrice();
        if ( totalPrice == null ) {
            return null;
        }
        return totalPrice;
    }

    private String orderDetailOrderPaymentStatus(OrderDetail orderDetail) {
        if ( orderDetail == null ) {
            return null;
        }
        Order order = orderDetail.getOrder();
        if ( order == null ) {
            return null;
        }
        String paymentStatus = order.getPaymentStatus();
        if ( paymentStatus == null ) {
            return null;
        }
        return paymentStatus;
    }

    private Integer orderDetailOrderTotalQuantity(OrderDetail orderDetail) {
        if ( orderDetail == null ) {
            return null;
        }
        Order order = orderDetail.getOrder();
        if ( order == null ) {
            return null;
        }
        Integer totalQuantity = order.getTotalQuantity();
        if ( totalQuantity == null ) {
            return null;
        }
        return totalQuantity;
    }

    private String orderDetailOrderShipAddress(OrderDetail orderDetail) {
        if ( orderDetail == null ) {
            return null;
        }
        Order order = orderDetail.getOrder();
        if ( order == null ) {
            return null;
        }
        String shipAddress = order.getShipAddress();
        if ( shipAddress == null ) {
            return null;
        }
        return shipAddress;
    }

    private String orderDetailOrderUserUsername(OrderDetail orderDetail) {
        if ( orderDetail == null ) {
            return null;
        }
        Order order = orderDetail.getOrder();
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

    private String orderDetailOrderUserEmail(OrderDetail orderDetail) {
        if ( orderDetail == null ) {
            return null;
        }
        Order order = orderDetail.getOrder();
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

    private String orderDetailOrderUserPhone(OrderDetail orderDetail) {
        if ( orderDetail == null ) {
            return null;
        }
        Order order = orderDetail.getOrder();
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

    private Long orderDetailProductId(OrderDetail orderDetail) {
        if ( orderDetail == null ) {
            return null;
        }
        Product product = orderDetail.getProduct();
        if ( product == null ) {
            return null;
        }
        Long id = product.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private Double orderDetailProductPrice(OrderDetail orderDetail) {
        if ( orderDetail == null ) {
            return null;
        }
        Product product = orderDetail.getProduct();
        if ( product == null ) {
            return null;
        }
        Double price = product.getPrice();
        if ( price == null ) {
            return null;
        }
        return price;
    }

    private String orderDetailProductProductName(OrderDetail orderDetail) {
        if ( orderDetail == null ) {
            return null;
        }
        Product product = orderDetail.getProduct();
        if ( product == null ) {
            return null;
        }
        String productName = product.getProductName();
        if ( productName == null ) {
            return null;
        }
        return productName;
    }
}
