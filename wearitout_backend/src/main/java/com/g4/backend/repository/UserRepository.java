package com.g4.backend.repository;

import com.g4.backend.model.enity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository  extends JpaRepository<User, Integer> {
    public User findUserByUsername(String username);
    Optional<User> findUserByEmail(String email);
    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
    Optional<User> findByUserId(Long userId);
}
