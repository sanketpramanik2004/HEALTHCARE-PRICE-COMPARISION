package com.sanket.hospital.service;

import com.sanket.hospital.dto.UserProfileResponse;
import com.sanket.hospital.entity.MedicalHistory;
import com.sanket.hospital.entity.User;
import com.sanket.hospital.repository.AppointmentRepository;
import com.sanket.hospital.repository.MedicalHistoryRepository;
import com.sanket.hospital.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@Service
public class UserProfileService {

    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;
    private final MedicalHistoryRepository medicalHistoryRepository;

    public UserProfileService(
            UserRepository userRepository,
            AppointmentRepository appointmentRepository,
            MedicalHistoryRepository medicalHistoryRepository) {
        this.userRepository = userRepository;
        this.appointmentRepository = appointmentRepository;
        this.medicalHistoryRepository = medicalHistoryRepository;
    }

    public UserProfileResponse getProfile(String email) {
        return toResponse(requireUser(email));
    }

    public UserProfileResponse updateProfile(String email, Map<String, Object> payload) {
        User user = requireUser(email);

        String name = String.valueOf(payload.getOrDefault("name", user.getName())).trim();
        String phoneNumber = String.valueOf(payload.getOrDefault("phoneNumber", user.getPhoneNumber() == null ? "" : user.getPhoneNumber())).trim();
        String gender = String.valueOf(payload.getOrDefault("gender", user.getGender() == null ? "" : user.getGender())).trim();
        Integer age = payload.get("age") == null || String.valueOf(payload.get("age")).isBlank()
                ? user.getAge()
                : Integer.parseInt(String.valueOf(payload.get("age")));

        user.setName(name.isBlank() ? user.getName() : name);
        user.setPhoneNumber(phoneNumber);
        user.setGender(gender);
        user.setAge(age);

        return toResponse(userRepository.save(user));
    }

    public List<MedicalHistory> getMedicalHistory(String email) {
        User user = requireUser(email);
        return medicalHistoryRepository.findByUser_IdOrderByCreatedAtDesc(user.getId());
    }

    public MedicalHistory addMedicalHistory(String email, Map<String, Object> payload) {
        User user = requireUser(email);
        String condition = String.valueOf(payload.getOrDefault("condition", "")).trim();
        String notes = String.valueOf(payload.getOrDefault("notes", "")).trim();

        if (condition.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Medical condition is required.");
        }

        MedicalHistory history = new MedicalHistory();
        history.setUser(user);
        history.setCondition(condition);
        history.setNotes(notes);
        return medicalHistoryRepository.save(history);
    }

    public Map<String, String> deleteMedicalHistory(String email, Long historyId) {
        User user = requireUser(email);
        MedicalHistory history = medicalHistoryRepository.findById(historyId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Medical history entry not found."));

        if (!history.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only remove your own medical history.");
        }

        medicalHistoryRepository.delete(history);
        return Map.of("message", "Medical history entry deleted.");
    }

    public Object getAppointmentHistory(String email) {
        User user = requireUser(email);
        return appointmentRepository.findByUser_IdOrderByDateDescTimeDesc(user.getId());
    }

    public User requireUser(String email) {
        if (email == null || email.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Please sign in first.");
        }
        User user = userRepository.findByEmail(email.trim().toLowerCase());
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found.");
        }
        return user;
    }

    private UserProfileResponse toResponse(User user) {
        return new UserProfileResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getAge(),
                user.getGender(),
                user.getPhoneNumber());
    }
}
