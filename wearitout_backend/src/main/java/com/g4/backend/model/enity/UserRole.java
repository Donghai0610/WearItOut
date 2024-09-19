package com.g4.backend.model.enity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.g4.backend.model.enity.Key.KeyRoleUser;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "users_roles")
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserRole {
    @EmbeddedId
    KeyRoleUser keyRoleUser;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id", nullable = false,
            foreignKey = @ForeignKey(name = "FK_RoleUser_Role")
    )
    @MapsId(value = "roleId")
    @JsonBackReference
    private Role role;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false,
            foreignKey = @ForeignKey(name = "FK_RoleUser_User")
    )
    @MapsId(value = "userId")
    @JsonBackReference
    private User user;
//Common properties
}
