package com.sanket.hospital.service;

import com.sanket.hospital.dto.ReviewResponse;
import com.sanket.hospital.entity.Appointment;
import com.sanket.hospital.entity.Doctor;
import com.sanket.hospital.entity.Hospital;
import com.sanket.hospital.entity.Review;
import com.sanket.hospital.entity.User;
import com.sanket.hospital.repository.AppointmentRepository;
import com.sanket.hospital.repository.DoctorRepository;
import com.sanket.hospital.repository.HospitalRepository;
import com.sanket.hospital.repository.ReviewRepository;
import com.sanket.hospital.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final HospitalRepository hospitalRepository;

    public ReviewService(
            ReviewRepository reviewRepository,
            AppointmentRepository appointmentRepository,
            UserRepository userRepository,
            DoctorRepository doctorRepository,
            HospitalRepository hospitalRepository) {
        this.reviewRepository = reviewRepository;
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
        this.hospitalRepository = hospitalRepository;
    }

    public ReviewResponse createReview(Map<String, Object> payload, String userEmail) {
        User user = requireUser(userEmail);
        Long appointmentId = readLong(payload.get("appointmentId"), "Appointment is required.");
        Integer rating = readInteger(payload.get("rating"), "Rating is required.");
        String comment = String.valueOf(payload.getOrDefault("comment", "")).trim();

        if (rating < 1 || rating > 5) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rating must be between 1 and 5.");
        }

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Appointment not found."));

        if (appointment.getUser() == null || !appointment.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only review your own appointments.");
        }

        if (!"COMPLETED".equalsIgnoreCase(appointment.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Reviews are allowed only after appointment completion.");
        }

        if (reviewRepository.existsByAppointment_Id(appointmentId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "A review already exists for this appointment.");
        }

        Review review = new Review();
        review.setUser(user);
        review.setAppointment(appointment);
        review.setRating(rating);
        review.setComment(comment);

        if (appointment.getDoctor() != null) {
            review.setDoctor(appointment.getDoctor());
        } else if (appointment.getHospital() != null) {
            review.setHospital(appointment.getHospital());
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Appointment review target could not be determined.");
        }

        Review saved = reviewRepository.save(review);
        refreshRatingSummaries(saved.getDoctor(), saved.getHospital());
        return toResponse(saved);
    }

    public List<ReviewResponse> getDoctorReviews(Long doctorId) {
        return reviewRepository.findByDoctor_IdOrderByCreatedAtDesc(doctorId).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<ReviewResponse> getHospitalReviews(Long hospitalId) {
        return reviewRepository.findByHospital_IdOrderByCreatedAtDesc(hospitalId).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<ReviewResponse> getUserReviews(String userEmail) {
        User user = requireUser(userEmail);
        return reviewRepository.findByUser_IdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    public Map<String, Object> getDoctorRatingSummary(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Doctor not found."));
        return Map.of(
                "doctorId", doctor.getId(),
                "averageRating", doctor.getAverageRating(),
                "reviewCount", doctor.getReviewCount() == null ? 0 : doctor.getReviewCount());
    }

    public Map<String, Object> getHospitalRatingSummary(Long hospitalId) {
        Hospital hospital = hospitalRepository.findById(hospitalId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Hospital not found."));
        return Map.of(
                "hospitalId", hospital.getId(),
                "averageRating", hospital.getRating(),
                "reviewCount", hospital.getReviewCount() == null ? 0 : hospital.getReviewCount());
    }

    private void refreshRatingSummaries(Doctor doctor, Hospital hospital) {
        if (doctor != null) {
            List<Review> doctorReviews = reviewRepository.findByDoctor_IdOrderByCreatedAtDesc(doctor.getId());
            doctor.setReviewCount(doctorReviews.size());
            doctor.setAverageRating(doctorReviews.stream().mapToInt(Review::getRating).average().orElse(0));
            doctorRepository.save(doctor);

            Hospital doctorHospital = doctor.getHospital();
            if (doctorHospital != null) {
                refreshHospitalSummary(doctorHospital);
            }
        }

        if (hospital != null) {
            refreshHospitalSummary(hospital);
        }
    }

    private void refreshHospitalSummary(Hospital hospital) {
        List<Review> hospitalReviews = reviewRepository.findByHospital_IdOrderByCreatedAtDesc(hospital.getId());
        hospital.setReviewCount(hospitalReviews.size());
        hospital.setRating(hospitalReviews.stream().mapToInt(Review::getRating).average().orElse(0));
        hospitalRepository.save(hospital);
    }

    private User requireUser(String email) {
        if (email == null || email.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Please sign in first.");
        }

        User user = userRepository.findByEmail(email.trim().toLowerCase());
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found.");
        }
        return user;
    }

    private Long readLong(Object raw, String message) {
        if (raw == null || String.valueOf(raw).isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
        }
        return Long.parseLong(String.valueOf(raw));
    }

    private Integer readInteger(Object raw, String message) {
        if (raw == null || String.valueOf(raw).isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
        }
        return Integer.parseInt(String.valueOf(raw));
    }

    private ReviewResponse toResponse(Review review) {
        return new ReviewResponse(
                review.getId(),
                review.getRating(),
                review.getComment(),
                review.getCreatedAt(),
                review.getAppointment() != null ? review.getAppointment().getId() : null,
                new ReviewResponse.ReviewerSummary(review.getUser().getId(), review.getUser().getName()),
                review.getDoctor() == null ? null : new ReviewResponse.SubjectSummary(review.getDoctor().getId(), review.getDoctor().getName()),
                review.getHospital() == null ? null : new ReviewResponse.SubjectSummary(review.getHospital().getId(), review.getHospital().getName()));
    }
}
