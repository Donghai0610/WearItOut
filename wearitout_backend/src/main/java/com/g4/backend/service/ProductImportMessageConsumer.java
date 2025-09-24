package com.g4.backend.service;

import com.g4.backend.config.ProductImportMessageProducer;
import com.g4.backend.config.RabbitMQConfiguration;
import com.g4.backend.dto.request.ImportResultMessage;
import com.g4.backend.dto.request.NewProductRequestDTO;
import com.g4.backend.dto.request.ProductImportMessage;
import jakarta.validation.ValidationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class ProductImportMessageConsumer {

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductImportMessageProducer messageProducer;

    @RabbitListener(queues = RabbitMQConfiguration.PRODUCT_IMPORT_QUEUE)
    public void processImportMessage(ProductImportMessage message) {
        log.info("Processing import: {}", message.getImportId());

        ImportResultMessage result = ImportResultMessage.builder()
                .importId(message.getImportId())
                .userId(message.getUserId())
                .fileName(message.getFileName())
                .totalProducts(message.getProducts().size())
                .completedAt(LocalDateTime.now())
                .build();

        List<String> errors = new ArrayList<>();
        int successCount = 0;

        try {
            // Process each product
            for (int i = 0; i < message.getProducts().size(); i++) {
                try {
                    NewProductRequestDTO productDTO = message.getProducts().get(i);

                    // Validate product
                    validateProductData(productDTO, i + 2); // +2 for Excel row number

                    // Save product
                    productService.addProduct(productDTO);
                    successCount++;

                } catch (Exception e) {
                    String errorMsg = String.format("Row %d: %s", i + 2, e.getMessage());
                    errors.add(errorMsg);
                    log.error("Failed to import product at row {}: {}", i + 2, e.getMessage());
                }
            }

            result.setSuccessCount(successCount);
            result.setErrorCount(message.getProducts().size() - successCount);
            result.setErrors(errors);
            result.setStatus(errors.isEmpty() ? "SUCCESS" :
                    successCount > 0 ? "PARTIAL_SUCCESS" : "FAILED");

        } catch (Exception e) {
            log.error("Import process failed: {}", e.getMessage(), e);
            result.setSuccessCount(0);
            result.setErrorCount(message.getProducts().size());
            result.setStatus("FAILED");
            errors.add("Import process failed: " + e.getMessage());
            result.setErrors(errors);
        }

        // Send result back
        messageProducer.sendImportResult(result);
        log.info("Import completed: {} success, {} errors",
                result.getSuccessCount(), result.getErrorCount());
    }

    private void validateProductData(NewProductRequestDTO product, int rowNumber) {
        if (product.getProductName() == null || product.getProductName().trim().isEmpty()) {
            throw new ValidationException("Product name is required");
        }

        if (product.getPrice() == null || product.getPrice() <= 0) {
            throw new ValidationException("Valid price is required");
        }

        if (product.getStockQuantity() == null || product.getStockQuantity() < 0) {
            throw new ValidationException("Stock quantity cannot be negative");
        }

        if (product.getSettingName() == null || product.getSettingName().trim().isEmpty()) {
            throw new ValidationException("Setting name is required");
        }

        if (product.getShopName() == null || product.getShopName().trim().isEmpty()) {
            throw new ValidationException("Shop name is required");
        }
    }
}