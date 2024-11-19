package com.g4.backend.repository;

import com.g4.backend.model.enity.Role;
import com.g4.backend.model.enity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserRoleRepository extends JpaRepository<UserRole, Integer> {
    @Query("SELECT ru.role FROM UserRole ru WHERE ru.user.userId = :userId")
    List<Role> findRolesByUserId(@Param("userId") int userId);

}
