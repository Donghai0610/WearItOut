package com.g4.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "shop")
public class Shop {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "shop_id")
    private Long shopId;

    private String name;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createAt;

    private Boolean status;

    private Double rating;

    private String address;

    @Column(length = 512)
    private String note;

    @Column(name = "bank_account")
    private String bankAccount;

    @Column(name = "bank_name")
    private String bankName;

    @OneToMany(mappedBy = "shop", cascade = CascadeType.ALL)
    @JsonBackReference
    private List<Product> products;

    @OneToMany(mappedBy = "shop", cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH})
    @JsonBackReference
    private List<Order> orders;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "setting_id", nullable = false,
            foreignKey = @ForeignKey(name = "FK_Shop_Setting")
    )
    @JsonBackReference
    private Setting setting;

    @ManyToMany(mappedBy = "shops", fetch = FetchType.LAZY,cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH})
    private List<User> users;

}
