package com.sanket.hospital.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String password;
    private String role;
    private Integer age;
    private String gender;
    private String phoneNumber;
    private String authProvider;

    @ManyToOne
    @JoinColumn(name = "hospital_id")
    private Hospital hospital;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToMany(mappedBy = "user")
    private List<MedicalHistory> medicalHistoryEntries = new ArrayList<>();
}
