package com.g4.backend.model.enity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "categories")
@JsonIgnoreProperties(ignoreUnknown = true)
public class CategoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "category_name", nullable = false)
    private String categoryName;

    @Column(name = "is_delete")
    private Boolean isDelete;

    @Column(name = "create_at")
    private Date createAt;

    @Column(name = "update_at")
    private Date updateAt;

    @Column(name = "delete_at")
    private Date deleteAt;

    @Column(name = "create_by")
    private Long createBy;

    @Column(name = "delete_by")
    private Long deleteBy;

    @Column(name = "update_by")
    private Long updateBy;
}
