package com.sanket.hospital.controller;

import com.sanket.hospital.entity.Appointment;
import com.sanket.hospital.entity.Hospital;
import com.sanket.hospital.entity.HospitalSlot;
import com.sanket.hospital.entity.ServiceEntity;
import com.sanket.hospital.service.HospitalService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.sanket.hospital.entity.User;
import com.sanket.hospital.security.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/hospitals")
@CrossOrigin(origins = "*")
public class HospitalController {

    @Autowired
    private HospitalService service;

    // 1. Add hospital
    @PostMapping("/add")
    public Hospital addHospital(@RequestBody Hospital hospital) {
        return service.saveHospital(hospital);
    }

    // 2. Get all hospitals
    @GetMapping("/all")
    public List<Hospital> getAll() {
        return service.getAllHospitals();
    }

    // 3. Search by location
    @GetMapping("/search")
    public List<Hospital> search(@RequestParam String location) {
        return service.searchByLocation(location);
    }

    @PostMapping("/addService")
    public ResponseEntity<?> addService(@RequestBody Map<String, Object> payload, HttpServletRequest request) {
        Long hospitalId = (Long) request.getAttribute("hospitalId");
        if (hospitalId == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Hospital admin account required."));
        }

        String serviceName = String.valueOf(payload.getOrDefault("serviceName", "")).trim();
        double price = Double.parseDouble(String.valueOf(payload.getOrDefault("price", "0")));
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.addServiceForHospital(serviceName, price, hospitalId));
    }

    @DeleteMapping("/services/{serviceId}")
    public ResponseEntity<?> deleteService(@PathVariable Long serviceId, HttpServletRequest request) {
        Long hospitalId = (Long) request.getAttribute("hospitalId");
        if (hospitalId == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Hospital admin account required."));
        }

        return ResponseEntity.ok(service.deleteServiceForHospital(serviceId, hospitalId));
    }

    @PostMapping("/slots")
    public ResponseEntity<?> addSlot(@RequestBody Map<String, Object> payload, HttpServletRequest request) {
        Long hospitalId = (Long) request.getAttribute("hospitalId");
        if (hospitalId == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Hospital admin account required."));
        }

        String serviceName = String.valueOf(payload.getOrDefault("serviceName", "")).trim();
        String dateValue = String.valueOf(payload.getOrDefault("slotDate", "")).trim();
        String timeValue = String.valueOf(payload.getOrDefault("slotTime", "")).trim();

        HospitalSlot created = service.addSlotForHospital(
                serviceName,
                LocalDate.parse(dateValue),
                LocalTime.parse(timeValue),
                hospitalId);

        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/myHospitalSlots")
    public ResponseEntity<?> getMyHospitalSlots(HttpServletRequest request) {
        Long hospitalId = (Long) request.getAttribute("hospitalId");
        if (hospitalId == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Hospital admin account required."));
        }

        return ResponseEntity.ok(service.getSlotsByHospital(hospitalId));
    }

    @DeleteMapping("/slots/{slotId}")
    public ResponseEntity<?> deleteSlot(@PathVariable Long slotId, HttpServletRequest request) {
        Long hospitalId = (Long) request.getAttribute("hospitalId");
        if (hospitalId == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Hospital admin account required."));
        }

        return ResponseEntity.ok(service.deleteSlotForHospital(slotId, hospitalId));
    }

    @GetMapping("/availableSlots")
    public List<HospitalSlot> getAvailableSlots(
            @RequestParam Long hospitalId,
            @RequestParam String serviceName,
            @RequestParam String slotDate) {
        return service.getAvailableSlots(hospitalId, serviceName, LocalDate.parse(slotDate));
    }

    @GetMapping("/compare")
    public List<ServiceEntity> compare(@RequestParam String serviceName) {
        return service.comparePrices(serviceName);
    }

    @GetMapping("/nearest")
    public List<Hospital> getNearest(
            @RequestParam double lat,
            @RequestParam double lon) {
        return service.getNearestHospitals(lat, lon);
    }

    @GetMapping("/best")
    public List<ServiceEntity> best(
            @RequestParam String serviceName,
            @RequestParam double lat,
            @RequestParam double lon) {

        return service.getBestHospitals(serviceName, lat, lon);
    }

    @PostMapping("/book")
    public ResponseEntity<?> book(@RequestBody Appointment appointment, HttpServletRequest request) {

        String email = (String) request.getAttribute("userEmail");
        if (email == null || email.isBlank()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Please sign in before booking an appointment."));
        }

        appointment.setUserEmail(email);
        return ResponseEntity.status(HttpStatus.CREATED).body(service.bookAppointment(appointment));
    }

    @PutMapping("/updateStatus")
    public Appointment updateStatus(
            @RequestParam Long id,
            @RequestParam String status,
            HttpServletRequest request) {
        Long hospitalId = (Long) request.getAttribute("hospitalId");

        return service.updateStatus(id, status, hospitalId);
    }

    @GetMapping("/appointments")
    public List<Appointment> getAllAppointments() {
        return service.getAllAppointments();
    }

    @GetMapping("/myHospitalAppointments")
    public ResponseEntity<?> getMyHospitalAppointments(HttpServletRequest request) {
        Long hospitalId = (Long) request.getAttribute("hospitalId");
        if (hospitalId == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Hospital admin account required."));
        }

        return ResponseEntity.ok(service.getAppointmentsByHospital(hospitalId));
    }

    @GetMapping("/myHospitalServices")
    public ResponseEntity<?> getMyHospitalServices(HttpServletRequest request) {
        Long hospitalId = (Long) request.getAttribute("hospitalId");
        if (hospitalId == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Hospital admin account required."));
        }

        return ResponseEntity.ok(service.getServicesByHospital(hospitalId));
    }

    @GetMapping("/myHospitalProfile")
    public ResponseEntity<?> getMyHospitalProfile(HttpServletRequest request) {
        Long hospitalId = (Long) request.getAttribute("hospitalId");
        if (hospitalId == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Hospital admin account required."));
        }

        return ResponseEntity.ok(service.getHospitalById(hospitalId));
    }

    @GetMapping("/myAppointments")
    public List<Appointment> getMyAppointments(HttpServletRequest request) {
        String email = (String) request.getAttribute("userEmail");
        return service.getAppointmentsByUserEmail(email);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        User savedUser = service.register(user);
        Map<String, Object> payload = new HashMap<>();
        payload.put("id", savedUser.getId());
        payload.put("name", savedUser.getName());
        payload.put("email", savedUser.getEmail());
        payload.put("role", savedUser.getRole());
        if (savedUser.getHospital() != null) {
            payload.put("hospitalId", savedUser.getHospital().getId());
            payload.put("hospitalName", savedUser.getHospital().getName());
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(payload);
    }

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.getOrDefault("email", "");
        String password = credentials.getOrDefault("password", "");

        User user = service.login(email, password);

        if (user != null) {
            Map<String, Object> payload = new HashMap<>();
            Long hospitalId = user.getHospital() != null ? user.getHospital().getId() : null;
            payload.put("token", jwtUtil.generateToken(user.getEmail(), user.getRole(), hospitalId));
            payload.put("role", user.getRole());
            payload.put("name", user.getName());
            payload.put("email", user.getEmail());
            payload.put("hospitalId", hospitalId);
            payload.put("hospitalName", user.getHospital() != null ? user.getHospital().getName() : null);
            return ResponseEntity.ok(payload);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Invalid credentials"));
    }
}
