package com.g4.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class WearitoutBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(WearitoutBackendApplication.class, args);
	}

}
