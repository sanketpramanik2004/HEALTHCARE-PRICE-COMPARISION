package com.sanket.hospital.repository;

import com.sanket.hospital.entity.ServiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServiceRepository extends JpaRepository<ServiceEntity, Long> {

    List<ServiceEntity> findByServiceName(String serviceName);

    List<ServiceEntity> findByHospital_IdOrderByServiceNameAsc(Long hospitalId);

    List<ServiceEntity> findByServiceNameContainingIgnoreCaseOrderByPriceAsc(String serviceName);
}
