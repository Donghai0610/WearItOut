package com.g4.backend.service;

import com.g4.backend.dto.response.*;
import com.g4.backend.model.*;
import com.g4.backend.model.key.KeyOrderShipping;
import com.g4.backend.repository.OrderHistoryRepository;
import com.g4.backend.repository.SettingRepository;
import com.g4.backend.repository.UserRepository;

import com.g4.backend.utils.AddressPart;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class AddressAPIService {
    private static final String URL_PROVINCE = "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province";
    private static final String URL_DISTRICT = "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district";
    private static final String URL_WARD = "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward";
    private static final String URL_SERVICE = "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services";
    private static final String URL_CREATE_ORDER = "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/create";

    private static final String CONTENT_TYPE = "application/json";
    private static final String TOKEN = "de18c0f1-8e45-11ef-8e53-0a00184fe694";
    private static final String SHOP_ID = "195082";

    private final OrderService orderService;
    private final UserRepository userRepository;
    private final OrderHistoryRepository orderHistoryRepository;
    private final SettingRepository settingRepository;

//    public Optional<Integer> getProvinceId(String name) {
//        RestTemplate restTemplate = new RestTemplate();
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.set("Content-Type", CONTENT_TYPE);
//        headers.set("Token", TOKEN);
//        HttpEntity<String> entity = new HttpEntity<>(headers);
//
//        ResponseEntity<ApiResponse> response = restTemplate.exchange(URL_PROVINCE, HttpMethod.GET, entity, ApiResponse.class);
//        Object objects = response.getBody().getResult();
//        List<ProvinceApiDTO> provinces = objects.stream()
//                .map(province -> {
//                    Map<String, Object> provinceMap = (Map<String, Object>) province;
//                    int provinceId = (int) provinceMap.get("ProvinceID");
//                    String provinceName = (String) provinceMap.get("ProvinceName");
//                    return new ProvinceApiDTO(provinceId, provinceName);
//                }).collect(Collectors.toList());
//        return provinces.stream()
//                .filter(province -> province.getProvinceName().equalsIgnoreCase(name))
//                .map(ProvinceApiDTO::getProvinceID)
//                .findFirst();
//    }

//    public Optional<Integer> getDistrictId(String name, int provinceId) {
//        RestTemplate restTemplate = new RestTemplate();
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.set("Content-Type", CONTENT_TYPE);
//        headers.set("Token", TOKEN);
//        HttpEntity<String> entity = new HttpEntity<>(headers);
//
//        ResponseEntity<ApiResponse> response = restTemplate.exchange(URL_DISTRICT + "?province_id=" + provinceId, HttpMethod.GET, entity, ApiResponse.class);
//        List<Object> objects = response.getBody().getData();
//        List<DistrictApiDTO> districts = objects.stream()
//                .map(district -> {
//                    Map<String, Object> districtMap = (Map<String, Object>) district;
//                    int districtId = (int) districtMap.get("DistrictID");
//                    String districtName = (String) districtMap.get("DistrictName");
//                    return new DistrictApiDTO(districtId, districtName);
//                }).collect(Collectors.toList());
//        return districts.stream()
//                .filter(district -> district.getDistrictName().toLowerCase().contains(name.toLowerCase()))
//                .map(DistrictApiDTO::getDistrictID)
//                .findFirst();
//    }
//
//    public Optional<String> getWardId(String name, int districtId) {
//        RestTemplate restTemplate = new RestTemplate();
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.set("Content-Type", CONTENT_TYPE);
//        headers.set("Token", TOKEN);
//        HttpEntity<String> entity = new HttpEntity<>(headers);
//
//        ResponseEntity<ApiResponse> response = restTemplate.exchange(URL_WARD + "?district_id=" + districtId, HttpMethod.GET, entity, ApiResponse.class);
//        List<Object> objects = response.getBody().getData();
//        List<WardApiDTO> wards = objects.stream()
//                .map(ward -> {
//                    Map<String, Object> districtMap = (Map<String, Object>) ward;
//                    String wardCode = (String) districtMap.get("WardCode");
//                    String wardName = (String) districtMap.get("WardName");
//                    return new WardApiDTO(wardCode, wardName);
//                }).collect(Collectors.toList());
//        return wards.stream()
//                .filter(ward -> ward.getWardName().toLowerCase().contains(name.toLowerCase()))
//                .map(WardApiDTO::getWardCode)
//                .findFirst();
//    }

//    public List<ServiceApiDTO> getService(int fromDistrictId, int toDistrictId) {
//        RestTemplate restTemplate = new RestTemplate();
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.set("Content-Type", CONTENT_TYPE);
//        headers.set("Token", TOKEN);
//        HttpEntity<String> entity = new HttpEntity<>(headers);
//
//        String urlParams = UriComponentsBuilder.fromHttpUrl(URL_SERVICE)
//                .queryParam("shop_id", 195082)
//                .queryParam("from_district", fromDistrictId)
//                .queryParam("to_district", toDistrictId)
//                .toUriString();
//
//        ResponseEntity<ApiResponse> response = restTemplate.exchange(urlParams, HttpMethod.GET, entity, ApiResponse.class);
//        List<Object> objects = response.getBody().getData();
//        List<ServiceApiDTO> services = objects.stream()
//                .map(service -> {
//                    Map<String, Object> districtMap = (Map<String, Object>) service;
//                    int serviceId = (int) districtMap.get("service_id");
//                    String shortName = (String) districtMap.get("short_name");
//                    int serviceTypeId = (int) districtMap.get("service_type_id");
//                    return new ServiceApiDTO(serviceId, shortName, serviceTypeId);
//                }).collect(Collectors.toList());
//        return services;
//    }

//    public ResponseEntity<String> sendShippingRequestToGHN(Long orderId, int service_id, int service_type_id, int payShippingFee, String note) {
//        RestTemplate restTemplate = new RestTemplate();
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.set("Content-Type", CONTENT_TYPE);
//        headers.set("ShopId", SHOP_ID);
//        headers.set("Token", TOKEN);
//
//        Order order = orderService.getOrderById(orderId);
//        String shopAddress = order.getShop().getAddress();
//        String shipAddress = order.getShipAddress();
//
//        User seller = userRepository.getShopSeller(order.getShop().getShopId());
//
//        AddressPart addressPart = new AddressPart();
//
//        String fromProvinceName = addressPart.getAddressPart(shopAddress, "province");
//        String toProvinceName = addressPart.getAddressPart(shipAddress, "province");
//
//        String fromDistrictName = addressPart.getAddressPart(shopAddress, "district");
//        String toDistrictName = addressPart.getAddressPart(shipAddress, "district");
//
//        String fromWardName = addressPart.getAddressPart(shopAddress, "ward");
//        String toWardName = addressPart.getAddressPart(shipAddress, "ward");
//
//        Optional<Integer> toProvinceId = getProvinceId(toProvinceName);
//        Optional<Integer> toDistrictId = getDistrictId(toDistrictName, toProvinceId.get());
//        Optional<String> toWardCode = getWardId(toWardName, toDistrictId.get());
//
//        Map<String, Object> requestBody = new HashMap<>();
//        requestBody.put("payment_type_id", payShippingFee);
//        requestBody.put("required_note", note);
//        requestBody.put("from_name", seller.getUsername());
//        requestBody.put("from_phone", seller.getPhone());
//        requestBody.put("from_address", shopAddress);
//        requestBody.put("from_ward_name", fromWardName);
//        requestBody.put("from_district_name", fromDistrictName);
//        requestBody.put("from_province_name", fromProvinceName);
//        requestBody.put("to_name", order.getUser().getUsername());
//        requestBody.put("to_phone", order.getUser().getPhone());
//        requestBody.put("to_address", shipAddress);
//        requestBody.put("to_ward_code", toWardCode);
//        requestBody.put("to_district_id", toDistrictId);
//        requestBody.put("weight", 500);
//        requestBody.put("length", 50);
//        requestBody.put("width", 50);
//        requestBody.put("height", 50);
//        requestBody.put("service_id", service_id);
//        requestBody.put("service_type_id", service_type_id);
//
//        // Items array with nested category object
//        List<OrderDetail> orderDetails = order.getOrderDetails();
//        List<Map<String, Object>> items = new ArrayList<>();
//        for (OrderDetail orderDetail : orderDetails) {
//            Map<String, Object> item = new HashMap<>();
//            item.put("name", orderDetail.getProduct().getProductName());
//            item.put("code", orderDetail.getProduct().getId().toString());
//            item.put("quantity", orderDetail.getQuantity());
//            item.put("price", (int) orderDetail.getProduct().getPrice().doubleValue());
//            item.put("length", 50);
//            item.put("width", 50);
//            item.put("height", 50);
//            item.put("weight", 500);
//
//            items.add(item);
//        }
//        requestBody.put("items", items);
//
//        Map<String, Object> requestBody2 = requestBody;
//        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
//        ResponseEntity<String> response = restTemplate.exchange(URL_CREATE_ORDER, HttpMethod.POST, entity, String.class);
//
//        Setting setting = settingRepository.findByName("Shipped");
//
//        // Create composite key
//        KeyOrderShipping keyOrderSetting = new KeyOrderShipping(orderId, setting.getSettingId());
//
//        // Build new OrderSetting instance
//        OrderSetting orderSetting = OrderSetting.builder()
//                .keyOrderSetting(keyOrderSetting)
//                .order(order)
//                .setting(setting)
//                .build();
//
//        // Save OrderSetting to the database
//        orderHistoryRepository.save(orderSetting);
//
//        return response;
//    }
}
