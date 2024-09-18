package com.g4.backend.model.enity;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "status_order")
@JsonIgnoreProperties(ignoreUnknown = true)
public class StatusOrderEntity {

    @Id
    @Column(name = "id")
    private Long id;

    @Column(name = "status", nullable = false)
    private Long status;

    @Column(name = "create_at")
    private Date createAt;

    @Column(name = "creat_by")
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
