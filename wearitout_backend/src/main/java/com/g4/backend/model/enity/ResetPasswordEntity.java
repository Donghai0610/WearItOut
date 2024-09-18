package com.g4.backend.model.enity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "reset_password")
@JsonIgnoreProperties(ignoreUnknown = true)
public class ResetPasswordEntity {

    @Id
    @Column(name = "id")
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "password_reset_link", nullable = false)
    private String passwordResetLink;

    @Column(name = "create_at")
    private Date createAt;

    @Column(name = "create_by")
    private Long createBy;

    @Column(name = "update_at")
    private Date updateAt;

    @Column(name = "update_by")
    private Long updateBy;

    @Column(name = "delete_at")
    private Date deleteAt;

    @Column(name = "delete_by")
    private Long deleteBy;
}