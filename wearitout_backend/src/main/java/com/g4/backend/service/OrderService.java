package com.g4.backend.service;

import com.g4.backend.dto.request.OrderRequestDTO;
import com.g4.backend.dto.response.NewOrderResponseDTO;
import com.g4.backend.dto.response.OrderDetailResponseDTO;
import com.g4.backend.dto.response.OrderResponseDTO;
import com.g4.backend.mapper.OrderMapper;
import com.g4.backend.model.*;

import com.g4.backend.model.key.KeyOrderShipping;
import com.g4.backend.repository.*;
import com.g4.backend.utils.PaymentMethod;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.payos.PayOS;
import vn.payos.type.CheckoutResponseData;
import vn.payos.type.PaymentData;
import vn.payos.type.PaymentLinkData;
import vn.payos.type.WebhookData;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Value("${PAYOS_CLIENT_ID}")
    private String clientId;
    @Value("${PAYOS_API_KEY}")
    private String apiKey;
    @Value("${PAYOS_CHECKSUM_KEY}")
    private String checksumKey;

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ShopRepositoryAdmin shopRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final OrderSettingRepository orderSettingRepository;
    private final SettingRepository settingRepository;

    @Autowired
    public OrderService(OrderRepository orderRepository, OrderMapper orderMapper, CartItemRepository cartItemRepository, ProductRepository productRepository, CartRepository cartRepository, UserRepository userRepository, ShopRepositoryAdmin shopRepository, OrderDetailRepository orderDetailRepository, OrderSettingRepository orderSettingRepository, SettingRepository settingRepository) {
        this.orderRepository = orderRepository;
        this.orderMapper = orderMapper;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.shopRepository = shopRepository;
        this.orderDetailRepository = orderDetailRepository;
        this.orderSettingRepository = orderSettingRepository;
        this.settingRepository = settingRepository;
    }

    public Page<OrderResponseDTO> getOrderByShop(long shopId, String searchKeyword, String paymentStatus, String shippingStatus, int page, int size) {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        Object principal = authentication.getPrincipal();
//
//        String username;
//        if (principal instanceof UserDetails) {
//            username = ((UserDetails) principal).getUsername();
//        } else {
//            username = principal.toString();
//        }

        Pageable pageable = PageRequest.of(page, size);
        Page<OrderResponseDTO> orders = orderRepository.getOrdersByShopAndFilter(shopId, searchKeyword, paymentStatus, shippingStatus, pageable);
        return orders;
    }

    public Page<OrderResponseDTO> getOrderByUser(String paymentStatus, String shippingStatus, int page, int size) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();

        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }

        Pageable pageable = PageRequest.of(page, size);
        Page<OrderResponseDTO> orders = orderRepository.getOrdersByUserAndFilter(username, paymentStatus, shippingStatus, pageable);
        return orders;
    }

    public void cancelOrder(long orderId) {
        Optional<Order> orderOptional = orderRepository.findById(orderId);
        if (orderOptional.isPresent()) {
            Order order = orderOptional.get();
            order.setPaymentStatus("CANCEL");
            orderRepository.save(order);
        }
    }

    public void changeStatusOrderToPaid(long orderId) {
        Optional<Order> orderOptional = orderRepository.findById(orderId);
        if (orderOptional.isPresent()) {
            Order order = orderOptional.get();
            order.setPaymentStatus("PAID");
            orderRepository.save(order);
        }
    }

    public Order getOrderById(long orderId) {
        Optional<Order> orderOptional = orderRepository.findById(orderId);
        return unwarppedOrder(orderOptional, orderId);
    }

    static Order unwarppedOrder(Optional<Order> entity, Long id) {
        if (entity.isPresent()) {
            return entity.get();
        } else {
            throw new EntityNotFoundException("Order with ID " + id + " not found");
        }
    }





















    


    public void createOrdersForCart(Long userId, String shipAddress, PaymentMethod paymentMethod) {
        // Lấy người dùng
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        // Lấy giỏ hàng của người dùng
        Cart cart = cartRepository.findByUser(user);
        if (cart == null) {
            throw new RuntimeException("Giỏ hàng không tồn tại cho người dùng: " + userId);
        }

        // Lấy tất cả sản phẩm trong giỏ hàng
        List<CartItem> cartItems = cartItemRepository.findByCart(cart);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Giỏ hàng trống cho người dùng: " + userId);
        }

        // Tính tổng tiền của giỏ hàng (toàn bộ đơn hàng ban đầu)
        double totalPaymentForWebsite = cartItems.stream()
                .mapToDouble(CartItem::getTotalPrice)
                .sum();

        // Nhóm các sản phẩm trong giỏ hàng theo shop_id
        Map<Long, List<CartItem>> groupedByShop = cartItems.stream()
                .collect(Collectors.groupingBy(cartItem -> cartItem.getProduct().getShop().getShopId()));

        List<Order> orders = new ArrayList<>();

        // Tạo đơn hàng cho từng cửa hàng
        for (Long shopId : groupedByShop.keySet()) {
            List<CartItem> itemsForShop = groupedByShop.get(shopId);
            double totalPriceForShop = itemsForShop.stream()
                    .mapToDouble(CartItem::getTotalPrice)
                    .sum();
            int totalQuantityForShop = itemsForShop.stream()
                    .mapToInt(CartItem::getQuantity)
                    .sum();

            // Tạo đơn hàng cho cửa hàng
            Order order = createOrderForShop(userId, shipAddress, paymentMethod, totalPriceForShop, totalQuantityForShop, itemsForShop, shopId);
            orders.add(order);

            // Cập nhật số lượng sản phẩm trong Product và xóa CartItem
            updateProductQuantityAndClearCartItems(itemsForShop);

            if (paymentMethod == PaymentMethod.TRANSFER_TO_SHOP_AUTOMATIC) {
                PaymentData paymentData = createPaymentDataForOrder(order, totalPaymentForWebsite);
                // Tạo Payment Link từ PayOS
                CheckoutResponseData paymentLinkResponse = createPaymentLink(paymentData);

                // Lưu thông tin thanh toán vào Order
                savePaymentLinkInfoForWebsite(order, paymentLinkResponse);
            }
        }

        // Lưu các đơn hàng cho các cửa hàng
        for (Order order : orders) {
            orderRepository.save(order);
        }
    }


    @Transactional
    protected void updateProductQuantityAndClearCartItems(List<CartItem> itemsForShop) {
        Set<Cart> cartsToDelete = new HashSet<>(); // Tập hợp các cart cần kiểm tra

        for (CartItem cartItem : itemsForShop) {
            // 🔹 Trừ số lượng sản phẩm trong Product
            Product product = cartItem.getProduct();
            int quantitySold = cartItem.getQuantity();
            product.setStockQuantity(product.getStockQuantity() - quantitySold);
            productRepository.save(product);

            // 🔹 Lưu lại Cart để kiểm tra sau khi xóa
            Cart cart = cartItem.getCart();
            cartsToDelete.add(cart);

            System.out.println("Xóa CartItem có ID: " + cartItem.getCartItemId());
            cartItemRepository.delete(cartItem); // Xóa CartItem
            cartItemRepository.flush(); // Đảm bảo dữ liệu được xóa ngay lập tức
        }

        for (Cart cart : cartsToDelete) {
            long remainingItems = cartItemRepository.countByCart(cart); // Đếm số CartItem còn lại
            System.out.println("Cart ID: " + cart.getCartId() + " còn lại " + remainingItems + " sản phẩm.");
            if (remainingItems == 0) {
                cartRepository.delete(cart); // 🔥 Chỉ xóa Cart nếu không còn CartItem
                System.out.println("Cart ID: " + cart.getCartId() + " đã bị xóa.");
            } else {
                System.out.println("Cart ID: " + cart.getCartId() + " vẫn còn sản phẩm, không xóa.");
            }
        }
    }

    private Order createOrderForShop(Long userId, String shipAddress, PaymentMethod paymentMethod, double totalPriceForShop, int totalQuantityForShop, List<CartItem> itemsForShop, Long shopId) {
        // Lấy người dùng và cửa hàng
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
        Shop shop = shopRepository.findById(shopId).orElseThrow(() -> new RuntimeException("Cửa hàng không tồn tại"));

        // Tạo đơn hàng cho cửa hàng
        Order order = new Order();
        order.setUser(user);
        order.setShop(shop);
        order.setShipAddress(shipAddress);
        order.setPaymentMethod(paymentMethod);
        order.setTotalPrice(totalPriceForShop);
        order.setTotalQuantity(totalQuantityForShop);  // Cập nhật số lượng tổng cho đơn hàng
        order.setPaymentStatus("UNPAID");  // Đặt payment_status là UNPAID khi tạo đơn hàng
        order = orderRepository.save(order);

        // 2. Tạo OrderSetting với trạng thái "Processed"
        OrderSetting orderSetting = new OrderSetting();
        Setting setting = settingRepository.findById(16)
                .orElseThrow(() -> new RuntimeException("Setting không tồn tại"));

        // 3. Sau khi lưu Order, orderId đã được gán -> Bây giờ set key cho OrderSetting
        orderSetting.setOrder(order);
        orderSetting.setSetting(setting);
        orderSetting.setKeyOrderSetting(new KeyOrderShipping(order.getOrderId(), setting.getSettingId())); // Đảm bảo orderId không null

        // 4. Thêm OrderSetting vào danh sách và lưu vào database
        orderSettingRepository.save(orderSetting);

        // Khởi tạo danh sách orderDetails nếu chưa được khởi tạo
        if (order.getOrderDetails() == null) {
            order.setOrderDetails(new ArrayList<>());
        }

        // Tạo chi tiết đơn hàng cho các sản phẩm của cửa hàng
        for (CartItem cartItem : itemsForShop) {
            Product product = cartItem.getProduct();
            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setOrder(order);
            orderDetail.setProduct(product);
            orderDetail.setQuantity(cartItem.getQuantity());

            // Thêm OrderDetail vào danh sách
            order.getOrderDetails().add(orderDetail);
        }

        return order;
    }

    private PaymentData createPaymentDataForOrder(Order order, double totalPaymentForWebsite) {
        // Tạo PaymentData với thông tin đơn hàng
        return PaymentData.builder()
                .orderCode(order.getOrderId())
                .amount((int) totalPaymentForWebsite)  // Sử dụng totalPaymentForWebsite làm số tiền thanh toán cho website
                .description("Thanh toán cho đơn hàng")
                .build();
    }


    private void savePaymentLinkInfoForWebsite(Order order, CheckoutResponseData paymentLinkResponse) {
        order.setPaymentLinkUrl(paymentLinkResponse.getCheckoutUrl());
        orderRepository.save(order);
    }

    private CheckoutResponseData createPaymentLink(PaymentData paymentData) {
        try {
            PayOS payOS = new PayOS(clientId, apiKey, checksumKey);
            return payOS.createPaymentLink(paymentData);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }


}
