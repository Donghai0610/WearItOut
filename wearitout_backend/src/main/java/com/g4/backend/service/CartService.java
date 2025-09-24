package com.g4.backend.service;

import com.g4.backend.dto.request.AddProductToCartRequestDTO;
import com.g4.backend.dto.request.UpdateProductInCartRequestDTO;
import com.g4.backend.dto.response.CartProductCountResponseDTO;
import com.g4.backend.dto.response.CartResponseDTO;
import com.g4.backend.dto.response.ProductCartResponseDTO;
import com.g4.backend.exception.AppException;
import com.g4.backend.exception.ErrorCode;
import com.g4.backend.model.Cart;
import com.g4.backend.model.CartItem;
import com.g4.backend.model.Product;
import com.g4.backend.repository.CartRepository;
import com.g4.backend.repository.ProductRepository;
import com.g4.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Autowired
    public CartService(CartRepository cartRepository, ProductRepository productRepository, UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    /**
     * Lấy giỏ hàng của người dùng
     */
    public CartResponseDTO getCart(Long userId) {
        Cart cart = cartRepository.findCartByUserId(userId);
        if (cart == null) {
            throw new RuntimeException("Giỏ hàng không tồn tại");
        }
        return mapCartToCartResponse(cart);
    }

    /**
     * Thêm sản phẩm vào giỏ hàng
     */
    public CartResponseDTO addProductToCart(Long userId, AddProductToCartRequestDTO request) {
        Cart cart = cartRepository.findCartByUserId(userId);
        if (cart == null) {
            cart = new Cart();
            cart.setUser(userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng")));
            cart.setCartItems(new ArrayList<>()); // Đảm bảo cartItems được khởi tạo
        }

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

        // Kiểm tra tồn kho trước khi thêm sản phẩm
        if (!isStockAvailable(product.getId(), request.getQuantity())) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }

        Optional<CartItem> existingItem = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getId().equals(request.getProductId()))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            item.setTotalPrice(product.getPrice() * item.getQuantity());
        } else {
            CartItem newItem = new CartItem();
            newItem.setProduct(product);
            newItem.setQuantity(request.getQuantity());
            newItem.setTotalPrice(product.getPrice() * request.getQuantity());
            newItem.setCart(cart);

            cart.getCartItems().add(newItem);
        }

        updateCartPrice(cart);
        return mapCartToCartResponse(cartRepository.save(cart));
    }



    /**
     * Cập nhật số lượng sản phẩm trong giỏ hàng
     */
    public CartResponseDTO updateProductInCart(Long userId, UpdateProductInCartRequestDTO request) {
        Cart cart = cartRepository.findCartByUserId(userId);
        if (cart == null) {
            throw new AppException(ErrorCode.CART_ITEM_NOT_FOUND);
        }

        CartItem cartItem = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getId().equals(request.getProductId()))
                .findFirst()
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_EXISTS_IN_CART));


        Product product = cartItem.getProduct();

        if (request.getQuantity() > product.getStockQuantity()) {
            throw new AppException(ErrorCode.STOCK_NOT_ENOUGH);
        }

        cartItem.setQuantity(request.getQuantity());
        cartItem.setTotalPrice(product.getPrice() * request.getQuantity());

        updateCartPrice(cart);
        return mapCartToCartResponse(cartRepository.save(cart));
    }

    /**
     * Xóa sản phẩm khỏi giỏ hàng
     */
    public CartResponseDTO removeProductFromCart(Long userId, Long productId) {
        Cart cart = cartRepository.findCartByUserId(userId);
        if (cart == null) {
            throw new RuntimeException("Giỏ hàng không tồn tại");
        }

        cart.getCartItems().removeIf(item -> item.getProduct().getId().equals(productId));

        updateCartPrice(cart);
        return mapCartToCartResponse(cartRepository.save(cart));
    }

    /**
     * Tính tổng giá của giỏ hàng
     */
    private void updateCartPrice(Cart cart) {
        double totalPrice = cart.getCartItems() == null ? 0 : cart.getCartItems().stream()
                .mapToDouble(CartItem::getTotalPrice)
                .sum();
        cart.setPrice(totalPrice);
    }

    /**
     * Đếm tổng số sản phẩm trong giỏ hàng
     */
    public CartProductCountResponseDTO countTotalProductsInCart(Long cartId) {
        Optional<Cart>  cart_First = cartRepository.findCartByUserId2(cartId);
        System.out.println(cart_First.get().getCartId());
        Cart cart = cartRepository.findById(cart_First.get().getCartId())
                .orElseThrow(() -> new RuntimeException("Giỏ hàng không tồn tại"));

        int totalProducts = cart.getCartItems().stream()
                .mapToInt(CartItem::getQuantity)
                .sum();

        return new CartProductCountResponseDTO(cartId, cart.getUser().getUserId(), totalProducts);
    }

    /**
     * Map Cart thành CartResponseDTO
     */
    private CartResponseDTO mapCartToCartResponse(Cart cart) {
        CartResponseDTO response = new CartResponseDTO();
        response.setCartId(cart.getCartId());
        response.setTotalPrice(cart.getPrice());
        response.setProducts(cart.getCartItems().stream()
                .map(this::toProductCartResponseDTO)
                .collect(Collectors.toList()));
        return response;
    }

    /**
     * Map CartItem thành ProductCartResponseDTO
     */
    public ProductCartResponseDTO toProductCartResponseDTO(CartItem cartItem) {
        Product product = cartItem.getProduct();

        ProductCartResponseDTO productDTO = new ProductCartResponseDTO();
        productDTO.setProductId(product.getId());
        productDTO.setProductName(product.getProductName());
        productDTO.setDescription(product.getDescription());
        productDTO.setPrice(product.getPrice());
        productDTO.setQuantity(cartItem.getQuantity());
        productDTO.setTotalPrice(cartItem.getTotalPrice());
        productDTO.setStatus(product.getStatus() ? "Active" : "Inactive");
        productDTO.setRating(product.getRating());

        if (product.getImage() != null) {
            productDTO.setImageUrls(product.getImage().stream()
                    .map(image -> image.getUrl())
                    .collect(Collectors.toList()));
        }

        if (product.getSetting() != null) {
            productDTO.setSettingName(product.getSetting().getName());
        }

        if (product.getShop() != null) {
            productDTO.setShopName(product.getShop().getName());
        }

        return productDTO;
    }


    private boolean isStockAvailable(Long productId, int quantityToAdd) {
        // Lấy sản phẩm từ cơ sở dữ liệu
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

        // Tính tổng số lượng sản phẩm hiện tại trong tất cả các giỏ hàng
        Integer totalQuantityInCarts = cartRepository.findTotalQuantityByProductId(productId);

        // Xử lý trường hợp totalQuantityInCarts là null
        int currentQuantityInCarts = (totalQuantityInCarts != null) ? totalQuantityInCarts : 0;

        // Kiểm tra nếu tổng số lượng + số lượng muốn thêm vượt quá tồn kho
        return (currentQuantityInCarts + quantityToAdd) <= product.getStockQuantity();
    }


}
