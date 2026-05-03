package com.sanket.hospital.repository;

import com.sanket.hospital.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    boolean existsByAppointment_Id(Long appointmentId);

    Optional<Review> findByAppointment_Id(Long appointmentId);

    List<Review> findByDoctor_IdOrderByCreatedAtDesc(Long doctorId);

    List<Review> findByHospital_IdOrderByCreatedAtDesc(Long hospitalId);

    List<Review> findByUser_IdOrderByCreatedAtDesc(Long userId);
}
