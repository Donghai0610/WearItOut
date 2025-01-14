package com.g4.backend.repository;


import com.g4.backend.model.ImageProduct;
import com.g4.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImageProductRepository extends JpaRepository<ImageProduct, Long> {
    void deleteByProduct(Product product);
    List<ImageProduct> findByProduct(Product product);
}
