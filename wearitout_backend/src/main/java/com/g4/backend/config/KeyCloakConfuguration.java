package com.g4.backend.config;

import org.springframework.cloud.openfeign.FeignClient;

@FeignClient(name = "keycloak", url = "${keycloak.auth-server-url}")
public interface KeyCloakConfuguration {
}
