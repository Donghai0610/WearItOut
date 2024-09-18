package com.g4.backend.model.enity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "users_roles")
@JsonIgnoreProperties(ignoreUnknown = true)
public class UserRoleEntity {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "role_id")
    private Long roleId;

    @Column(name = "create_by")
    private Long createBy;

    @Column(name = "create_at")
    private Date createAt;

    @Column(name = "update_at")
    private Date updateAt;

    @Column(name = "update_by")
    private Long updateBy;

    @Column(name = "delete_by")
    private Long deleteBy;

    @Column(name = "delete_at")
    private Date deleteAt;
}
