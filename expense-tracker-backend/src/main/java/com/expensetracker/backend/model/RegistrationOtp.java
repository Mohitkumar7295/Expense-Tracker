package com.expensetracker.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "registration_otps")
public class RegistrationOtp {

    @Id
    private String id;

    @Indexed
    private String email;

    private String otp;

    @Builder.Default
    private String type = "REGISTRATION"; // "REGISTRATION" or "LOGIN"

    @Indexed(expireAfter = "0s")
    private Instant expiresAt;

    @CreatedDate
    private Instant createdAt;
}
