package com.g4.backend.config;

import com.g4.backend.dto.response.LoginResponeDTO;
import com.g4.backend.model.User;
import com.g4.backend.service.AuthService;
import com.g4.backend.service.JwtService;
import com.g4.backend.service.UserService;

import com.g4.backend.utils.RegistrationSource;
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
import java.util.Map;

@Component
public class OAuth2LoginSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {

    private final AuthService authService;
    private final UserService userService;
    private final JwtService jwtService;
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    public OAuth2LoginSuccessHandler(AuthService authService, UserService userService, @Lazy BCryptPasswordEncoder bCryptPasswordEncoder, JwtService jwtService) {
        this.authService = authService;
        this.userService = userService;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.jwtService = jwtService;
    }

    @Value("${frontend.url}")
    private String frontendUrl;

//    @Override
//    @Transactional
//    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws ServletException, IOException {
//
//        OAuth2AuthenticationToken oAuth2AuthenticationToken = (OAuth2AuthenticationToken) authentication;
//
//        // Handling login via Google
//        if ("google".equals(oAuth2AuthenticationToken.getAuthorizedClientRegistrationId())) {
//            DefaultOAuth2User principal = (DefaultOAuth2User) authentication.getPrincipal();
//            Map<String, Object> attributes = principal.getAttributes();
//
//            // Get email and name from Google attributes
//            String email = attributes.getOrDefault("email", "").toString();
//            String name = attributes.getOrDefault("name", "").toString();
//
//            // Check if user exists by email
//            authService.findUserByEmail(email)
//                    .ifPresentOrElse(user -> {
//                        // Fetch the role from the Setting object
//                        String roleName = (user.getSetting() != null) ? user.getSetting().getName() : "USER";
//
//
//                        DefaultOAuth2User newUser = new DefaultOAuth2User(List.of(new SimpleGrantedAuthority(roleName)),
//                                attributes, "sub");
//                        Authentication securityAuth = new OAuth2AuthenticationToken(newUser, List.of(new SimpleGrantedAuthority(roleName)),
//                                oAuth2AuthenticationToken.getAuthorizedClientRegistrationId());
//                        SecurityContextHolder.getContext().setAuthentication(securityAuth);
//                    }, () -> {
//                        // Create new user if not present
//                        User userEntity = new User();
//                        userEntity.setEmail(email);
//                        userEntity.setUsername(name);
//                        userEntity.setSource(RegistrationSource.GOOGLE);
//                        String encodedPassword = bCryptPasswordEncoder.encode("123");
//                        userEntity.setPassword(encodedPassword);
//                        Setting defaultSetting = userService.getDefaultSetting();  // Fetch default setting (could be ROLE_USER)
//                        userEntity.setSetting(defaultSetting);
//                        authService.saveUser(userEntity);
//
//                        // Fetch the role from the Setting object
//                        String roleName = defaultSetting.getName();  // Assuming 'name' is the role field in Setting
//
//                        DefaultOAuth2User newUser = new DefaultOAuth2User(List.of(new SimpleGrantedAuthority(roleName)),
//                                attributes, "sub");
//                        Authentication securityAuth = new OAuth2AuthenticationToken(newUser, List.of(new SimpleGrantedAuthority(roleName)),
//                                oAuth2AuthenticationToken.getAuthorizedClientRegistrationId());
//                        SecurityContextHolder.getContext().setAuthentication(securityAuth);
//                    });
//        }
//
//        // Redirect to frontend after login success
//        this.setAlwaysUseDefaultTargetUrl(true);
//        this.setDefaultTargetUrl(frontendUrl);
//        super.onAuthenticationSuccess(request, response, authentication);
//    }



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
                newUser.setSetting(userService.getDefaultSetting());
                authService.saveUser(newUser);
                Thread thread = new Thread(()->userService.sendAccount(name, email,"123"));
                thread.start();
                return newUser;
            });

            // Tạo JWT token
            String roleName = user.getSetting() != null ? user.getSetting().getName() : "USER";
            String jwt = jwtService.generateToken(user.getUsername());

            // Tạo đối tượng LoginResponeDTO để trả về
            LoginResponeDTO loginResponse = new LoginResponeDTO(200, "Success", jwt, "2Hours", roleName);

            // Thiết lập phản hồi JSON
            String redirectUrl = "http://localhost:3000/auth/oauth-callback?token=" + jwt + "&role=" + roleName;
            response.sendRedirect(redirectUrl);
        }
    }



}
