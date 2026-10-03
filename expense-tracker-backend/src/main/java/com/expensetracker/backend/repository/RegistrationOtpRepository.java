package com.expensetracker.backend.repository;

import com.expensetracker.backend.model.RegistrationOtp;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RegistrationOtpRepository extends MongoRepository<RegistrationOtp, String> {
    Optional<RegistrationOtp> findTopByEmailOrderByCreatedAtDesc(String email);
    Optional<RegistrationOtp> findTopByEmailAndTypeOrderByCreatedAtDesc(String email, String type);
    void deleteByEmail(String email);
    void deleteByEmailAndType(String email, String type);
}
