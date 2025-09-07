package com.g4.backend.service;

import com.g4.backend.model.User;
import com.g4.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

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





}
