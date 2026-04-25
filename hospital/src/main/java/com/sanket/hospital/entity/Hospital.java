package com.sanket.hospital.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Hospital {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String location;
    private double latitude;
    private double longitude;
    private double rating;
}