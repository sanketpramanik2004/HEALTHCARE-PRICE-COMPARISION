package com.sanket.hospital.dto;

public record UserProfileResponse(
        Long id,
        String name,
        String email,
        String role,
        Integer age,
        String gender,
        String phoneNumber) {
}
