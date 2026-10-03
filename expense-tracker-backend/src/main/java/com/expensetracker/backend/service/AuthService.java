package com.expensetracker.backend.service;

import com.expensetracker.backend.dto.request.LoginRequest;
import com.expensetracker.backend.dto.request.RegisterRequest;
import com.expensetracker.backend.dto.request.VerifyOtpRequest;
import com.expensetracker.backend.dto.response.AuthResponse;
import com.expensetracker.backend.model.User;
import com.expensetracker.backend.repository.UserRepository;
import com.expensetracker.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final OtpService otpService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public String register(RegisterRequest request) {
        String cleanEmail = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(cleanEmail)) {
            User existing = userRepository.findByEmail(cleanEmail).get();
            if (existing.isEmailVerified()) {
                throw new IllegalArgumentException("User with this email already exists");
            }
            // If exists but not verified, update details
            existing.setName(request.getName().trim());
            existing.setPassword(passwordEncoder.encode(request.getPassword()));
            existing.setUpdatedAt(Instant.now());
            userRepository.save(existing);
        } else {
            User user = User.builder()
                    .name(request.getName().trim())
                    .email(cleanEmail)
                    .password(passwordEncoder.encode(request.getPassword()))
                    .emailVerified(false)
                    .monthlyBudget(12000.0)
                    .createdAt(Instant.now())
                    .updatedAt(Instant.now())
                    .build();
            userRepository.save(user);
        }

        return otpService.generateAndSendOtp(cleanEmail, "REGISTRATION");
    }

    public boolean verifyRegistration(VerifyOtpRequest request) {
        String cleanEmail = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(cleanEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + cleanEmail));

        boolean valid = otpService.verifyOtp(cleanEmail, request.getOtp().trim(), "REGISTRATION");
        if (!valid) {
            return false;
        }

        user.setEmailVerified(true);
        user.setUpdatedAt(Instant.now());
        userRepository.save(user);
        return true;
    }

    public String resendRegistrationOtp(String email) {
        String cleanEmail = email.trim().toLowerCase();
        User user = userRepository.findByEmail(cleanEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + cleanEmail));

        if (user.isEmailVerified()) {
            throw new IllegalArgumentException("Email is already verified. Please log in.");
        }

        return otpService.generateAndSendOtp(cleanEmail, "REGISTRATION");
    }

    public String resendOtp(String email) {
        return resendRegistrationOtp(email);
    }

    public String initiateLogin(LoginRequest request) {
        String cleanEmail = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(cleanEmail)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!user.isEmailVerified()) {
            throw new IllegalStateException("Email is not verified. Please verify your registration OTP first.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        return otpService.generateAndSendOtp(cleanEmail, "LOGIN");
    }

    public AuthResponse verifyLoginOtp(VerifyOtpRequest request) {
        String cleanEmail = request.getEmail().trim().toLowerCase();
        User user = userRepository.findByEmail(cleanEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + cleanEmail));

        boolean valid = otpService.verifyOtp(cleanEmail, request.getOtp().trim(), "LOGIN");
        if (!valid) {
            throw new IllegalArgumentException("Invalid or expired login OTP. Please try again.");
        }

        String token = jwtService.generateToken(user.getEmail(), user.getId());

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .expiresIn(86400000L)
                .user(AuthResponse.UserSummary.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .monthlyBudget(user.getMonthlyBudget())
                        .emailVerified(user.isEmailVerified())
                        .build())
                .build();
    }

    public String resendLoginOtp(String email) {
        String cleanEmail = email.trim().toLowerCase();
        User user = userRepository.findByEmail(cleanEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + cleanEmail));

        if (!user.isEmailVerified()) {
            throw new IllegalStateException("Email is not verified. Please verify your registration OTP first.");
        }

        return otpService.generateAndSendOtp(cleanEmail, "LOGIN");
    }
}
