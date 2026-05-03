package com.sanket.hospital.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "hospital_id")
    private Hospital hospital;

    @JsonIgnore
    @OneToMany(mappedBy = "user")
    private List<MedicalHistory> medicalHistoryEntries = new ArrayList<>();
}
