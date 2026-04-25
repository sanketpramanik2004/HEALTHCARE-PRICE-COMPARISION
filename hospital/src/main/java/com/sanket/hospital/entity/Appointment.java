package com.sanket.hospital.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Data
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userName;

    private String serviceName;

    private LocalDate date;

    private LocalTime time;

    @Column(name = "status")
    private String status; // PENDING, CONFIRMED, REJECTED

    @ManyToOne
    @JoinColumn(name = "hospital_id")
    private Hospital hospital;
}