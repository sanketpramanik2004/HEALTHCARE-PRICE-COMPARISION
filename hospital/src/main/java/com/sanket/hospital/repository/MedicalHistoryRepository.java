package com.sanket.hospital.repository;

import com.sanket.hospital.entity.MedicalHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MedicalHistoryRepository extends JpaRepository<MedicalHistory, Long> {

    List<MedicalHistory> findByUser_IdOrderByCreatedAtDesc(Long userId);
}
