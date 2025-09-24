package com.g4.backend.controller;

import com.g4.backend.dto.response.*;
import com.g4.backend.model.Order;
import com.g4.backend.service.AddressAPIService;
import com.g4.backend.service.OrderService;
import com.g4.backend.utils.AddressPart;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/shop_staff/order")
public class OrderController {
    private final OrderService orderService;
    private final AddressAPIService addressAPIService;

    @GetMapping("/list")
    public ResponseEntity<?> getOrdersByShopAndFilter(
            @RequestParam(value = "shopId") Long shopId,
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "paymentStatus", required = false) String paymentStatus,
            @RequestParam(value = "shippingStatus", required = false) String shippingStatus,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        Page<OrderResponseDTO> ordersPage = orderService.getOrderByShop(shopId, search, paymentStatus, shippingStatus, page, size);
        List<OrderResponseDTO> orders = ordersPage.getContent();
        return ResponseEntity.ok(new OrderResponse(orders, ordersPage.getTotalPages()));
    }

//    @GetMapping("/provinces/{provinceName}")
//    public int getProvinces(@PathVariable String provinceName) {
//        Optional<Integer> provinceId = addressAPIService.getProvinceId(provinceName);
//        if (provinceId.isPresent()) {
//            return provinceId.get();
//        }
//        return 0;
//    }

//    @GetMapping("/districts/{districtName}")
//    public int getDistrictID(@PathVariable String districtName) {
//        Optional<Integer> districtId = addressAPIService.getDistrictId(districtName, 201);
//        if (districtId.isPresent()) {
//            return districtId.get();
//        }
//        return 0;
//    }
//
//    @GetMapping("/wards/{wardName}")
//    public String getWardCode(@PathVariable String wardName) {
//        Optional<String> wardCode = addressAPIService.getWardId(wardName, 1805);
//        if (wardCode.isPresent()) {
//            return wardCode.get();
//        }
//        return "NOT FOUND!";
//    }
//
//    @GetMapping("/{orderId}/services")
//    public List<ServiceApiDTO> getServices(@PathVariable Long orderId) {
//        Order order = orderService.getOrderById(orderId);
//        String shopAddress = order.getShop().getAddress();
//        String shipAddress = order.getShipAddress();
//
//        AddressPart addressPart = new AddressPart();
//
//        String fromProvinceName = addressPart.getAddressPart(shopAddress, "province");
//        String toProvinceName = addressPart.getAddressPart(shipAddress, "province");
//
//        String fromDistrictName = addressPart.getAddressPart(shopAddress, "district");
//        String toDistrictName = addressPart.getAddressPart(shipAddress, "district");
//
//        Optional<Integer> fromProvinceId = addressAPIService.getProvinceId(fromProvinceName);
//        Optional<Integer> toProvinceId = addressAPIService.getProvinceId(toProvinceName);
//
//        Optional<Integer> fromDistrictId = addressAPIService.getDistrictId(fromDistrictName, fromProvinceId.get());
//        Optional<Integer> toDistrictId = addressAPIService.getDistrictId(toDistrictName, toProvinceId.get());
//
//        List<ServiceApiDTO> services = addressAPIService.getService(fromDistrictId.get(), toDistrictId.get());
//        return services;
//    }
//
//    @GetMapping("/{orderId}/create_order")
//    public ResponseEntity<String> sendShippingOrderToGHN(@PathVariable Long orderId,
//                                                         @RequestParam(value = "serviceId") int serviceId,
//                                                         @RequestParam(value = "serviceTypeId") int service_type_id,
//                                                         @RequestParam(value = "paymentTypeId") int payShippingFee,
//                                                         @RequestParam(value = "note") String note) {
//        ResponseEntity<String> response = addressAPIService.sendShippingRequestToGHN(orderId, serviceId, service_type_id, payShippingFee, note);
//        return response;
//    }

}
