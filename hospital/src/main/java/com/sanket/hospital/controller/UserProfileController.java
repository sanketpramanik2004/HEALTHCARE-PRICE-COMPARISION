package com.sanket.hospital.controller;

import com.sanket.hospital.dto.UserProfileResponse;
import com.sanket.hospital.entity.MedicalHistory;
import com.sanket.hospital.service.UserProfileService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class UserProfileController {

    private final UserProfileService userProfileService;

    public UserProfileController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @GetMapping("/user/profile")
    public UserProfileResponse getProfile(HttpServletRequest request) {
        return userProfileService.getProfile((String) request.getAttribute("userEmail"));
    }

    @PutMapping("/user/profile")
    public UserProfileResponse updateProfile(
            @RequestBody Map<String, Object> payload,
            HttpServletRequest request) {
        return userProfileService.updateProfile((String) request.getAttribute("userEmail"), payload);
    }

    @GetMapping("/user/appointments")
    public Object getAppointmentHistory(HttpServletRequest request) {
        return userProfileService.getAppointmentHistory((String) request.getAttribute("userEmail"));
    }

    @PostMapping("/medical-history")
    public MedicalHistory addMedicalHistory(
            @RequestBody Map<String, Object> payload,
            HttpServletRequest request) {
        return userProfileService.addMedicalHistory((String) request.getAttribute("userEmail"), payload);
    }

    @GetMapping("/medical-history")
    public List<MedicalHistory> getMedicalHistory(HttpServletRequest request) {
        return userProfileService.getMedicalHistory((String) request.getAttribute("userEmail"));
    }

    @DeleteMapping("/medical-history/{id}")
    public Map<String, String> deleteMedicalHistory(
            @PathVariable Long id,
            HttpServletRequest request) {
        return userProfileService.deleteMedicalHistory((String) request.getAttribute("userEmail"), id);
    }
}
