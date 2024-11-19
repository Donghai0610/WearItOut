package com.g4.backend.web.rest;

import com.g4.backend.model.dto.reponse.LoginResponeDTO;
import com.g4.backend.model.dto.request.LoginRequestDTO;
import com.g4.backend.model.enity.User;
import com.g4.backend.service.AuthService;
import com.g4.backend.service.UserService;
import com.g4.backend.service.impl.JWTServiceImpl;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {
    private final AuthService authService;
    private final JWTServiceImpl jwtService;
    private final AuthenticationManager authenticationManager;
    private  final UserService userService;

    @Autowired
    public AuthenticationController(AuthService authService, JWTServiceImpl jwtService, AuthenticationManager authenticationManager, UserService userService) {
        this.authService = authService;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequest) {

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );
            User user = authService.findUserByUsername(loginRequest.getUsername());
            // Nếu xác thực thành công, tạo token JWT
            if (!user.isActive()) {
                return ResponseEntity.badRequest().body(new LoginResponeDTO(401, "User is not active", "", "", null));
            }
            if (authentication.isAuthenticated()) {
                final String jwt = jwtService.generateToken(loginRequest.getUsername());

                return ResponseEntity.ok(new LoginResponeDTO(200, "Success", jwt,  "2Hours", authService.getRoles(user)));
            }
        } catch (AuthenticationException e) {
            // Xác thực không thành công, trả về lỗi hoặc thông báo
            return ResponseEntity.badRequest().body(new LoginResponeDTO(400, "Invalid username/password. Please try again.", "", "", null));
        }
        return ResponseEntity.badRequest().body("");
    }
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String token) {
        // Trích xuất token JWT từ header
        String jwt = token.substring(7); // Bỏ qua tiền tố "Bearer "
        boolean isTokenInvalidated = jwtService.invalidateToken(jwt);

        if (isTokenInvalidated) {
            return ResponseEntity.ok().body(new LoginResponeDTO(200, "Logout success", "", "", null ));
        } else {
            return ResponseEntity.badRequest().body(new LoginResponeDTO(400, "Logout fail", "", "", null));
        }
    }

}
