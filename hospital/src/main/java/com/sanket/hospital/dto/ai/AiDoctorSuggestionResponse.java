package com.sanket.hospital.dto.ai;

import com.sanket.hospital.dto.DoctorResponse;
import java.util.List;

public record AiDoctorSuggestionResponse(
        String symptoms,
        String recommendedDoctor,
        String reasoningSummary,
        List<String> suggestedServices,
        List<DoctorResponse> doctorSuggestions,
        List<HospitalServiceSuggestion> hospitalSuggestions,
        String recommendationSource,
        String note) {

    public record HospitalServiceSuggestion(
            Long serviceId,
            String serviceName,
            double price,
            HospitalSummary hospital) {
    }

    public record HospitalSummary(
            Long id,
            String name,
            String location,
            double latitude,
            double longitude,
            double rating,
            Integer reviewCount) {
    }
}
