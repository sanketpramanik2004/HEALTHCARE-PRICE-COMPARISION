package com.sanket.hospital.dto;

public record DoctorResponse(
        Long id,
        String name,
        String specialization,
        Integer experience,
        double consultationFee,
        String availability,
        double distanceKm,
        HospitalSummary hospital) {

    public record HospitalSummary(
            Long id,
            String name,
            String location,
            double latitude,
            double longitude,
            double rating) {
    }
}
