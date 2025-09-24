package com.g4.backend.service;

import com.g4.backend.dto.request.LoginRequestDTO;
import com.g4.backend.dto.response.LoginResponeDTO;
import com.g4.backend.model.User;
import com.g4.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class AuthService implements UserDetailsService {
    private final UserRepository userRepository;
    private final UserService userService;
    private final JwtService jwtService;

    @Autowired
    public AuthService(UserRepository userRepository, UserService userService, @Lazy JwtService jwtService) {
        this.userRepository = userRepository;
        this.userService = userService;
        this.jwtService = jwtService;
    }

    public User findUserByUsername(String username) {
        return userRepository.findUserByUsername(username);
    }

    public Optional<User> findUserByEmail(String email) {
        return userRepository.findUserByEmail(email);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Fetch the user from the database
        User user = userRepository.findUserByUsername(username);

        if (user == null) {
            throw new UsernameNotFoundException(username);
        }

        // Fetch the user's role from the 'Setting' entity
        String roleName = user.getSetting().getName();

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                getAuthorities(roleName)
        );
    }

    private Collection<? extends GrantedAuthority> getAuthorities(String roleName) {
        // Convert the role name into GrantedAuthority
        return List.of(new SimpleGrantedAuthority("ROLE_" + roleName));
    }


    public User saveUser(User user) {
        return userRepository.save(user);
    }


//    public LoginResponeDTO handleGoogleLogin(OAuth2AuthenticationToken oAuth2AuthenticationToken) {
//        // Lấy thông tin từ OAuth2AuthenticationToken
//        DefaultOAuth2User principal = (DefaultOAuth2User) oAuth2AuthenticationToken.getPrincipal();
//        Map<String, Object> attributes = principal.getAttributes();
//
//        // Lấy email và tên từ attributes
//        String email = attributes.getOrDefault("email", "").toString();
//        String username = attributes.getOrDefault("name", "").toString();
//
//        // Kiểm tra xem người dùng đã tồn tại hay chưa
//        User user = findUserByEmail(email).orElse(null);
//
//        // Nếu người dùng không tồn tại, tạo mới
//        if (user == null) {
//            user = new User();
//            user.setEmail(email);
//            user.setUsername(username);
//            user.setSource(RegistrationSource.GOOGLE);
//            String encodedPassword = new BCryptPasswordEncoder().encode(PasswordGenerator.generateRandomPassword());
//            user.setPassword(encodedPassword);
//            user.setSetting(userService.getDefaultSetting());  // Lấy vai trò mặc định
//            saveUser(user);
//
//            // Gửi thông tin tài khoản qua email trong một thread riêng
//            Thread thread = new Thread(() -> {
//                userService.sendAccount(username, email, encodedPassword);
//            });
//            thread.start();
//        }
//
//        // Lấy role từ đối tượng Setting của người dùng
//        String role = user.getSetting().getName();
//
//        // Tạo token JWT và bao gồm cả vai trò
//        final String jwt = jwtServices.generateToken(user.getUsername());
//
//        // Trả về phản hồi với JWT và role
//        return new LoginResponeDTO(200, "Success", jwt, "2Hours", role);
//    }


}
