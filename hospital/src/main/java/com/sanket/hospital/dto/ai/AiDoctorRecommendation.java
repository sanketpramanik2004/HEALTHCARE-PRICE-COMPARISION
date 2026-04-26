package com.sanket.hospital.dto.ai;

import java.util.List;

public record AiDoctorRecommendation(
        String doctorSpecialization,
        List<String> serviceKeywords,
        String reasoningSummary,
        String source) {
}
