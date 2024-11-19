package com.g4.backend.config;

import com.cloudinary.Cloudinary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;
@Configuration
public class CloudinaryConfiguration {
    @Bean
    public Cloudinary cloudinary(){
        final Map<String,String> config = new HashMap<>();
        config.put("cloud_name","dkfok5q3h");
        config.put("api_key","676354785839249");
        config.put("api_secret","3iXns-Bm75Hxaxb4m7gq8zAuw6c");
        return new Cloudinary(config);
    }
}
