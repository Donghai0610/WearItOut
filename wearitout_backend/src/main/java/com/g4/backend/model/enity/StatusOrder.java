package com.g4.backend.model.enity;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "status_order")
@JsonIgnoreProperties(ignoreUnknown = true)
public class StatusOrder {

    @Id
    @Column(name = "status_order_id")
    private int statusOrderId;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "create_at")
    private LocalDate createAt;

    @Column(name = "update_at")
    private LocalDate updateAt;

    @Column(name = "delete_at")
    private LocalDate deleteAt;

    @OneToOne(mappedBy = "statusOrder")
    @JsonBackReference
    private Order order;

}
