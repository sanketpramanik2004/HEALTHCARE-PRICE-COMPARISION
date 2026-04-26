package com.sanket.hospital.controller;

import com.sanket.hospital.dto.DoctorResponse;
import com.sanket.hospital.entity.Doctor;
import com.sanket.hospital.service.DoctorService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @GetMapping("/doctors")
    public List<DoctorResponse> getDoctors(
            @RequestParam String specialization,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lon) {
        return doctorService.searchDoctors(specialization, lat, lon);
    }

    @GetMapping("/hospitals/{hospitalId}/doctors")
    public List<DoctorResponse> getDoctorsByHospital(@PathVariable Long hospitalId) {
        return doctorService.getDoctorsByHospital(hospitalId);
    }

    @PostMapping("/doctors")
    public ResponseEntity<?> addDoctor(@RequestBody Map<String, Object> payload, HttpServletRequest request) {
        Long hospitalId = (Long) request.getAttribute("hospitalId");
        if (hospitalId == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Hospital admin account required."));
        }

        Doctor created = doctorService.addDoctorForHospital(payload, hospitalId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @DeleteMapping("/doctors/{id}")
    public ResponseEntity<?> deleteDoctor(@PathVariable Long id, HttpServletRequest request) {
        Long hospitalId = (Long) request.getAttribute("hospitalId");
        if (hospitalId == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Hospital admin account required."));
        }

        return ResponseEntity.ok(doctorService.deleteDoctorForHospital(id, hospitalId));
    }

    @GetMapping("/doctors/{id}/availableSlots")
    public List<LocalTime> getDoctorAvailableSlots(
            @PathVariable Long id,
            @RequestParam String slotDate) {
        return doctorService.getAvailableSlotsForDoctor(id, LocalDate.parse(slotDate));
    }
}
