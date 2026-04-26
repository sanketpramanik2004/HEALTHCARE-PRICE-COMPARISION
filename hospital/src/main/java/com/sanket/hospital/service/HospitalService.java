package com.sanket.hospital.service;

import com.sanket.hospital.entity.Appointment;
import com.sanket.hospital.entity.Hospital;
import com.sanket.hospital.entity.HospitalSlot;
import com.sanket.hospital.entity.ServiceEntity;
import com.sanket.hospital.repository.AppointmentRepository;
import com.sanket.hospital.repository.HospitalRepository;
import com.sanket.hospital.repository.HospitalSlotRepository;
import com.sanket.hospital.repository.ServiceRepository;
import com.sanket.hospital.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.sanket.hospital.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

@Service
public class HospitalService {

    private static final Logger logger = LoggerFactory.getLogger(HospitalService.class);
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Autowired
    private HospitalRepository repository;

    // save hospital
    public Hospital saveHospital(Hospital hospital) {
        return repository.save(hospital);
    }

    // get all hospitals
    public List<Hospital> getAllHospitals() {
        return repository.findAll();
    }

    // search by location
    public List<Hospital> searchByLocation(String location) {
        return repository.findByLocationContaining(location);
    }

    @Autowired
    private UserRepository userRepository;

    public User register(User user) {
        String normalizedEmail = user.getEmail().trim().toLowerCase();
        user.setEmail(normalizedEmail);
        user.setRole(user.getRole() == null || user.getRole().isBlank() ? "USER" : user.getRole());
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An account with this email already exists.");
        }

        if ("ADMIN".equals(user.getRole())) {
            if (user.getHospital() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Hospital details are required for admin registration.");
            }

            Hospital hospital = user.getHospital();
            hospital.setId(null);
            user.setHospital(repository.save(hospital));
        } else {
            user.setHospital(null);
        }

