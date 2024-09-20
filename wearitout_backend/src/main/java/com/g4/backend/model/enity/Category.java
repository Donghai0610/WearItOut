package com.g4.backend.model.enity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "categories")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private int categoryId;

    @Column(name = "category_name", nullable = false)
    private String categoryName;

    @Column(name = "is_delete")
    private boolean isDelete;

    @Column(name = "create_at")
    private LocalDate createAt;

    @Column(name = "update_at")
    private LocalDate updateAt;

    @Column(name = "delete_at")
    private LocalDate deleteAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "create_by",referencedColumnName = "user_id", nullable = false,
            foreignKey = @ForeignKey(name = "FK_Category_User_CreateBy")
    )
    @JsonBackReference
    private User createBy;

    @OneToMany(mappedBy = "category", fetch = FetchType.LAZY,cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH},orphanRemoval = true)
    @JsonBackReference
    private List<CategoryProduct> categoryProducts;
}
