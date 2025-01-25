package com.g4.backend.service;

import com.g4.backend.dto.request.NewProductRequestDTO;
import com.g4.backend.dto.request.UpdateProductRequestDTO;
import com.g4.backend.dto.response.CloudinaryResponseDTO;
import com.g4.backend.dto.response.NewProductResponseDTO;
import com.g4.backend.dto.response.ProductsResponseDTO;
import com.g4.backend.model.ImageProduct;
import com.g4.backend.model.Product;
import com.g4.backend.model.Setting;
import com.g4.backend.model.Shop;
import com.g4.backend.repository.ImageProductRepository;
import com.g4.backend.repository.ProductRepository;
import com.g4.backend.repository.SettingRepository;
import com.g4.backend.repository.ShopRepositoryAdmin;

import com.g4.backend.utils.FileUpLoadUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final CloudinaryService cloudinaryService;
    private final SettingRepository settingRepository;
    private final ShopRepositoryAdmin shopRepositoryAdmin;
    private final ImageProductRepository imageProductRepository;


    @Autowired
    public ProductService(ProductRepository productRepository, CloudinaryService cloudinaryService, SettingRepository settingRepository, ShopRepositoryAdmin shopRepositoryAdmin, ImageProductRepository imageProductRepository) {
        this.productRepository = productRepository;
        this.cloudinaryService = cloudinaryService;
        this.settingRepository = settingRepository;
        this.shopRepositoryAdmin = shopRepositoryAdmin;
        this.imageProductRepository = imageProductRepository;
    }

    public ProductsResponseDTO toProductsResponseDTO(Product product) {
        ProductsResponseDTO productDTO = new ProductsResponseDTO();
        productDTO.setId(product.getId());
        productDTO.setProductName(product.getProductName());
        productDTO.setDescription(product.getDescription());
        productDTO.setPrice(product.getPrice());
        productDTO.setStockQuantity(product.getStockQuantity());
        productDTO.setStatus(product.getStatus() == true ? "Active" : "Inactive");
        productDTO.setRating(product.getRating());

        // Convert image list to image URLs
        if (product.getImage() != null) {
            productDTO.setImageUrls(product.getImage().stream()
                    .map(ImageProduct::getUrl) // Giả sử ImageProduct có phương thức getImageUrl()
                    .collect(Collectors.toList()));
        }

        // Kiểm tra và gán tên của setting nếu tồn tại
        if (product.getSetting() != null) {
            productDTO.setSettingName(product.getSetting().getName());
        }

        // Kiểm tra và gán tên của shop nếu tồn tại
        if (product.getShop() != null) {
            productDTO.setShopName(product.getShop().getName());
        }

        return productDTO;
    }


    public NewProductResponseDTO convertToResponseDTO(Product product) {
        List<String> imageUrls = new ArrayList<>();

        // Kiểm tra nếu danh sách hình ảnh không rỗng và không null
        if (product.getImage() != null && !product.getImage().isEmpty()) {
            imageUrls = product.getImage().stream()
                    .map(ImageProduct::getUrl)
                    .collect(Collectors.toList());
        }

        // Tạo DTO phản hồi
        return NewProductResponseDTO.builder()
                .productId(product.getId())
                .productName(product.getProductName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stockQuantity(product.getStockQuantity())
                .status(product.getStatus() == true ? "Active" : "Inactive")
                .rating(product.getRating())
                .settingName(product.getSetting().getName())
                .shopName(product.getShop().getName())
                .imageUrls(imageUrls)
                .build();
    }
    public Page<ProductsResponseDTO> getAllProducts(
            String productName,
            Double priceMin,
            Double priceMax,
            Double ratingMin,
            Double ratingMax,
            String setting,
            String shop,
            int page,
            int size,
            String sortDirection) {

        // Kiểm tra hướng sắp xếp
        Sort sort = sortDirection.equalsIgnoreCase("desc")
                ? Sort.by("price").descending()
                : Sort.by("price").ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        // Lấy danh sách sản phẩm từ repository với các tham số lọc mới
        Page<Product> productPage = productRepository.searchByProductFields(
                productName,
                priceMin,
                priceMax,
                ratingMin,
                ratingMax,
                setting,
                shop,
                pageable);

        // Chuyển đổi Page<Product> thành Page<ProductsResponseDTO>
        return productPage.map(this::toProductsResponseDTO); // Gọi phương thức chuyển đổi
    }


    public ProductsResponseDTO getProductDetail(Long productId) {
        // Tìm sản phẩm theo ID
        Optional<Product> productOptional = productRepository.findById(productId);
        if (productOptional.isPresent()) {
            return toProductsResponseDTO(productOptional.get()); // Chuyển đổi và trả về ProductDTO
        } else {
            throw new RuntimeException("Product not found with ID: " + productId); // Tạo exception nếu không tìm thấy
        }
    }

    public Page<ProductsResponseDTO> getProductsByShopId(Long shopId, String productName, Double price, String setting, Pageable pageable) {
        Page<Product> productPage = productRepository.findProductsByShopId(shopId, productName, price, setting, pageable);
        return productPage.map(this::toProductsResponseDTO);
    }

    public ProductsResponseDTO getProductDetailOfShop(Long shopId, Long productId) {
        // Tìm sản phẩm theo shopId và productId
        Optional<Product> productOptional = productRepository.findProductByShopIdAndProductId(shopId, productId);

        if (productOptional.isPresent()) {
            return toProductsResponseDTO(productOptional.get());
        } else {
            throw new RuntimeException("Product not found with ID: " + productId + " in shop with ID: " + shopId); // Tạo exception nếu không tìm thấy
        }
    }
//    @Transactional
//    public Product addProduct(NewProductRequestDTO requestDTO) {
//        Setting setting = settingRepository.findSettingByName(requestDTO.getSettingName())
//                .orElseThrow(() -> new RuntimeException("Setting not found"));
//
//        Shop shop = shopRepositoryAdmin.findByName(requestDTO.getShopName())
//                .orElseThrow(() -> new RuntimeException("Shop not found"));
//
//        // Tạo đối tượng Product
//        Product product = new Product();
//        product.setProductName(requestDTO.getProductName());
//        product.setDescription(requestDTO.getDescription());
//        product.setPrice(requestDTO.getPrice());
//        product.setStockQuantity(requestDTO.getStockQuantity());
//        product.setStatus(Boolean.parseBoolean(requestDTO.getStatus()));
//        product.setRating(requestDTO.getRating());
//        product.setSetting(setting);
//        product.setShop(shop);
//
//        // Lưu product
//        Product savedProduct = productRepository.save(product);
//
//        // Upload và lưu các hình ảnh
//        List<ImageProduct> images = new ArrayList<>();
//        for (MultipartFile file : requestDTO.getImageFiles()) {
//            // Kiểm tra file trước khi upload
//            FileUpLoadUtil.assertAllowed(file, FileUpLoadUtil.IMAGE_PATTERN);
//            String fileName = FileUpLoadUtil.getFileName(file.getOriginalFilename());
//
//            // Upload file lên Cloudinary
//            CloudinaryResponseDTO cloudinaryResponse = cloudinaryServices.uploadFile(file, fileName);
//            String imageUrl = cloudinaryResponse.getUrl();
//
//            // Lưu đường dẫn ảnh vào bảng ImageProduct
//            ImageProduct image = new ImageProduct();
//            image.setUrl(imageUrl);
//            image.setProduct(savedProduct);
//            images.add(image);
//        }
//
//        // Lưu các hình ảnh vào cơ sở dữ liệu
//        imageProductRepository.saveAll(images);
//
//        return savedProduct;
//    }

    public Product addProduct(NewProductRequestDTO requestDTO) {

                Setting setting = settingRepository.findSettingByName(requestDTO.getSettingName())
                .orElseThrow(() -> new RuntimeException("Setting not found"));

        Shop shop = shopRepositoryAdmin.findByName(requestDTO.getShopName())
                .orElseThrow(() -> new RuntimeException("Shop not found"));

        // Tạo đối tượng Product
        Product product = new Product();
        product.setProductName(requestDTO.getProductName());
        product.setDescription(requestDTO.getDescription());
        product.setPrice(requestDTO.getPrice());
        product.setStockQuantity(requestDTO.getStockQuantity());
        product.setStatus(Boolean.parseBoolean(requestDTO.getStatus()));
        product.setRating(requestDTO.getRating());
        product.setSetting(setting);
        product.setShop(shop);

        // Lưu product
        Product savedProduct = productRepository.save(product);
        List<ImageProduct> images = new ArrayList<>();
        // Xử lý upload ảnh trong một luồng riêng
        if (requestDTO.getImageFiles() != null && !requestDTO.getImageFiles().isEmpty()) {
           
                for (MultipartFile file : requestDTO.getImageFiles()) {
                    try {
                        // Kiểm tra file trước khi upload
                        FileUpLoadUtil.assertAllowed(file, FileUpLoadUtil.IMAGE_PATTERN);
                        String fileName = FileUpLoadUtil.getFileName(file.getOriginalFilename());

                        // Upload file lên Cloudinary
                        CloudinaryResponseDTO cloudinaryResponse = cloudinaryService.uploadFile(file, fileName);
                        String imageUrl = cloudinaryResponse.getUrl();

                        // Tạo đối tượng ImageProduct
                        ImageProduct image = new ImageProduct();
                        image.setUrl(imageUrl);
                        image.setProduct(savedProduct);

                        // Lưu ImageProduct vào cơ sở dữ liệu
                        imageProductRepository.save(image);
                    } catch (Exception e) {
                        // Xử lý lỗi trong quá trình upload
                        System.err.println("Error uploading image: " + e.getMessage());
                    }
                }

        }


        return savedProduct;
    }

    @Transactional
    public Product updateProduct(Long productId, UpdateProductRequestDTO requestDTO ) {
        // Lấy Product dựa trên ID
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + productId));

        // Cập nhật thông tin Product
        if (requestDTO.getProductName() != null && !requestDTO.getProductName().isEmpty()) {
            product.setProductName(requestDTO.getProductName());
        }
        if (requestDTO.getDescription() != null && !requestDTO.getDescription().isEmpty()) {
            product.setDescription(requestDTO.getDescription());
        }
        if (requestDTO.getPrice() != null) {
            product.setPrice(requestDTO.getPrice());
        }
        if (requestDTO.getStockQuantity() != null) {
            product.setStockQuantity(requestDTO.getStockQuantity());
        }
        if (requestDTO.getStatus() != null && !requestDTO.getStatus().isEmpty()) {
            product.setStatus(Boolean.parseBoolean(requestDTO.getStatus()));
        }
        if (requestDTO.getRating() != null) {
            product.setRating(requestDTO.getRating());
        }

        // Cập nhật Setting nếu có
        if (requestDTO.getSettingName() != null && !requestDTO.getSettingName().isEmpty()) {
            Setting setting = settingRepository.findSettingByName(requestDTO.getSettingName())
                    .orElseThrow(() -> new RuntimeException("Setting not found"));
            product.setSetting(setting);
        }

        // Cập nhật Shop nếu có
        if (requestDTO.getShopName() != null && !requestDTO.getShopName().isEmpty()) {
            Shop shop = shopRepositoryAdmin.findByName(requestDTO.getShopName())
                    .orElseThrow(() -> new RuntimeException("Shop not found"));
            product.setShop(shop);
        }

        // Lưu các thay đổi của product
        Product updatedProduct = productRepository.save(product);

        // Nếu có file ảnh mới, tiến hành upload và cập nhật
        if (requestDTO.getImageFiles() != null && !requestDTO.getImageFiles().isEmpty()) {
            // Xóa các hình ảnh cũ trong cơ sở dữ liệu
            imageProductRepository.deleteByProduct(updatedProduct);

            // Upload các hình ảnh mới và lưu vào cơ sở dữ liệu
            List<ImageProduct> images = new ArrayList<>();
            for (MultipartFile file : requestDTO.getImageFiles()) {
                try {
                    // Kiểm tra file trước khi upload
                    FileUpLoadUtil.assertAllowed(file, FileUpLoadUtil.IMAGE_PATTERN);
                    String fileName = FileUpLoadUtil.getFileName(file.getOriginalFilename());

                    // Upload file lên Cloudinary
                    CloudinaryResponseDTO cloudinaryResponse = cloudinaryService.uploadFile(file, fileName);
                    String imageUrl = cloudinaryResponse.getUrl();

                    // Lưu đường dẫn ảnh vào bảng ImageProduct
                    ImageProduct image = new ImageProduct();
                    image.setUrl(imageUrl);
                    image.setProduct(updatedProduct);
                    images.add(image);
                } catch (Exception e) {
                    throw new RuntimeException("Error uploading file: " + e.getMessage());
                }
            }

            // Lưu các hình ảnh mới vào cơ sở dữ liệu
            imageProductRepository.saveAll(images);
        }

        return updatedProduct;
    }
    @Transactional
    public void deleteProduct(Long productId) {
        // Tìm sản phẩm theo ID
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + productId));

        // Lấy danh sách hình ảnh của sản phẩm
        List<ImageProduct> images = imageProductRepository.findByProduct(product);

        // Xóa các hình ảnh trên Cloudinary
        for (ImageProduct image : images) {
            try {
                String publicId = extractPublicIdFromUrl(image.getUrl());
                cloudinaryService.deleteFile(publicId);  // Hàm xóa file trên Cloudinary
            } catch (Exception e) {
                throw new RuntimeException("Error deleting image from Cloudinary: " + e.getMessage());
            }
        }

        // Xóa bản ghi hình ảnh trong cơ sở dữ liệu
        imageProductRepository.deleteAll(images);

        // Xóa sản phẩm
        productRepository.delete(product);
    }

    // Hàm hỗ trợ để lấy public ID từ URL của Cloudinary
    private String extractPublicIdFromUrl(String url) {
        // Ví dụ: Nếu URL là "https://res.cloudinary.com/<cloud_name>/image/upload/v1234567890/dev/product/filename.jpg"
        // Public ID sẽ là "dev/product/filename"
        String[] parts = url.split("/");
        String publicIdWithExtension = parts[parts.length - 1];
        return url.substring(url.indexOf("/dev/product/"), url.lastIndexOf(publicIdWithExtension) - 1);
    }

