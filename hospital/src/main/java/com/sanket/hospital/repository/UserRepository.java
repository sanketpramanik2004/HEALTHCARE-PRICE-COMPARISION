package com.sanket.hospital.repository;

import com.sanket.hospital.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);

    User findTopByEmailOrderByIdDesc(String email);

    User findByEmail(String email);
}
