package com.g4.backend.config;

import com.g4.backend.dto.request.ImportResultMessage;
import com.g4.backend.dto.request.ProductImportMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class ProductImportMessageProducer {
    @Autowired
    private RabbitTemplate rabbitTemplate;

    public void sendImportMessage(ProductImportMessage message) {
        try {
            rabbitTemplate.convertAndSend(
                    RabbitMQConfiguration.PRODUCT_IMPORT_EXCHANGE,
                    RabbitMQConfiguration.PRODUCT_IMPORT_ROUTING_KEY,
                    message
            );
            log.info("Sent import message: {}", message.getImportId());
        } catch (Exception e) {
            log.error("Failed to send import message", e);
            throw new RuntimeException("Failed to queue import job", e);
        }
    }

    public void sendImportResult(ImportResultMessage result) {
        try {
            rabbitTemplate.convertAndSend(
                    RabbitMQConfiguration.PRODUCT_IMPORT_EXCHANGE,
                    RabbitMQConfiguration.IMPORT_RESULT_ROUTING_KEY,
                    result
            );
            log.info("Sent import result: {}", result.getImportId());
        } catch (Exception e) {
            log.error("Failed to send import result", e);
        }
    }
}
