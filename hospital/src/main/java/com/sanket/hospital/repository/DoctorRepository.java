package com.sanket.hospital.repository;

import com.sanket.hospital.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    List<Doctor> findByHospital_IdOrderBySpecializationAscNameAsc(Long hospitalId);

    List<Doctor> findBySpecializationContainingIgnoreCaseOrderByConsultationFeeAsc(String specialization);
}
