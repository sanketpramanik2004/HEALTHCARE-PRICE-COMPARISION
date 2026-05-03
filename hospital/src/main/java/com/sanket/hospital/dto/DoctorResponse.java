package com.sanket.hospital.dto;

public record DoctorResponse(
        Long id,
        String name,
        String specialization,
        Integer experience,
        double consultationFee,
        double averageRating,
        Integer reviewCount,
        String availability,
        double distanceKm,
        HospitalSummary hospital) {

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
