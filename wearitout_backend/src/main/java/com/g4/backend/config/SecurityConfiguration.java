package com.g4.backend.config;

import com.g4.backend.service.AuthService;
import com.g4.backend.service.EndPointService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfiguration {
    private AuthService authService;

    @Value("${frontend.url}")
    private String frontendUrl;

    private OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;
    private JwtFilter jwtFilter;


    @Autowired
    public SecurityConfiguration(AuthService authService, OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler, JwtFilter jwtFilter) {

        this.authService = authService;
        this.oAuth2LoginSuccessHandler = oAuth2LoginSuccessHandler;
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public BCryptPasswordEncoder bCrypt() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    @Autowired
    public DaoAuthenticationProvider authenticationProvider(AuthService authService) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(authService);
        provider.setPasswordEncoder(bCrypt());
        return provider;
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.authenticationProvider(authenticationProvider(authService)).addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        http.sessionManagement((session) -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        http.httpBasic(Customizer.withDefaults());
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> {
                    auth.requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll();
                    auth.requestMatchers(HttpMethod.POST, EndPointService.publicPostEndPoint).permitAll();
                    auth.requestMatchers(HttpMethod.GET, EndPointService.adminGetEndPoint).permitAll();
                    auth.requestMatchers(HttpMethod.POST, EndPointService.adminPostEndPoint).hasAuthority("ROLE_ADMIN");
                    auth.requestMatchers(HttpMethod.GET, EndPointService.publicGetEndPoint).permitAll();
                    auth.requestMatchers(HttpMethod.GET, "/api/v1/shop_staff/order/**").permitAll();
                    auth.requestMatchers(HttpMethod.GET, "/api/v1/user/order/**").permitAll();
                    auth.requestMatchers(HttpMethod.POST, "/api/webhook/handler-bank-transfer").permitAll();
                    auth.requestMatchers(HttpMethod.GET, EndPointService.adminShopGetEndPoint).permitAll();
                    auth.requestMatchers(HttpMethod.POST,EndPointService.adminShopPostEndPoint).hasAnyAuthority("ROLE_ADMIN","ROLE_SELLER","ROLE_SHOPSTAFF");
                    auth.requestMatchers(HttpMethod.POST,EndPointService.userPostEndPoint).hasAnyAuthority("ROLE_USER","ROLE_ADMIN","ROLE_SELLER","ROLE_SHOPSTAFF");
                    auth.requestMatchers(HttpMethod.GET,EndPointService.userGetEndPoint).hasAnyAuthority("ROLE_USER","ROLE_ADMIN","ROLE_SELLER","ROLE_SHOPSTAFF");
                })
                .oauth2Login(oath2 -> {
                    oath2.loginPage("/oauth2/authorization/google").permitAll();
                    oath2.successHandler(oAuth2LoginSuccessHandler);
                })
                .build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(frontendUrl));
        configuration.addAllowedHeader("*");
        configuration.addAllowedMethod("*");
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource urlBasedCorsConfigurationSource = new UrlBasedCorsConfigurationSource();
        urlBasedCorsConfigurationSource.registerCorsConfiguration("/**", configuration);
        return urlBasedCorsConfigurationSource;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
