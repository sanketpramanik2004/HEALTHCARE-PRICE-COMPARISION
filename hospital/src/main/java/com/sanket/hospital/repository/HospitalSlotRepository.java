package com.sanket.hospital.repository;

import com.sanket.hospital.entity.HospitalSlot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface HospitalSlotRepository extends JpaRepository<HospitalSlot, Long> {

    List<HospitalSlot> findByHospital_IdOrderBySlotDateAscSlotTimeAsc(Long hospitalId);

    List<HospitalSlot> findByHospital_IdAndServiceNameIgnoreCaseAndSlotDateAndActiveTrueOrderBySlotTimeAsc(
            Long hospitalId,
            String serviceName,
            LocalDate slotDate);

    Optional<HospitalSlot> findByHospital_IdAndServiceNameIgnoreCaseAndSlotDateAndSlotTimeAndActiveTrue(
            Long hospitalId,
            String serviceName,
            LocalDate slotDate,
            LocalTime slotTime);
}
