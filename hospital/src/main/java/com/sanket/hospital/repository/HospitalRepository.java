package com.sanket.hospital.repository;

import com.sanket.hospital.entity.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HospitalRepository extends JpaRepository<Hospital, Long> {

    // custom search
    List<Hospital> findByLocationContaining(String location);
}