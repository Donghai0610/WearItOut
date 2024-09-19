package com.g4.backend.model.enity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Nationalized;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "user")
public class User {
    @Id
    @Column(name = "user_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int userId;

    @Column(name = "username", nullable = false)
    private String username;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "full_name")
    @Nationalized
    private String fullName;

    @Column(name = "phone_number", columnDefinition = "varchar(255) character set utf8 not null DEFAULT ' ' ")
    @Nationalized
    private String phoneNumber;

    @Column(name = "address", nullable = true)
    @Nationalized
    private String address;

    @Column(name = "avatar")
    private String avatar;

    @Column(name = "balance")
    private String balance;

    @Column(name = "gender", nullable = false)
    private boolean gender;

    @Column(name = "dob", nullable = false)
    private LocalDate dob;

    @Column(name = "is_active", nullable = false)
    private boolean isActive;

    @Column(name = "is_delete")
    private boolean isDelete;

    @Column(name = "create_at")
    private LocalDate createAt;

    @Column(name = "update_at")
    private LocalDate updateAt;

    @Column(name = "delete_at")
    private LocalDate deleteAt;

    //Mapper relation auth_token
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference
    private List<AuthToken> authTokenEntities;

    //Mapper relation ResetPassword
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference
    private List<ResetPassword> resetPasswordEntities;

    //Role
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference
    private List<UserRole> roleUsers;

//Product
    @OneToMany(mappedBy = "createBy", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference
    private List<Product> products;


    //Order
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference
    private List<Order> orders;
}
