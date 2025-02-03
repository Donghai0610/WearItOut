package com.g4.backend.service;

import com.g4.backend.dto.ShopDetailDTO;
import com.g4.backend.dto.request.NewShopRequestDTO;
import com.g4.backend.dto.response.OrderResponseDTO;
import com.g4.backend.dto.response.ResponseDTO;
import com.g4.backend.dto.response.ShopsResponseDTO;
import com.g4.backend.mapper.ShopMapper;
import com.g4.backend.model.*;
import com.g4.backend.model.key.KeyOrderShipping;
import com.g4.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ShopService {
    private final ShopMapper shopMapper;
    private final OrderRepository orderRepository;
    private final ShopRepositoryAdmin shopRepository;
    private final SettingRepository settingRepository;
    private final OrderSettingRepository orderSettingRepository;

    @Autowired
    public ShopService(ShopMapper shopMapper, UserRepository userRepository, ShopRepositoryAdmin shopRepository, SettingRepository settingRepository, OrderRepository orderRepository, OrderSettingRepository orderSettingRepository) {
        this.shopMapper = shopMapper;
        this.shopRepository = shopRepository;
        this.settingRepository = settingRepository;
        this.orderRepository = orderRepository;
        this.orderSettingRepository = orderSettingRepository;
    }

    public Page<ShopsResponseDTO> searchShops(String keyword, String category, String isActive, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Boolean isActiveBool = (isActive != null) ? Boolean.parseBoolean(isActive) : null;
        Page<Shop> shops = shopRepository.searchByAllFields(keyword, category, isActiveBool, pageable);
        return shops.map(shop -> {
            ShopsResponseDTO responseDTO = shopMapper.shopToShopsResponseDto(shop);
            responseDTO.setSettingName(shop.getSetting().getName());
            responseDTO.setShopName(shop.getName());
            List<User> users = shop.getUsers();
            StringBuilder emails = new StringBuilder();
            for (User user : users) {
                if (emails.length() > 0) {
                    emails.append(", ");
                }
                emails.append(user.getEmail());
            }
            responseDTO.setEmail(emails.toString());
            responseDTO.setShopAddress(shop.getAddress());
            responseDTO.setRating(shop.getRating());
            Boolean status = shop.getStatus();
            responseDTO.setIsActive((status != null && status) ? "1" : "0");
            return responseDTO;

        });
    }

    public ShopDetailDTO viewShopDetail(Long shopId) {
        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + shopId));
        ShopDetailDTO shopDetailDTO = shopMapper.shopToShopDetailDTO(shop);
        shopDetailDTO.setSettingId(shop.getSetting().getSettingId());
        shopDetailDTO.setSettingName(shop.getSetting().getName());
        shopDetailDTO.setShopName(shop.getName());
        shopDetailDTO.setValue(shop.getSetting().getValue());
        List<User> users = shop.getUsers();
        StringBuilder emails = new StringBuilder();
        for (User user : users) {
            if (emails.length() > 0) {
                emails.append(", ");
            }
            emails.append(user.getEmail());
        }
        shopDetailDTO.setEmail(emails.toString());
        shopDetailDTO.setShopAddress(shop.getAddress());
        shopDetailDTO.setRating(shop.getRating());
        shopDetailDTO.setBankAccount(shop.getBankAccount());
        shopDetailDTO.setBin(shop.getBankName());
        StringBuilder names = new StringBuilder();
        for (User user : users) {
            if (names.length() > 0) {
                names.append(", ");
            }
            names.append(user.getUsername());
        }
        shopDetailDTO.setOwnerName(names.toString());
        Boolean status = shop.getStatus();
        shopDetailDTO.setIsActive((status != null && status) ? "1" : "0");
        shopDetailDTO.setShopName(shop.getName());
        return shopDetailDTO;
    }

    public ResponseDTO updateShopDetail(Long shopId, ShopDetailDTO shopDetailDTO){
        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new IllegalArgumentException("Shop not found with ID: " + shopId));

        shop.setName(shopDetailDTO.getShopName());
        shop.setAddress(shopDetailDTO.getShopAddress());
        shop.setRating(shopDetailDTO.getRating());
        shop.setStatus("true".equals(shopDetailDTO.getIsActive()));
        // Fetch the new Setting entity and set it to the shop
        Setting newSetting = settingRepository.findById(shopDetailDTO.getSettingId())
                .orElseThrow(() -> new IllegalArgumentException("Setting not found with ID: " + shopDetailDTO.getSettingId()));
        shop.setSetting(newSetting);

        shop = shopRepository.save(shop);

        ResponseDTO responseDTO = new ResponseDTO();
        responseDTO.setMessage("Shop details updated successfully");

        return responseDTO;
    }

    public ResponseDTO addNewShop(NewShopRequestDTO newShopRequestDTO) {
        Shop shop = new Shop();
        shop.setName(newShopRequestDTO.getShopName());
        shop.setAddress(newShopRequestDTO.getShopAddress());
        shop.setRating(newShopRequestDTO.getRating());
        shop.setStatus("true".equals(newShopRequestDTO.getIsActive()));
        Setting setting = settingRepository.findById(newShopRequestDTO.getSettingId())
                .orElseThrow(() -> new IllegalArgumentException("Setting not found with ID: " + newShopRequestDTO.getSettingId()));
        shop.setSetting(setting);
        shop = shopRepository.save(shop);
        shopRepository.insertUserShop(shop.getShopId(), newShopRequestDTO.getUserId());
        ResponseDTO responseDTO = new ResponseDTO();
        responseDTO.setMessage("New Shop added successfully");

        return responseDTO;
    }

    public Page<ShopsResponseDTO> searchShopsByUser(String keyword, String category, String isActive, int page, int size, Long userId) {
        Pageable pageable = PageRequest.of(page, size);
        Boolean isActiveBool = (isActive != null) ? Boolean.parseBoolean(isActive) : null;
        Page<Shop> shops = shopRepository.searchByAllFieldsAndUser(keyword, category, isActiveBool, userId, pageable);

        return shops.map(shop -> {
            ShopsResponseDTO responseDTO = shopMapper.shopToShopsResponseDto(shop);
            responseDTO.setSettingName(shop.getSetting().getName());
            responseDTO.setShopName(shop.getName());
            List<User> users = shop.getUsers();
            StringBuilder emails = new StringBuilder();
            for (User user : users) {
                if (emails.length() > 0) {
                    emails.append(", ");
                }
                emails.append(user.getEmail());
            }
            responseDTO.setEmail(emails.toString());
            responseDTO.setShopAddress(shop.getAddress());
            responseDTO.setRating(shop.getRating());
            Boolean status = shop.getStatus();
            responseDTO.setIsActive((status != null && status) ? "1" : "0");
            return responseDTO;
    });
}

