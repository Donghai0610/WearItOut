package com.g4.backend.model.enity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "products")
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProductEntity {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "size")
    private Long size;

    @Column(name = "product_name")
    private String productName;

    @Column(name = "description")
    private String description;

    @Column(name = "price")
    private Long price;

    @Column(name = "stock_quantity")
    private Long stockQuantity;

    @Column(name = "solded")
    private Long solded;

    @Column(name = "codidtion")
    private Long codidtion;

    @Column(name = "is_delete")
    private Long isDelete;

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