//Feature Product
    public List<ProductsResponseDTO> getTopRatedProducts(int limit) {
        Pageable pageable = PageRequest.of(0, limit); // Lấy trang đầu tiên với số lượng sản phẩm là 'limit'
        List<Product> products = productRepository.findTopRatedProducts(pageable);

        // Map từ Product sang ProductsResponseDTO
        return products.stream()
                .map(this::toProductsResponseDTO)
                .collect(Collectors.toList());
    }

    public List<ProductsResponseDTO> getTrendingProducts(Long settingId, int limit) {
        Pageable pageable = PageRequest.of(0, limit);

        List<Product> products;
        if (settingId == null || settingId == 0) {
            // Nếu không truyền settingId, lấy sản phẩm có rating cao nhất
            products = productRepository.findTopRatedProducts(pageable);
        } else {
            // Nếu có settingId, lấy sản phẩm theo danh mục
            products = productRepository.findTrendingProducts(settingId, pageable);
        }

        // Map từ Product sang ProductsResponseDTO
        return products.stream()
                .map(this::toProductsResponseDTO)
                .collect(Collectors.toList());
    }

    public List<ProductsResponseDTO> getSameProductSameShop(long id){
        List<Product> products = productRepository.findProductsFromSameShop(id);
        return products.stream()
                .map(this::toProductsResponseDTO)
                .collect(Collectors.toList());

    }


}
