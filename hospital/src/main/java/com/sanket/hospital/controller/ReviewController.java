package com.sanket.hospital.controller;

import com.sanket.hospital.dto.ReviewResponse;
import com.sanket.hospital.service.ReviewService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(
            @RequestBody Map<String, Object> payload,
            HttpServletRequest request) {
        String userEmail = (String) request.getAttribute("userEmail");
        return ResponseEntity.status(HttpStatus.CREATED).body(reviewService.createReview(payload, userEmail));
    }

    @GetMapping("/doctor/{doctorId}")
    public List<ReviewResponse> getDoctorReviews(@PathVariable Long doctorId) {
        return reviewService.getDoctorReviews(doctorId);
    }

    @GetMapping("/hospital/{hospitalId}")
    public List<ReviewResponse> getHospitalReviews(@PathVariable Long hospitalId) {
        return reviewService.getHospitalReviews(hospitalId);
    }

    @GetMapping("/doctor/{doctorId}/summary")
    public Map<String, Object> getDoctorRatingSummary(@PathVariable Long doctorId) {
        return reviewService.getDoctorRatingSummary(doctorId);
    }

    @GetMapping("/hospital/{hospitalId}/summary")
    public Map<String, Object> getHospitalRatingSummary(@PathVariable Long hospitalId) {
        return reviewService.getHospitalRatingSummary(hospitalId);
    }

    @GetMapping("/mine")
    public List<ReviewResponse> getUserReviews(HttpServletRequest request) {
        String userEmail = (String) request.getAttribute("userEmail");
        return reviewService.getUserReviews(userEmail);
    }
}
