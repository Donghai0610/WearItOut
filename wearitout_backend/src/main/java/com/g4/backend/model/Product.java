package com.g4.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "product")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long id;

    private String productName;

    @Column(length = 65535)
    private String description;

    private Double price;

    private Integer stockQuantity;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<ImageProduct> image ;

    private Boolean status;

    private Double rating;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "setting_id", nullable = false,
            foreignKey = @ForeignKey(name = "FK_Product_Setting")
    )
    @JsonBackReference
    private Setting setting;

    @ManyToOne
    @JoinColumn(name = "shopId")
    @JsonBackReference
    private Shop shop;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    @JsonBackReference
    private List<OrderDetail> orderDetails;

    @ManyToMany(mappedBy = "products")
    @JsonBackReference
    private List<Cart> carts;
}
