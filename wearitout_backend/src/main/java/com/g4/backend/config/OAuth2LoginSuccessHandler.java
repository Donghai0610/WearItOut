package com.g4.backend.config;

import com.g4.backend.common.RegistrationSource;
import com.g4.backend.model.dto.reponse.LoginResponeDTO;
import com.g4.backend.model.enity.User;
import com.g4.backend.service.AuthService;
import com.g4.backend.service.UserService;
import com.g4.backend.service.impl.JWTServiceImpl;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Component
public class OAuth2LoginSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {

    private final AuthService authService;
    private final UserService userService;
    private final JWTServiceImpl jwtService;
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    public OAuth2LoginSuccessHandler(AuthService authService, UserService userService, @Lazy BCryptPasswordEncoder bCryptPasswordEncoder, JWTServiceImpl jwtService) {
        this.authService = authService;
        this.userService = userService;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.jwtService = jwtService;
    }

    @Value("${frontend.url}")
    private String frontendUrl;




    @Override
    @Transactional
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws ServletException, IOException {
        OAuth2AuthenticationToken oAuth2AuthenticationToken = (OAuth2AuthenticationToken) authentication;

        if ("google".equals(oAuth2AuthenticationToken.getAuthorizedClientRegistrationId())) {
            DefaultOAuth2User principal = (DefaultOAuth2User) authentication.getPrincipal();
            Map<String, Object> attributes = principal.getAttributes();

            String email = attributes.getOrDefault("email", "").toString();
            String name = attributes.getOrDefault("name", "").toString();

            User user = authService.findUserByEmail(email).orElseGet(() -> {
                // Tạo người dùng mới nếu không tồn tại
                User newUser = new User();
                newUser.setEmail(email);
                newUser.setUsername(name);
                newUser.setSource(RegistrationSource.GOOGLE);
                String encodedPassword = bCryptPasswordEncoder.encode("123");
                newUser.setPassword(encodedPassword);
                newUser.setRoleUsers(userService.getRoleDefault().getRoleUsers());
                authService.saveUser(newUser);
//                Thread thread = new Thread(()->userService.sendAccount(name, email,"123"));
//                thread.start();
                return newUser;
            });

            // Tạo JWT token
           List<String> roleName = authService.getRoles(user);
            String jwt = jwtService.generateToken(user.getUsername());

            // Tạo đối tượng LoginResponeDTO để trả về
            LoginResponeDTO loginResponse = new LoginResponeDTO(200, "Success", jwt, "2Hours", roleName);

            // Thiết lập phản hồi JSON
            String redirectUrl = "http://localhost:3000/auth/oauth-callback?token=" + jwt + "&role=" + roleName;
            response.sendRedirect(redirectUrl);
        }
    }



}