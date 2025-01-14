package com.g4.backend.repository;


import com.g4.backend.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    User findUserByUsername(String username);

    Optional<User> findUserByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    Optional<User> findByUserId(Long userId);

    @Query("SELECT distinct u FROM User u " +
            "LEFT JOIN u.shops s " +
            "LEFT JOIN u.setting st " +
            "WHERE " +
            "(:keyword IS NULL OR LOWER(u.username) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(u.phone) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(st.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(s.name) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND (:role IS NULL OR LOWER(st.name) LIKE LOWER(CONCAT('%', :role, '%'))) " +
            "AND (:isActive IS NULL OR u.isActive = :isActive) " +
            "AND (:shop IS NULL OR LOWER(s.name) LIKE LOWER(CONCAT('%', :shop, '%')))" +
            "ORDER BY u.userId DESC")
    Page<User> searchByAllFields(@Param("keyword") String keyword,
                                 @Param("role") String role,
                                 @Param("isActive") Boolean isActive,
                                 @Param("shop") String shop,
                                 Pageable pageable);

    @Query("SELECT u.userId, u.username FROM User u  WHERE u.setting.settingId = :settingId")
    List<Object[]> findAllBySettingId(@Param("settingId") Long settingId);


    @Modifying
    @Query("UPDATE User u SET u.isActive = CASE WHEN u.isActive = true THEN false ELSE true END WHERE u.userId = :userId")
    void toggleIsActiveById(@Param("userId") Long userId);

    @Query("SELECT u FROM User u " +
            " LEFT JOIN u.shops s" +
            " LEFT JOIN u.setting st" +
            " WHERE s.shopId = :shopId" +
            " AND st.name = 'SELLER'")
    User getShopSeller(Long shopId);

}