package com.g4.backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.QueueBuilder;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.amqp.core.Queue;
@Configuration
@EnableRabbit
public class RabbitMQConfiguration {
    // Import queues
    public static final String PRODUCT_IMPORT_QUEUE = "product.import.queue";
    public static final String PRODUCT_IMPORT_EXCHANGE = "product.import.exchange";
    public static final String PRODUCT_IMPORT_ROUTING_KEY = "product.import.process";

    // Import result queues
    public static final String IMPORT_RESULT_QUEUE = "product.import.result.queue";
    public static final String IMPORT_RESULT_ROUTING_KEY = "product.import.result";

    @Bean
    public org.springframework.amqp.core.Queue productImportQueue() {
        return  QueueBuilder.durable(PRODUCT_IMPORT_QUEUE)
                .withArgument("x-dead-letter-exchange", "")
                .withArgument("x-dead-letter-routing-key", "product.import.dlq")
                .build();
    }

    @Bean
    public Queue importResultQueue() {
        return  QueueBuilder.durable(IMPORT_RESULT_QUEUE).build();
    }

    @Bean
    public TopicExchange productImportExchange() {
        return new TopicExchange(PRODUCT_IMPORT_EXCHANGE);
    }

    @Bean
    public Binding importBinding() {
        return BindingBuilder
                .bind(productImportQueue())
                .to(productImportExchange())
                .with(PRODUCT_IMPORT_ROUTING_KEY);
    }

    @Bean
    public Binding resultBinding() {
        return BindingBuilder
                .bind(importResultQueue())
                .to(productImportExchange())
                .with(IMPORT_RESULT_ROUTING_KEY);
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(new Jackson2JsonMessageConverter());
        return template;
    }
}
