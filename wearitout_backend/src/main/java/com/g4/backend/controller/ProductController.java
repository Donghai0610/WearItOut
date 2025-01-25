package com.g4.backend.controller;

import com.g4.backend.dto.request.NewProductRequestDTO;
import com.g4.backend.dto.request.UpdateProductRequestDTO;
import com.g4.backend.dto.response.*;
import com.g4.backend.model.Product;
import com.g4.backend.service.ProductService;
import com.g4.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/product")
public class ProductController {
    private final ProductService productServices;
    private final UserService userService;

    @Autowired
    public ProductController(ProductService productServices, UserService userService) {
        this.productServices = productServices;
        this.userService = userService;
    }

    @GetMapping("/search")
    public ResponseEntity<?> getAllProducts(
            @RequestParam(required = false) String productName,
            @RequestParam(required = false) Double priceMin,
            @RequestParam(required = false) Double priceMax,
            @RequestParam(required = false) Double ratingMin,
            @RequestParam(required = false) Double ratingMax,
            @RequestParam(required = false) String setting,
            @RequestParam(required = false) String shop,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size,
            @RequestParam(defaultValue = "asc") String sortDirection) {

        // Gọi service để lấy dữ liệu sản phẩm
        Page<ProductsResponseDTO> productPage = productServices.getAllProducts(
                productName,
                priceMin,
                priceMax,
                ratingMin,
                ratingMax,
                setting,
                shop,
                page,
                size,
                sortDirection
        );

        // Trả về kết quả
        return ResponseEntity.ok(
                new SearchResponse(
                        productPage.getContent(),
                        productPage.getTotalPages()
                )
        );
    }


    @GetMapping("/{productId}")
    public ResponseEntity<ResponseDTO> getProductDetail(@PathVariable Long productId) {
        ProductsResponseDTO dto = productServices.getProductDetail(productId);

        if (dto == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ResponseDTO(404, "Product not found", null));
        }

        return ResponseEntity.ok(new ResponseDTO(200, "Success", dto));
    }

    @GetMapping("/productofshop/{shopId}")
    public ResponseEntity<?> getProductsByShopId(
            @PathVariable Long shopId,
            @RequestParam(required = false) String productName,
            @RequestParam(required = false) Double price,


            @RequestParam(required = false) String setting,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<ProductsResponseDTO> productPage = productServices.getProductsByShopId(shopId, productName, price, setting, pageable);

        return ResponseEntity.ok(new SearchResponse(productPage.getContent(), productPage.getTotalPages()));
    }

    @GetMapping("/shop/{shopId}/detail/{productId}")
    public ResponseEntity<ResponseDTO> getProductDetailForShop(
            @PathVariable Long shopId,
            @PathVariable Long productId) {

        ProductsResponseDTO dto = productServices.getProductDetailOfShop(shopId, productId);

        if (dto == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ResponseDTO(404, "Product not found in shop", null));
        }

        return ResponseEntity.ok(new ResponseDTO(200, "Success", dto));
    }

    @PostMapping("/update/{productId}")
    public ResponseEntity<?> updateProduct(@PathVariable Long productId, @ModelAttribute UpdateProductRequestDTO requestDTO) {
        Product updatedProduct = productServices.updateProduct(productId, requestDTO);

        if (updatedProduct == null) {
            ResponseDTO responseDTO = ResponseDTO.builder()
                    .code(404)
                    .message("Product not found")
                    .data(null)
                    .build();
            return new ResponseEntity<>(responseDTO, HttpStatus.NOT_FOUND);
        }

        return ResponseEntity.status(HttpStatus.OK)
                .body(ResponseDTO.builder()
                        .code(200)
                        .message("Success")
                        .data(updatedProduct)
                        .build());
    }

    @PostMapping("/add")
    public ResponseEntity<?> addProduct(@ModelAttribute NewProductRequestDTO requestDTO) {
        Product product = productServices.addProduct(requestDTO);
        NewProductResponseDTO requestDTO1 = productServices.convertToResponseDTO(product);

        if (product == null) {
            ResponseDTO responseDTO = ResponseDTO.builder()
                    .code(400)
                    .message("Bad request")
                    .data(null)
                    .build();
            return new ResponseEntity<>(responseDTO, HttpStatus.BAD_REQUEST);
        }
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ResponseDTO.builder()
                        .code(201)
                        .message("Success")
                        .data(requestDTO1)
                        .build());
    }

    @PostMapping("/delete/{productId}")
    public ResponseEntity<ResponseDTO> deleteProduct(@PathVariable Long productId) {
        try {
            productServices.deleteProduct(productId);
            return ResponseEntity.status(HttpStatus.OK)
                    .body(ResponseDTO.builder()
                            .code(200)
                            .message("Product deleted successfully")
                            .data(null)
                            .build());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ResponseDTO.builder()
                            .code(404)
                            .message(e.getMessage())
                            .data(null)
                            .build());
        }
    }

    @GetMapping("/shops")
    public ResponseEntity<?> getAllShopIdAndNames() {
        try {
            List<ShopIdNameResponseDTO> shopList = userService.getAllShopIdAndNames();
            return new ResponseEntity<>(shopList, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/top-rated")
    public List<ProductsResponseDTO> getTopRatedProducts(@RequestParam(defaultValue = "10") int limit) {
        return productServices.getTopRatedProducts(limit);
    }


    @GetMapping("/category/{typeId}")
    public ResponseEntity<?> getCategoryName(@PathVariable int typeId) {
        try {
            List<SettingIdNameResponseDTO> settingNames = userService.getCategoryName(typeId);
            return new ResponseEntity<>(settingNames, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/trending")
    public ResponseEntity<List<ProductsResponseDTO>> getTrendingProductByCategoryId(
             @RequestParam(required = false) Long settingId,
            @RequestParam(defaultValue = "10") int limit) {

        List<ProductsResponseDTO> products = productServices.getTrendingProducts(settingId, limit);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/same-product/{productId}")
    public ResponseEntity<?> getSameProduct(@PathVariable Long productId) {
        List<ProductsResponseDTO> products = productServices.getSameProductSameShop(productId);
        return ResponseEntity.ok(products);
    }

}