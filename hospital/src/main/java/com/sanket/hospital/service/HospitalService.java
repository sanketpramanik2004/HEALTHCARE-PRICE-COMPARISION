package com.sanket.hospital.service;

import com.sanket.hospital.entity.Appointment;
import com.sanket.hospital.entity.Hospital;
import com.sanket.hospital.entity.ServiceEntity;
import com.sanket.hospital.repository.AppointmentRepository;
import com.sanket.hospital.repository.HospitalRepository;
import com.sanket.hospital.repository.ServiceRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HospitalService {

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
    private AppointmentRepository appointmentRepository;

    public Appointment bookAppointment(Appointment appointment) {
        appointment.setStatus("PENDING");
        return appointmentRepository.save(appointment);
    }

    public Appointment updateStatus(Long id, String status) {
        Appointment appt = appointmentRepository.findById(id).orElse(null);

        if (appt != null) {
            appt.setStatus(status);
            return appointmentRepository.save(appt);
        }

        return null;
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    @Autowired
    private ServiceRepository serviceRepository;

    // add service
    public ServiceEntity addService(ServiceEntity service) {
        return serviceRepository.save(service);
    }

    // get services by name (for comparison later)
    public List<ServiceEntity> getServicesByName(String name) {
        return serviceRepository.findByServiceName(name);
    }

    public List<ServiceEntity> comparePrices(String serviceName) {
        List<ServiceEntity> services = serviceRepository.findByServiceName(serviceName);

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

        List<ServiceEntity> services = serviceRepository.findByServiceName(serviceName);

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
}