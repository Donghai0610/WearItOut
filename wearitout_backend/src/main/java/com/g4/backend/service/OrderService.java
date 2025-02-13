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
import vn.payos.type.*;

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
            order.setPaymentStatus("PAID");  // Cập nhật trạng thái thanh toán thành "PAID"
            orderRepository.save(order);
        } else {
            throw new RuntimeException("Không tìm thấy đơn hàng với ID: " + orderId);
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


    @Transactional
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
                PaymentData paymentData = createPaymentDataForOrder(order, totalPaymentForWebsite, cartItems); // Lưu ý: truyền toàn bộ giỏ hàng vào
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

    private PaymentData createPaymentDataForOrder(Order order, double totalPaymentForWebsite, List<CartItem> cartItems) {
        // Tạo PaymentData với các thông tin thanh toán của đơn hàng
        PaymentData paymentData = PaymentData.builder()
                .orderCode(order.getOrderId())  // Mã đơn hàng
                .amount((int) totalPaymentForWebsite)  // Số tiền thanh toán (chuyển sang kiểu int)
                .description("WearItOut-Thanh toán cho đơn hàng " + order.getOrderId())  // Mô tả thanh toán
                .items(createItemDataForCartItems(cartItems))  // Danh sách sản phẩm trong giỏ hàng
                .cancelUrl("http://localhost:3000/checkout")  // URL khi hủy thanh toán
                .returnUrl("http://localhost:3000/order-user")  // URL khi thanh toán thành công
                .build();
        return paymentData;
    }

    private List<ItemData> createItemDataForCartItems(List<CartItem> cartItems) {
        List<ItemData> items = new ArrayList<>();
        for (CartItem cartItem : cartItems) {
            ItemData item = ItemData.builder()
                    .name(cartItem.getProduct().getProductName())  // Tên sản phẩm
                    .quantity(cartItem.getQuantity())  // Số lượng sản phẩm
                    .price(cartItem.getProduct().getPrice().intValue())  // Giá sản phẩm
                    .build();
            items.add(item);
        }
        return items;
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

    public List<OrderDetailResponseDTO> getPurchasedProductsByUser(Long userId) {
        // Lấy tất cả đơn hàng của người dùng
        List<Order> orders = orderRepository.findOrderByUserId(userId);

        // Danh sách chứa thông tin chi tiết đơn hàng
        List<OrderDetailResponseDTO> orderDetails = new ArrayList<>();

        // Lặp qua từng đơn hàng và lấy chi tiết sản phẩm
        for (Order order : orders) {
            // Lấy chi tiết của mỗi đơn hàng
            List<OrderDetail> details = orderDetailRepository.getOrderDetailsByOrder_OrderId(order.getOrderId());

            // Lấy trạng thái vận chuyển gần nhất từ OrderSetting (nếu có)
            String shippingStatus = order.getOrderSettings().stream()
                    .sorted((o1, o2) -> o2.getUpdateAt().compareTo(o1.getUpdateAt()))  // Sắp xếp theo thời gian cập nhật (mới nhất trước)
                    .map(orderSetting -> orderSetting.getSetting().getName())  // Lấy tên trạng thái từ Setting
                    .findFirst()
                    .orElse("Unknown");  // Nếu không có trạng thái, trả về "Unknown"

            // Lặp qua từng chi tiết đơn hàng và ánh xạ vào DTO
            for (OrderDetail detail : details) {
                OrderDetailResponseDTO dto = OrderDetailResponseDTO.builder()
                        .orderId(order.getOrderId())
                        .totalPrice(order.getTotalPrice())
                        .paymentStatus(order.getPaymentStatus())
                        .shippingStatus(shippingStatus)  // Đã sửa: lấy setting name thay vì status
                        .totalQuantity(order.getTotalQuantity())
                        .shipAddress(order.getShipAddress())
                        .paymentMethod(order.getPaymentMethod().name())
                        .customerName(order.getUser().getUsername())  // Giả sử bạn sử dụng `username` thay cho `fullName`
                        .customerEmail(order.getUser().getEmail())
                        .customerPhone(order.getUser().getPhone())
                        .productId(detail.getProduct().getId())  // Lấy thông tin sản phẩm
                        .productName(detail.getProduct().getProductName())
                        .productPrice(detail.getProduct().getPrice())
                        .quantity(detail.getQuantity())
                        .build();

                orderDetails.add(dto);
            }
        }

        return orderDetails;
    }


}