public ResponseDTO processBills(Long shopId, Long tax){
// Step 1: Check if bill_count is 0
    long billCount = shopRepository.countBillsForShop(shopId);


    if (billCount == 0) {
        // Step 2: Select all records from order joined with order_setting
        LocalDate startDate = LocalDate.now().minusMonths(1).withDayOfMonth(1);
        LocalDate endDate = LocalDate.now().withDayOfMonth(1);

        List<Order> paidOrders = shopRepository.findPaidOrdersForLastMonth(shopId, startDate, endDate);
        System.out.println("Number of paid orders found: " + paidOrders.size());
        paidOrders.forEach(order -> {
            System.out.println("Order ID: " + order.getOrderId());
            System.out.println("Total Price: " + order.getTotalPrice());
            System.out.println("Payment Status: " + order.getPaymentStatus());
            System.out.println("Created At: " + order.getCreateAt());
            System.out.println("--------------------");
        });

        // Step 3: Calculate total amount based on total_price after tax (10%)
        double totalAmount = paidOrders.stream()
                .mapToDouble(order -> {
                    double originalPrice = Math.round(order.getTotalPrice() * 100.0) / 100.0;
                    double taxAmount = Math.round((originalPrice * tax) / 100 * 100.0) / 100.0;
                    double afterTaxPrice = Math.round((originalPrice - taxAmount) * 100.0) / 100.0;
                    return afterTaxPrice;
                })
                .sum();

        totalAmount = Math.round(totalAmount * 100.0) / 100.0;

        // Step 4: Insert a new record into the order table
        Order newOrder = new Order();
        newOrder.setTotalPrice(totalAmount);

        Shop shop = new Shop();
        
        shop.setShopId(shopId);
        newOrder.setShop(shop);
        // Initialize the User object and set the userId
        User user = new User();
        user.setUserId(1L); // Assuming the admin user ID is 1
        newOrder.setUser(user); // Set the User instance

        newOrder.setPaymentStatus("UNPAID");
        Order savedOrder = orderRepository.save(newOrder);

        Setting setting = new Setting();
        setting.setSettingId(20);
        // Step 5: Insert a new record into the order_setting table
        OrderSetting newOrderSetting = new OrderSetting();
        KeyOrderShipping key = new KeyOrderShipping(savedOrder.getOrderId(), setting.getSettingId());
        newOrderSetting.setKeyOrderSetting(key);
        newOrderSetting.setOrder(savedOrder);
        newOrderSetting.setSetting(setting);
        orderSettingRepository.save(newOrderSetting);

        ResponseDTO order = new ResponseDTO();
        order.setCode(200);
        order.setMessage("Order processed successfully");
        order.setData(savedOrder);
        return order;
    }
    // If billCount is 1, fetch and return the saved order
        Order existingBill = new Order();
        existingBill = shopRepository.findSingleBillForShop(shopId);
        ResponseDTO responseDTO = new ResponseDTO();
        responseDTO.setCode(200);
        responseDTO.setMessage("Order processed successfully");
        responseDTO.setData(existingBill);
        return responseDTO;
    }

    public Order updateOrderStatusToPaid(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

        order.setPaymentStatus("PAID");
        return orderRepository.save(order);
    }

    public Long getShopIdByUserId(Long userId) {
        List<Shop> shops = shopRepository.findShopsByUserId(userId);

        if (shops.size() != 1) {
            throw new IllegalStateException("User must have exactly one shop");
        }

        return shops.get(0).getShopId(); // Trả về shopId
    }
}