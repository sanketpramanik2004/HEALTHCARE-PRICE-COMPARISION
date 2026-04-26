package com.sanket.hospital.service;

import com.sanket.hospital.dto.DoctorResponse;
import com.sanket.hospital.dto.ai.AiDoctorRecommendation;
import com.sanket.hospital.dto.ai.AiDoctorSuggestionResponse;
import com.sanket.hospital.entity.ServiceEntity;
import com.sanket.hospital.repository.ServiceRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class AiRecommendationService {

    private final OpenAiSymptomAnalysisService openAiSymptomAnalysisService;
    private final ServiceRepository serviceRepository;
    private final DoctorService doctorService;

    public AiRecommendationService(
            OpenAiSymptomAnalysisService openAiSymptomAnalysisService,
            ServiceRepository serviceRepository,
            DoctorService doctorService) {
        this.openAiSymptomAnalysisService = openAiSymptomAnalysisService;
        this.serviceRepository = serviceRepository;
        this.doctorService = doctorService;
    }

    public AiDoctorSuggestionResponse recommendDoctorAndHospitals(String symptoms, Double lat, Double lon) {
        AiDoctorRecommendation recommendation = openAiSymptomAnalysisService.recommendDoctor(symptoms);
        List<DoctorResponse> doctorSuggestions = doctorService.searchDoctors(
                recommendation.doctorSpecialization(),
                lat,
                lon);

        Map<Long, ServiceEntity> uniqueMatches = new LinkedHashMap<>();
        for (String keyword : recommendation.serviceKeywords()) {
            if (keyword == null || keyword.isBlank()) {
                continue;
            }

            List<ServiceEntity> matches = serviceRepository.findByServiceNameContainingIgnoreCaseOrderByPriceAsc(keyword);
            for (ServiceEntity match : matches) {
                uniqueMatches.putIfAbsent(match.getId(), match);
            }
        }

        List<AiDoctorSuggestionResponse.HospitalServiceSuggestion> suggestions = uniqueMatches.values()
                .stream()
                .sorted(Comparator.comparingDouble(ServiceEntity::getPrice))
                .limit(25)
                .map(service -> new AiDoctorSuggestionResponse.HospitalServiceSuggestion(
                        service.getId(),
                        service.getServiceName(),
                        service.getPrice(),
                        new AiDoctorSuggestionResponse.HospitalSummary(
                                service.getHospital().getId(),
                                service.getHospital().getName(),
                                service.getHospital().getLocation(),
                                service.getHospital().getLatitude(),
                                service.getHospital().getLongitude(),
                                service.getHospital().getRating())))
                .toList();

        return new AiDoctorSuggestionResponse(
                symptoms.trim(),
                recommendation.doctorSpecialization(),
                recommendation.reasoningSummary(),
                recommendation.serviceKeywords(),
                doctorSuggestions,
                suggestions,
                recommendation.source(),
                "AI suggestions are informational and not a medical diagnosis.");
    }
}
