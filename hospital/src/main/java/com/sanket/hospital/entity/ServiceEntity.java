package com.sanket.hospital.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class ServiceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String serviceName;
    private double price;

    @ManyToOne
    @JoinColumn(name = "hospital_id")
    private Hospital hospital;
}