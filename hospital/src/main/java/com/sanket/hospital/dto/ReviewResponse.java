package com.sanket.hospital.dto;

import java.time.LocalDateTime;

public record ReviewResponse(
        Long id,
        Integer rating,
        String comment,
        LocalDateTime createdAt,
        Long appointmentId,
        ReviewerSummary user,
        SubjectSummary doctor,
        SubjectSummary hospital) {

    public record ReviewerSummary(
            Long id,
            String name) {
    }

    public record SubjectSummary(
            Long id,
            String name) {
    }
}
