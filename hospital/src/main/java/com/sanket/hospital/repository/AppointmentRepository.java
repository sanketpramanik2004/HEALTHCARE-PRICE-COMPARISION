package com.sanket.hospital.repository;

import java.util.List;
import java.time.LocalDate;
import java.time.LocalTime;
import com.sanket.hospital.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByHospital_Id(Long hospitalId);

    List<Appointment> findByUserEmailOrderByDateDescTimeDesc(String userEmail);

    boolean existsByHospital_IdAndServiceNameIgnoreCaseAndDateAndTimeAndStatusIn(
            Long hospitalId,
            String serviceName,
            LocalDate date,
            LocalTime time,
            List<String> statuses);

    boolean existsByDoctor_IdAndDateAndTimeAndStatusIn(
            Long doctorId,
            LocalDate date,
            LocalTime time,
            List<String> statuses);

    boolean existsByDoctor_IdAndStatusIn(
            Long doctorId,
            List<String> statuses);

}
