package com.sanket.hospital.controller;

import com.sanket.hospital.dto.ai.AiDoctorSuggestionResponse;
import com.sanket.hospital.service.AiRecommendationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ai")
@CrossOrigin(origins = "*")
public class AiController {

    private final AiRecommendationService aiRecommendationService;

    public AiController(AiRecommendationService aiRecommendationService) {
        this.aiRecommendationService = aiRecommendationService;
    }

    @GetMapping("/recommendDoctor")
    public ResponseEntity<AiDoctorSuggestionResponse> recommendDoctor(@RequestParam String symptoms) {
        return ResponseEntity.ok(aiRecommendationService.recommendDoctorAndHospitals(symptoms));
    }
}
