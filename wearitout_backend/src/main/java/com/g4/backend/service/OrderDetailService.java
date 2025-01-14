package com.g4.backend.service;

import com.g4.backend.dto.response.OrderDetailResponseDTO;
import com.g4.backend.dto.response.OrderShippingStatusDTO;
import com.g4.backend.mapper.OrderDetailMapper;
import com.g4.backend.model.OrderDetail;
import com.g4.backend.repository.OrderDetailRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class OrderDetailService {
    private final OrderDetailRepository orderDetailRepository;
    private final OrderDetailMapper orderDetailMapper;

    public List<OrderDetailResponseDTO> getOrderDetailByOrderId(long orderId) {
        List<OrderDetail> orderDetails = orderDetailRepository.getOrderDetailsByOrder_OrderId(orderId);
        return orderDetails.stream()
                .map(orderDetailMapper::orderDetailToDTO)
                .collect(Collectors.toList());
    }

    public List<OrderShippingStatusDTO> getOrderShippingStatus(long orderId) {
        List<Object[]> orderShippingStatus = orderDetailRepository.getOrderShippingStatus(orderId);
        return orderShippingStatus.stream()
                .map(order -> new OrderShippingStatusDTO((String) order[0], (LocalDateTime) order[1]))
                .collect(Collectors.toList());
    }
}
