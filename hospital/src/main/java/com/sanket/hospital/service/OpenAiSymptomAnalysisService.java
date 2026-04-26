package com.sanket.hospital.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sanket.hospital.dto.ai.AiDoctorRecommendation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class OpenAiSymptomAnalysisService {

    private static final Logger logger = LoggerFactory.getLogger(OpenAiSymptomAnalysisService.class);

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    @Value("${openai.api.key:}")
    private String apiKey;

    @Value("${openai.api.model:gpt-4o-mini}")
    private String model;

    @Value("${openai.api.url:https://api.openai.com/v1/chat/completions}")
    private String apiUrl;

    public OpenAiSymptomAnalysisService() {
        this.restClient = RestClient.create();
        this.objectMapper = new ObjectMapper();
    }

    public AiDoctorRecommendation recommendDoctor(String symptoms) {
        String normalizedSymptoms = symptoms == null ? "" : symptoms.trim();
        if (normalizedSymptoms.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Symptoms are required.");
        }

        if (apiKey == null || apiKey.isBlank()) {
            return fallbackRecommendation(normalizedSymptoms, "fallback_no_api_key");
        }

        try {
            Map<String, Object> body = Map.of(
                    "model", model,
                    "temperature", 0.2,
                    "messages", List.of(
                            Map.of(
                                    "role", "system",
                                    "content",
                                    "You are a healthcare triage assistant. You are not diagnosing diseases. Based on symptoms, recommend the most likely doctor specialization and related hospital service keywords. Also provide one short explanation of why this specialization fits. Return only valid JSON."),
                            Map.of(
                                    "role", "user",
                                    "content",
                                    "Symptoms: " + normalizedSymptoms
                                            + "\nReturn JSON exactly in this shape:"
                                            + "\n{\"doctorSpecialization\":\"...\",\"serviceKeywords\":[\"...\",\"...\"],\"reasoningSummary\":\"...\"}"
                                            + "\nKeep service keywords short and practical for hospital service search.")));

            String rawResponse = restClient.post()
                    .uri(apiUrl)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(String.class);

            return parseOpenAiResponse(rawResponse, normalizedSymptoms);
        } catch (Exception ex) {
            logger.warn("OpenAI recommendation failed, using fallback mapping.", ex);
            return fallbackRecommendation(normalizedSymptoms, "fallback_on_error");
        }
    }

    private AiDoctorRecommendation parseOpenAiResponse(String rawResponse, String symptoms) {
        try {
            JsonNode root = objectMapper.readTree(rawResponse);
            String content = root.path("choices").path(0).path("message").path("content").asText("");
            if (content.isBlank()) {
                return fallbackRecommendation(symptoms, "fallback_empty_ai_response");
            }

            JsonNode json = objectMapper.readTree(content);
            String doctor = json.path("doctorSpecialization").asText("").trim();
            String reasoningSummary = json.path("reasoningSummary").asText("").trim();

            Set<String> keywords = new LinkedHashSet<>();
            if (json.path("serviceKeywords").isArray()) {
                for (JsonNode node : json.path("serviceKeywords")) {
                    String keyword = node.asText("").trim();
                    if (!keyword.isBlank()) {
                        keywords.add(keyword);
                    }
                }
            }

            if (doctor.isBlank() || keywords.isEmpty()) {
                return fallbackRecommendation(symptoms, "fallback_incomplete_ai_response");
            }

            if (reasoningSummary.isBlank()) {
                reasoningSummary = "Symptoms pattern suggests this specialist is the most relevant first point of care.";
            }

            return new AiDoctorRecommendation(doctor, new ArrayList<>(keywords), reasoningSummary, "openai");
        } catch (Exception ex) {
            logger.warn("Failed to parse OpenAI response, using fallback mapping.", ex);
            return fallbackRecommendation(symptoms, "fallback_parse_error");
        }
    }

    private AiDoctorRecommendation fallbackRecommendation(String symptoms, String source) {
        String lower = symptoms.toLowerCase();

        if (containsAny(lower, "chest", "heart", "bp", "pressure", "palpitation")) {
            return new AiDoctorRecommendation(
                    "Cardiologist",
                    List.of("ECG", "ECHO", "Cardiology Consultation"),
                    "Chest or heart-related symptoms are usually evaluated first by a cardiologist.",
                    source);
        }
        if (containsAny(lower, "skin", "rash", "acne", "itch", "allergy")) {
            return new AiDoctorRecommendation("Dermatologist",
                    List.of("Dermatology Consultation", "Allergy Test"),
                    "Skin irritation, rash, and allergy-like symptoms align with dermatology care.",
                    source);
        }
        if (containsAny(lower, "bone", "joint", "knee", "fracture", "back pain")) {
            return new AiDoctorRecommendation("Orthopedic",
                    List.of("Orthopedic Consultation", "X-Ray", "Physiotherapy"),
                    "Bone, joint, and movement pain symptoms are typically handled by orthopedics.",
                    source);
        }
        if (containsAny(lower, "headache", "migraine", "seizure", "neuro", "dizziness")) {
            return new AiDoctorRecommendation(
                    "Neurologist",
                    List.of("Neurology Consultation", "MRI"),
                    "Neurological symptoms like severe headache, dizziness, or seizures fit neurology review.",
                    source);
        }
        if (containsAny(lower, "cough", "breath", "asthma", "lung", "fever")) {
            return new AiDoctorRecommendation("Pulmonologist",
                    List.of("Chest X-Ray", "Pulmonology Consultation", "CBC"),
                    "Breathing and chest-respiratory symptoms are commonly evaluated by pulmonology.",
                    source);
        }
        if (containsAny(lower, "stomach", "gas", "acidity", "vomit", "abdomen")) {
            return new AiDoctorRecommendation("Gastroenterologist",
                    List.of("Gastro Consultation", "Endoscopy", "Ultrasound"),
                    "Digestive and abdominal discomfort symptoms point to gastroenterology.",
                    source);
        }

        return new AiDoctorRecommendation(
                "General Physician",
                List.of("General Consultation", "CBC", "Health Checkup"),
                "Symptoms are broad, so starting with a general physician is a safe first step.",
                source);
    }

    private boolean containsAny(String text, String... options) {
        for (String option : options) {
            if (text.contains(option)) {
                return true;
            }
        }
        return false;
    }
}
