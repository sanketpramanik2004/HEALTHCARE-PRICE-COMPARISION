package com.sanket.hospital.controller;

import com.sanket.hospital.entity.Appointment;
import com.sanket.hospital.entity.Hospital;
import com.sanket.hospital.entity.ServiceEntity;
import com.sanket.hospital.service.HospitalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ServiceEntity addService(@RequestBody ServiceEntity serviceEntity) {
        return service.addService(serviceEntity);
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
    public Appointment book(@RequestBody Appointment appointment) {
        return service.bookAppointment(appointment);
    }

    @PutMapping("/updateStatus")
    public Appointment updateStatus(
            @RequestParam Long id,
            @RequestParam String status) {

        return service.updateStatus(id, status);
    }

    @GetMapping("/appointments")
    public List<Appointment> getAllAppointments() {
        return service.getAllAppointments();
    }
}