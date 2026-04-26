package com.sanket.hospital.service;

import com.sanket.hospital.dto.DoctorResponse;
import com.sanket.hospital.entity.Doctor;
import com.sanket.hospital.entity.Hospital;
import com.sanket.hospital.repository.AppointmentRepository;
import com.sanket.hospital.repository.DoctorRepository;
import com.sanket.hospital.repository.HospitalRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeParseException;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final HospitalRepository hospitalRepository;
    private final AppointmentRepository appointmentRepository;

    public DoctorService(
            DoctorRepository doctorRepository,
            HospitalRepository hospitalRepository,
            AppointmentRepository appointmentRepository) {
        this.doctorRepository = doctorRepository;
        this.hospitalRepository = hospitalRepository;
        this.appointmentRepository = appointmentRepository;
    }

    public Doctor addDoctorForHospital(Map<String, Object> payload, Long hospitalId) {
        Hospital hospital = hospitalRepository.findById(hospitalId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Hospital not found."));

        String name = String.valueOf(payload.getOrDefault("name", "")).trim();
        String specialization = String.valueOf(payload.getOrDefault("specialization", "")).trim();
        String availability = String.valueOf(payload.getOrDefault("availability", "")).trim();
        String experienceRaw = String.valueOf(payload.getOrDefault("experience", "0")).trim();
        String feeRaw = String.valueOf(payload.getOrDefault("consultationFee", "0")).trim();

        if (name.isBlank() || specialization.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Doctor name and specialization are required.");
        }

        Doctor doctor = new Doctor();
        doctor.setName(name);
        doctor.setSpecialization(specialization);
        doctor.setExperience(experienceRaw.isBlank() ? 0 : Integer.parseInt(experienceRaw));
        doctor.setConsultationFee(feeRaw.isBlank() ? 0 : Double.parseDouble(feeRaw));
        doctor.setAvailability(availability);
        doctor.setHospital(hospital);
        return doctorRepository.save(doctor);
    }

    public Map<String, String> deleteDoctorForHospital(Long doctorId, Long hospitalId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Doctor not found."));

        if (!doctor.getHospital().getId().equals(hospitalId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only delete doctors for your own hospital.");
        }

        boolean inUse = appointmentRepository.existsByDoctor_IdAndStatusIn(doctorId, List.of("PENDING", "CONFIRMED"));
        if (inUse) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "This doctor has active appointments and cannot be deleted.");
        }

        doctorRepository.delete(doctor);
        return Map.of("message", "Doctor deleted successfully.");
    }

    public List<DoctorResponse> getDoctorsByHospital(Long hospitalId) {
        return doctorRepository.findByHospital_IdOrderBySpecializationAscNameAsc(hospitalId).stream()
                .map(doctor -> toDoctorResponse(doctor, 0))
                .toList();
    }

    public List<DoctorResponse> searchDoctors(String specialization, Double lat, Double lon) {
        String normalized = specialization == null ? "" : specialization.trim();
        if (normalized.isBlank()) {
            return List.of();
        }

        return doctorRepository.findBySpecializationContainingIgnoreCaseOrderByConsultationFeeAsc(normalized).stream()
                .map(doctor -> {
                    double distance = lat != null && lon != null
                            ? calculateDistance(lat, lon, doctor.getHospital().getLatitude(), doctor.getHospital().getLongitude())
                            : 0;
                    return new RankedDoctor(doctor, distance, computeScore(doctor, distance, lat, lon));
                })
                .sorted(Comparator.comparingDouble(RankedDoctor::score))
                .map(ranked -> toDoctorResponse(ranked.doctor(), ranked.distanceKm()))
                .toList();
    }

    public List<LocalTime> getAvailableSlotsForDoctor(Long doctorId, LocalDate slotDate) {
        Doctor doctor = getDoctorById(doctorId);
        if (slotDate == null) {
            return List.of();
        }

        return parseAvailability(doctor.getAvailability()).stream()
                .filter(slotTime -> !appointmentRepository.existsByDoctor_IdAndDateAndTimeAndStatusIn(
                        doctorId,
                        slotDate,
                        slotTime,
                        List.of("PENDING", "CONFIRMED")))
                .sorted()
                .toList();
    }

    public Doctor getDoctorById(Long doctorId) {
        return doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Doctor not found."));
    }

    public void validateDoctorBooking(Doctor doctor, Hospital hospital, LocalDate date, LocalTime time) {
        if (doctor == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Doctor selection is required for consultation booking.");
        }
        if (hospital == null || hospital.getId() == null || !doctor.getHospital().getId().equals(hospital.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Selected doctor does not belong to this hospital.");
        }
        if (date == null || time == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Please select a valid doctor consultation slot.");
        }

        List<LocalTime> allowedTimes = parseAvailability(doctor.getAvailability());
        if (allowedTimes.stream().noneMatch(time::equals)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Selected doctor slot is not available.");
        }

        boolean alreadyBooked = appointmentRepository.existsByDoctor_IdAndDateAndTimeAndStatusIn(
                doctor.getId(),
                date,
                time,
                List.of("PENDING", "CONFIRMED"));
        if (alreadyBooked) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This doctor slot has already been booked.");
        }
    }

    private List<LocalTime> parseAvailability(String availability) {
        if (availability == null || availability.isBlank()) {
            return List.of();
        }

        return List.of(availability.split(",")).stream()
                .map(String::trim)
                .filter(value -> !value.isBlank())
                .map(value -> {
                    try {
                        return LocalTime.parse(value);
                    } catch (DateTimeParseException ex) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                "Doctor availability contains an invalid time: " + value);
                    }
                })
                .sorted()
                .toList();
    }

    private double computeScore(Doctor doctor, double distanceKm, Double lat, Double lon) {
        double ratingScore = (5 - doctor.getHospital().getRating()) * 150;
        double distanceScore = (lat != null && lon != null) ? distanceKm * 12 : 0;
        return doctor.getConsultationFee() + distanceScore + ratingScore;
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371;

        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);

        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private DoctorResponse toDoctorResponse(Doctor doctor, double distanceKm) {
        return new DoctorResponse(
                doctor.getId(),
                doctor.getName(),
                doctor.getSpecialization(),
                doctor.getExperience(),
                doctor.getConsultationFee(),
                doctor.getAvailability(),
                distanceKm,
                new DoctorResponse.HospitalSummary(
                        doctor.getHospital().getId(),
                        doctor.getHospital().getName(),
                        doctor.getHospital().getLocation(),
                        doctor.getHospital().getLatitude(),
                        doctor.getHospital().getLongitude(),
                        doctor.getHospital().getRating()));
    }

    private record RankedDoctor(Doctor doctor, double distanceKm, double score) {
    }
}
