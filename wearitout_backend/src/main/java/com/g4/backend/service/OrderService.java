package com.g4.backend.service;

import com.g4.backend.dto.request.OrderRequestDTO;
import com.g4.backend.dto.response.NewOrderMessageResponseDTO;
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
import net.minidev.json.JSONObject;
import org.apache.commons.codec.digest.HmacUtils;
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
    private final EmailServices emailServices;

    @Autowired
    public OrderService(OrderRepository orderRepository, OrderMapper orderMapper, CartItemRepository cartItemRepository, ProductRepository productRepository, CartRepository cartRepository, UserRepository userRepository, ShopRepositoryAdmin shopRepository, OrderDetailRepository orderDetailRepository, OrderSettingRepository orderSettingRepository, SettingRepository settingRepository,
                        EmailServices emailServices) {
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
        this.emailServices = emailServices;
    }

    public Page<OrderResponseDTO> getOrderByShop(long shopId, String searchKeyword, String paymentStatus, String shippingStatus, int page, int size) {


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

    @Transactional
    public void changeStatusOrderToPaid(long orderId) {
        // Lấy đơn hàng dựa trên orderId
        Optional<Order> orderOptional = orderRepository.findById(orderId);
        if (orderOptional.isPresent()) {
            Order order = orderOptional.get();

            // Lấy cartId từ đơn hàng
            Long cartId = order.getCartId();

            // Truy vấn tất cả các đơn hàng với cùng cartId
            List<Order> orders = orderRepository.findByCartIdAndPaymentStatusOrderByCreateAtDesc(cartId, "UNPAID");

            // Cập nhật trạng thái thanh toán của tất cả các đơn hàng có cùng cartId thành "PAID"
            for (Order o : orders) {
                o.setPaymentStatus("PAID");
                orderRepository.save(o); // Lưu lại đơn hàng đã cập nhật
            }
            Thread thread = new Thread(() -> {
                sendOrderPaidEmail(order.getUser().getUsername(), order.getUser().getEmail());
            });
            thread.start();

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
    public NewOrderMessageResponseDTO createOrdersForCart(Long userId, String shipAddress, PaymentMethod paymentMethod) {
        try {
            // Lấy thông tin người dùng
            User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

            // Lấy giỏ hàng của người dùng
            Cart cart = cartRepository.findByUser(user);
            if (cart == null) {
                throw new RuntimeException("Giỏ hàng không tồn tại cho người dùng: " + userId);
            }

            List<CartItem> cartItems = cartItemRepository.findByCart(cart);
            if (cartItems.isEmpty()) {
                throw new RuntimeException("Giỏ hàng trống cho người dùng: " + userId);
            }

            double totalPaymentForWebsite = cartItems.stream()
                    .mapToDouble(CartItem::getTotalPrice)
                    .sum();

            Map<Long, List<CartItem>> groupedByShop = cartItems.stream()
                    .collect(Collectors.groupingBy(cartItem -> cartItem.getProduct().getShop().getShopId()));

            List<Order> orders = new ArrayList<>();
            Long cartId = cart.getCartId();  // Lưu cartId để truy vấn sau này

            for (Long shopId : groupedByShop.keySet()) {
                List<CartItem> itemsForShop = groupedByShop.get(shopId);
                double totalPriceForShop = itemsForShop.stream()
                        .mapToDouble(CartItem::getTotalPrice)
                        .sum();
                int totalQuantityForShop = itemsForShop.stream()
                        .mapToInt(CartItem::getQuantity)
                        .sum();

                Order order = createOrderForShop(userId, shipAddress, paymentMethod, totalPriceForShop, totalQuantityForShop, itemsForShop, shopId, cartId);
                orders.add(order);

                // Cập nhật số lượng sản phẩm và xóa các item trong giỏ hàng
                updateProductQuantityAndClearCartItems(itemsForShop);

                // Tạo link thanh toán nếu phương thức thanh toán là TRANSFER_TO_SHOP_AUTOMATIC
                if (paymentMethod == PaymentMethod.TRANSFER_TO_SHOP_AUTOMATIC) {
                    PaymentData paymentData = createPaymentDataForOrder(order, totalPaymentForWebsite, cartItems);
                    CheckoutResponseData paymentLinkResponse = createPaymentLink(paymentData);
                    if (paymentLinkResponse != null) {
                        System.out.println("Payment Link: " + paymentLinkResponse.getCheckoutUrl());
                    } else {
                        System.out.println("Error: Payment link response is null");
                    }
                    savePaymentLinkInfoForWebsite(order, paymentLinkResponse);
                }
            }

            // Lưu các đơn hàng cho các cửa hàng
            for (Order order : orders) {
                orderRepository.save(order);
            }
            Thread thread = new Thread(() -> {
                sendOrderConfirmationEmail(user.getUsername(), cartItems, totalPaymentForWebsite, user.getEmail());
            });
            thread.start();

            // Trả về payment link của đơn hàng đầu tiên
            return generateResponseDTO(orders);
        } catch (Exception e) {
            throw new RuntimeException("Đã xảy ra lỗi khi tạo đơn hàng: " + e.getMessage());
        }
    }

    private NewOrderMessageResponseDTO generateResponseDTO(List<Order> orders) {
        NewOrderMessageResponseDTO responseDTO = new NewOrderMessageResponseDTO();
        responseDTO.setCode("00");
        responseDTO.setDesc("Tạo đơn hàng thành công");

        if (orders.size() > 0) {
            Order firstOrder = orders.get(0);  // Lấy đơn hàng đầu tiên
            responseDTO.setPaymentUrl(firstOrder.getPaymentLinkUrl());
        } else {
            responseDTO.setPaymentUrl("Không có link thanh toán");
        }

        return responseDTO;
    }

    private Order createOrderForShop(Long userId, String shipAddress, PaymentMethod paymentMethod, double totalPriceForShop, int totalQuantityForShop, List<CartItem> itemsForShop, Long shopId, Long cartId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
        Shop shop = shopRepository.findById(shopId).orElseThrow(() -> new RuntimeException("Cửa hàng không tồn tại"));

        Order order = new Order();
        order.setUser(user);
        order.setShop(shop);
        order.setShipAddress(shipAddress);
        order.setPaymentMethod(paymentMethod);
        order.setTotalPrice(totalPriceForShop);
        order.setTotalQuantity(totalQuantityForShop);
        order.setPaymentStatus("UNPAID");
        order.setCartId(cartId);  // Lưu cartId vào đơn hàng
        order = orderRepository.save(order);

        // Lưu OrderSetting
        createOrderSetting(order);

        // Tạo OrderDetails cho sản phẩm trong đơn hàng
        for (CartItem cartItem : itemsForShop) {
            createOrderDetail(order, cartItem);
        }

        return order;
    }

    private void createOrderSetting(Order order) {
        OrderSetting orderSetting = new OrderSetting();
        Setting setting = settingRepository.findById(16)
                .orElseThrow(() -> new RuntimeException("Setting không tồn tại"));
        orderSetting.setOrder(order);
        orderSetting.setSetting(setting);
        orderSetting.setKeyOrderSetting(new KeyOrderShipping(order.getOrderId(), setting.getSettingId()));

        orderSettingRepository.save(orderSetting);
    }

    private void createOrderDetail(Order order, CartItem cartItem) {
        // Khởi tạo danh sách orderDetails nếu chưa được khởi tạo
        if (order.getOrderDetails() == null) {
            order.setOrderDetails(new ArrayList<>());  // Khởi tạo danh sách orderDetails
        }

        // Tạo OrderDetail cho sản phẩm trong giỏ hàng
        Product product = cartItem.getProduct();
        OrderDetail orderDetail = new OrderDetail();
        orderDetail.setOrder(order);
        orderDetail.setProduct(product);
        orderDetail.setQuantity(cartItem.getQuantity());

        // Thêm OrderDetail vào danh sách
        order.getOrderDetails().add(orderDetail);
    }


    private PaymentData createPaymentDataForOrder(Order order, double totalPaymentForWebsite, List<CartItem> cartItems) {
        // Tạo PaymentData với các thông tin thanh toán của đơn hàng
        String orderCode = String.valueOf(order.getOrderId() + 100);  // Mã đơn hàng
        int amount = (int) totalPaymentForWebsite;  // Số tiền thanh toán (chuyển sang kiểu int)
        String description = "WIO-Thanh toán mã " + order.getOrderId();  // Mô tả thanh toán

        String buyerName = order.getUser().getUsername();
        String buyerEmail = order.getUser().getEmail();
        String buyerPhone = order.getUser().getPhone();
        String buyerAddress = order.getShipAddress();
        String cancelUrl = "http://localhost:3000/checkout";  // URL khi hủy thanh toán
        String returnUrl = "http://localhost:3000/order-user";  // URL khi thanh toán thành công
        long expireAt = System.currentTimeMillis() / 1000 + (30 * 60);  // Thời gian hết hạn thanh toán (30 phút tính bằng Unix timestamp

        // Tạo chuỗi cần thiết cho signature (theo yêu cầu của API)
        String signatureString = String.format("amount=%d&cancelUrl=%s&description=%s&orderCode=%s&returnUrl=%s",
                amount, cancelUrl, description, orderCode, returnUrl);
        System.out.println("Signature String: " + signatureString);
        System.out.println("Checksum Key: " + checksumKey);
        // Tạo signature bằng HMAC_SHA256
        String signature = new HmacUtils("HmacSHA256", checksumKey).hmacHex(signatureString);

        System.out.println("Signature: " + signature);

        // Tạo PaymentData với tất cả thông tin
        PaymentData paymentData = PaymentData.builder()
                .orderCode(Long.parseLong(orderCode))  // Mã đơn hàng
                .amount(amount)  // Số tiền thanh toán
                .description(description)  // Mô tả thanh toán
                .items(createItemDataForCartItems(cartItems))  // Danh sách sản phẩm trong giỏ hàng
                .cancelUrl(cancelUrl)  // URL khi hủy thanh toán
                .returnUrl(returnUrl)  // URL khi thanh toán thành công
                .buyerName(buyerName)  // Tên người mua
                .buyerEmail(buyerEmail)  // Email người mua
                .buyerPhone(buyerPhone)  // Số điện thoại người mua
                .buyerAddress(buyerAddress)  // Địa chỉ người mua
                .expiredAt(expireAt)  // Thời gian hết hạn thanh toán
                .signature(signature)  // Chữ ký thanh toán
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

    private void updateProductQuantityAndClearCartItems(List<CartItem> itemsForShop) {
        Set<Cart> cartsToDelete = new HashSet<>();
        for (CartItem cartItem : itemsForShop) {
            Product product = cartItem.getProduct();
            product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
            productRepository.save(product);

            Cart cart = cartItem.getCart();
            cartsToDelete.add(cart);

            cartItemRepository.delete(cartItem);
            cartItemRepository.flush();
        }

        for (Cart cart : cartsToDelete) {
            long remainingItems = cartItemRepository.countByCart(cart);
            if (remainingItems == 0) {
                cartRepository.deleteCartByCartId(cart.getCartId());
            }
        }
    }


    //Phương thức gửi mail 1 : Khi đặt đơn hàng thành công
    public void sendOrderConfirmationEmail(String username, List<CartItem> cartItems, double totalPayment, String emailSend) {
        String subject = "Đơn hàng của bạn đã được tạo thành công";

        // HTML content for the email
        StringBuilder htmlContent = new StringBuilder();
        htmlContent.append("<html><body>")
                .append("<h2>Cảm ơn bạn đã đặt hàng tại hệ thống!</h2>")
                .append("<p>Đơn hàng của bạn đã được tạo thành công. Dưới đây là chi tiết đơn hàng:</p>")
                .append("<table border='1' style='border-collapse: collapse;'>")
                .append("<tr><th>Tên sản phẩm</th><th>Số lượng</th><th>Giá</th><th>Tổng</th></tr>");

        // Thêm chi tiết các sản phẩm trong giỏ hàng
        for (CartItem cartItem : cartItems) {
            htmlContent.append("<tr>")
                    .append("<td>").append(cartItem.getProduct().getProductName()).append("</td>")
                    .append("<td>").append(cartItem.getQuantity()).append("</td>")
                    .append("<td>").append(cartItem.getProduct().getPrice()).append("</td>")
                    .append("<td>").append(cartItem.getTotalPrice()).append("</td>")
                    .append("</tr>");
        }

        htmlContent.append("</table>")
                .append("<p><strong>Tổng số tiền:</strong> ").append(totalPayment).append(" VND</p>")
                .append("<p>Vui lòng kiểm tra chi tiết và theo dõi trạng thái đơn hàng trong tài khoản của bạn.</p>")
                .append("<p>Cảm ơn bạn đã mua sắm tại hệ thống!</p>")
                .append("<p>Thanks & Regards!<br>")
                .append("E-Retail Team</p>")
                .append("</body></html>");

        // Gửi email
        emailServices.sendEmail("interviewmanagement.fa.fpt@gmail.com", emailSend, subject, htmlContent.toString());


    }

    public void sendOrderPaidEmail(String username, String emailSend) {
        String subject = "Cảm ơn bạn đã thanh toán đơn hàng";

        // HTML content for the email
        String htmlContent = "<html><body>" +
                "<h2>Chúc mừng! Đơn hàng của bạn đã được thanh toán thành công.</h2>" +
                "<p>Chúng tôi rất cảm ơn bạn đã mua sắm tại hệ thống của chúng tôi.</p>" +
                "<p><strong>Xin lưu ý:</strong> Đơn hàng của bạn sẽ được vận chuyển trong thời gian sớm nhất.</p>" +
                "<p>Vui lòng kiểm tra tài khoản của bạn để theo dõi trạng thái đơn hàng.</p>" +
                "<p>Thanks & Regards!<br>" +
                "E-Retail Team</p>" +
                "</body></html>";

        // Gửi email
        emailServices.sendEmail("interviewmanagement.fa.fpt@gmail.com", emailSend, subject, htmlContent);
    }


}
