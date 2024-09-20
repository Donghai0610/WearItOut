package com.g4.backend.service;

import com.g4.backend.model.enity.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.List;

public interface SecurityService extends UserDetailsService {
    public User findUserByUsername(String username);
    UserDetails loadUserByUsername(String username) throws UsernameNotFoundException;
    List<String> getRoles(User user);
}