        return userRepository.save(user);
    }

    public User login(String email, String password) {
        User user = userRepository.findTopByEmailOrderByIdDesc(email.trim().toLowerCase());

        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            return user;
        }

        if (user != null && password.equals(user.getPassword())) {
            user.setPassword(passwordEncoder.encode(password));
            return userRepository.save(user);
        }

        return null;
    }

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private HospitalSlotRepository hospitalSlotRepository;

    public Appointment bookAppointment(Appointment appointment) {
        if (appointment.getHospital() == null || appointment.getHospital().getId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Hospital is required for booking.");
        }
        if (appointment.getServiceName() == null || appointment.getServiceName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Service name is required for booking.");
        }
        if (appointment.getDate() == null || appointment.getTime() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Please select a valid booking slot.");
        }

        String normalizedService = appointment.getServiceName().trim();
        Long hospitalId = appointment.getHospital().getId();
        validateSlotAvailability(hospitalId, normalizedService, appointment.getDate(), appointment.getTime());

        appointment.setServiceName(normalizedService);
        appointment.setHospital(getHospitalById(hospitalId));
        appointment.setStatus("PENDING");
        return appointmentRepository.save(appointment);
    }

    @Autowired
    private EmailService emailService;

    public Appointment updateStatus(Long id, String status) {
        return updateStatus(id, status, null);
    }

    public Appointment updateStatus(Long id, String status, Long hospitalId) {
        Appointment appt = appointmentRepository.findById(id).orElse(null);

        if (appt != null) {
            if (hospitalId != null && !hospitalId.equals(appt.getHospital().getId())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only update bookings for your own hospital.");
            }

            String normalizedStatus = status == null ? "" : status.trim().toUpperCase();
            if (!"CONFIRMED".equals(normalizedStatus) && !"REJECTED".equals(normalizedStatus)
                    && !"PENDING".equals(normalizedStatus)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid appointment status.");
            }

            appt.setStatus(normalizedStatus);
            Appointment saved = appointmentRepository.save(appt);

            // Email is optional: status update should still succeed if SMTP is not configured.
            if ("CONFIRMED".equals(normalizedStatus)) {
                try {
                    emailService.sendEmail(
                            appt.getUserEmail(),
                            "Appointment Confirmed",
                            "Your appointment for " + appt.getServiceName() +
                                    " at " + appt.getHospital().getName() +
                                    " is CONFIRMED.");
                } catch (Exception ex) {
                    logger.warn("Appointment confirmed but confirmation email failed for appointmentId={}", appt.getId(),
                            ex);
                }
            }

            return saved;
        }

        return null;
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public List<Appointment> getAppointmentsByUserEmail(String userEmail) {
        return appointmentRepository.findByUserEmailOrderByDateDescTimeDesc(userEmail);
    }

    public List<Appointment> getAppointmentsByHospital(Long hospitalId) {
        return appointmentRepository.findByHospital_Id(hospitalId);
    }

    public Hospital getHospitalById(Long hospitalId) {
        return repository.findById(hospitalId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Hospital not found."));
    }

    public List<ServiceEntity> getServicesByHospital(Long hospitalId) {
        return serviceRepository.findByHospital_IdOrderByServiceNameAsc(hospitalId);
    }

    public HospitalSlot addSlotForHospital(String serviceName, LocalDate slotDate, LocalTime slotTime, Long hospitalId) {
        if (serviceName == null || serviceName.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Service name is required.");
        }
        if (slotDate == null || slotTime == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Slot date and time are required.");
        }

        String normalizedService = serviceName.trim();
        Hospital hospital = getHospitalById(hospitalId);

        boolean serviceExists = serviceRepository.findByHospital_IdOrderByServiceNameAsc(hospitalId).stream()
                .anyMatch(service -> service.getServiceName() != null
                        && service.getServiceName().trim().equalsIgnoreCase(normalizedService));

        if (!serviceExists) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Add this service first before creating a booking slot.");
        }

        hospitalSlotRepository
                .findByHospital_IdAndServiceNameIgnoreCaseAndSlotDateAndSlotTimeAndActiveTrue(
                        hospitalId,
                        normalizedService,
                        slotDate,
                        slotTime)
                .ifPresent(existing -> {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "This slot already exists.");
                });

        HospitalSlot slot = new HospitalSlot();
        slot.setHospital(hospital);
        slot.setServiceName(normalizedService);
        slot.setSlotDate(slotDate);
        slot.setSlotTime(slotTime);
        slot.setActive(true);
        return hospitalSlotRepository.save(slot);
    }

    public List<HospitalSlot> getSlotsByHospital(Long hospitalId) {
        return hospitalSlotRepository.findByHospital_IdOrderBySlotDateAscSlotTimeAsc(hospitalId);
    }

    public Map<String, String> deleteSlotForHospital(Long slotId, Long hospitalId) {
        HospitalSlot slot = hospitalSlotRepository.findById(slotId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Slot not found."));

        if (!slot.getHospital().getId().equals(hospitalId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only delete slots for your own hospital.");
        }

        boolean hasReservedAppointment = appointmentRepository.existsByHospital_IdAndServiceNameIgnoreCaseAndDateAndTimeAndStatusIn(
                hospitalId,
                slot.getServiceName(),
                slot.getSlotDate(),
                slot.getSlotTime(),
                List.of("PENDING", "CONFIRMED"));

        if (hasReservedAppointment) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "This slot already has a booking request and cannot be deleted.");
        }

        hospitalSlotRepository.delete(slot);
        return Map.of("message", "Slot deleted successfully.");
    }

    public List<HospitalSlot> getAvailableSlots(Long hospitalId, String serviceName, LocalDate slotDate) {
        if (hospitalId == null || serviceName == null || serviceName.isBlank() || slotDate == null) {
            return List.of();
        }

        List<HospitalSlot> slots = hospitalSlotRepository
                .findByHospital_IdAndServiceNameIgnoreCaseAndSlotDateAndActiveTrueOrderBySlotTimeAsc(
                        hospitalId,
                        serviceName.trim(),
                        slotDate);

        return slots.stream()
                .filter(slot -> !appointmentRepository.existsByHospital_IdAndServiceNameIgnoreCaseAndDateAndTimeAndStatusIn(
                        hospitalId,
                        slot.getServiceName(),
                        slotDate,
                        slot.getSlotTime(),
                        List.of("PENDING", "CONFIRMED")))
                .sorted(Comparator.comparing(HospitalSlot::getSlotTime))
                .toList();
    }

    @Autowired
    private ServiceRepository serviceRepository;

    // add service
    public ServiceEntity addService(ServiceEntity service) {
        return serviceRepository.save(service);
    }

    public ServiceEntity addServiceForHospital(String serviceName, double price, Long hospitalId) {
        Hospital hospital = getHospitalById(hospitalId);
        ServiceEntity service = new ServiceEntity();
        service.setServiceName(serviceName);
        service.setPrice(price);
        service.setHospital(hospital);
        return serviceRepository.save(service);
    }

    public Map<String, String> deleteServiceForHospital(Long serviceId, Long hospitalId) {
        ServiceEntity service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found."));

        if (!service.getHospital().getId().equals(hospitalId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only delete services for your own hospital.");
        }

        serviceRepository.delete(service);
        return Map.of("message", "Service deleted successfully.");
    }

    // get services by name (for comparison later)
    public List<ServiceEntity> getServicesByName(String name) {
        return serviceRepository.findByServiceName(name);
    }

    public List<ServiceEntity> comparePrices(String serviceName) {
        String normalized = serviceName == null ? "" : serviceName.trim();
        if (normalized.isBlank()) {
            return List.of();
        }

        List<ServiceEntity> services = serviceRepository.findByServiceName(normalized);
        if (services == null || services.isEmpty()) {
            services = serviceRepository.findByServiceNameContainingIgnoreCaseOrderByPriceAsc(normalized);
        }

        // sort by price (ascending)
        services.sort((a, b) -> Double.compare(a.getPrice(), b.getPrice()));

        return services;
    }

    public List<Hospital> getNearestHospitals(double userLat, double userLon) {
        List<Hospital> hospitals = repository.findAll();

        hospitals.sort((h1, h2) -> {
            double d1 = calculateDistance(userLat, userLon, h1.getLatitude(), h1.getLongitude());
            double d2 = calculateDistance(userLat, userLon, h2.getLatitude(), h2.getLongitude());
            return Double.compare(d1, d2);
        });

        return hospitals;
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth radius in km

        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);

        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                        * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    public List<ServiceEntity> getBestHospitals(String serviceName, double userLat, double userLon) {

        String normalized = serviceName == null ? "" : serviceName.trim();
        if (normalized.isBlank()) {
            return List.of();
        }

        List<ServiceEntity> services = serviceRepository.findByServiceName(normalized);
        if (services == null || services.isEmpty()) {
            services = serviceRepository.findByServiceNameContainingIgnoreCaseOrderByPriceAsc(normalized);
        }

        services.sort((s1, s2) -> {
            double d1 = calculateDistance(userLat, userLon,
                    s1.getHospital().getLatitude(),
                    s1.getHospital().getLongitude());

            double d2 = calculateDistance(userLat, userLon,
                    s2.getHospital().getLatitude(),
                    s2.getHospital().getLongitude());

            double score1 = s1.getPrice() + (d1 * 10);
            double score2 = s2.getPrice() + (d2 * 10);

            return Double.compare(score1, score2);
        });

        return services;
    }

    private void validateSlotAvailability(Long hospitalId, String serviceName, LocalDate slotDate, LocalTime slotTime) {
        hospitalSlotRepository
                .findByHospital_IdAndServiceNameIgnoreCaseAndSlotDateAndSlotTimeAndActiveTrue(
                        hospitalId,
                        serviceName,
                        slotDate,
                        slotTime)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Selected slot is not available for this hospital and service."));

        boolean alreadyBooked = appointmentRepository.existsByHospital_IdAndServiceNameIgnoreCaseAndDateAndTimeAndStatusIn(
                hospitalId,
                serviceName,
                slotDate,
                slotTime,
                List.of("PENDING", "CONFIRMED"));

        if (alreadyBooked) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This slot has already been booked.");
        }
    }

}
