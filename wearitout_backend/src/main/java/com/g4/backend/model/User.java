package com.g4.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.g4.backend.utils.RegistrationSource;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Nationalized;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "\"user\"")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "username")
    private String username;

    @Column(name = "password",nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private  String password;

    private String firstName;

    private String lastName;

    @Column(name = "email",nullable = false,unique = true)
    private String email;

    private Boolean gender;

    @Nationalized
    private String address;

    private String phone;

    private String avatar;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDate createAt;

    @CreationTimestamp
    @Column(updatable = true)
    private LocalDate updateAt;

    @Column(length = 512)
    private String note;

    @Column(name = "is_active", nullable = false)
    private boolean isActive;

    @Column(name = "source")
    @Enumerated(EnumType.STRING)
    private RegistrationSource source;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonBackReference
    private Cart cart;


    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonBackReference
    private List<Order> orders;

    @ManyToOne (fetch = FetchType.EAGER,cascade = CascadeType.ALL)
    @JoinColumn(name = "setting_id", nullable = false,
            foreignKey = @ForeignKey(name = "FK_User_Setting")
    )
    @JsonBackReference
    private  Setting setting;

    @ManyToMany(fetch = FetchType.LAZY,cascade = {CascadeType.MERGE,CascadeType.PERSIST,CascadeType.REFRESH,CascadeType.DETACH})
    @JoinTable(
            name = "user_shop",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "shop_id")
    )
    @JsonBackReference
    private List<Shop> shops;

    @Override
    public int hashCode() {
        // Tránh gọi hashCode() của Cart để tránh vòng lặp
        return Objects.hash(userId);
    }

    @Override
    public String toString() {
        return "User{" +
                "userId=" + userId +
                '}';
    }

}
