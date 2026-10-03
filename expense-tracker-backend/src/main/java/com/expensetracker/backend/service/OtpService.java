package com.expensetracker.backend.service;

import com.expensetracker.backend.model.RegistrationOtp;
import com.expensetracker.backend.repository.RegistrationOtpRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class OtpService {

    private final RegistrationOtpRepository otpRepository;
    private final JavaMailSender mailSender;
    private final SecureRandom random = new SecureRandom();

    @org.springframework.beans.factory.annotation.Value("${spring.mail.username:your-email@gmail.com}")
    private String mailSenderAddress;

    public String generateAndSendOtp(String email) {
        return generateAndSendOtp(email, "REGISTRATION");
    }

    public String generateAndSendOtp(String email, String type) {
        // Generate 6-digit OTP
        int code = 100000 + random.nextInt(900000);
        String otp = String.valueOf(code);

        // Delete any existing OTP for this email and type
        otpRepository.deleteByEmailAndType(email, type);

        // Save new OTP with 5 minutes (300s) expiry
        RegistrationOtp registrationOtp = RegistrationOtp.builder()
                .email(email)
                .otp(otp)
                .type(type)
                .expiresAt(Instant.now().plusSeconds(300))
                .createdAt(Instant.now())
                .build();
        otpRepository.save(registrationOtp);

        // Send Email
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            if (mailSenderAddress != null && !mailSenderAddress.isBlank() && !mailSenderAddress.contains("your-email@")) {
                message.setFrom(mailSenderAddress);
            }
            message.setTo(email);
            if ("LOGIN".equalsIgnoreCase(type)) {
                message.setSubject("ExpenseTrack - Your Login Verification OTP");
                message.setText("Hello!\n\nYour 6-digit OTP code to complete login is: " + otp + "\n\nThis code will expire in 5 minutes.\nIf you did not initiate this login attempt, please secure your account immediately.");
            } else {
                message.setSubject("ExpenseTrack - Your Registration OTP");
                message.setText("Welcome to ExpenseTrack!\n\nYour 6-digit registration OTP code is: " + otp + "\n\nThis code will expire in 5 minutes.\nIf you did not request this, please ignore this email.");
            }
            mailSender.send(message);
            log.info("{} OTP successfully sent to email: {}", type, email);
        } catch (Exception e) {
            log.warn("[EMAIL NOTICE] Could not send {} email to {} via SMTP (Reason: {}).", type, email, e.getMessage());
            log.warn("[EMAIL NOTICE] If using Gmail, make sure you configure MAIL_USERNAME and a 16-character Google App Password in .env.");
            log.info("[DEV MODE] Use this active OTP code: {}", otp);
        }

        return otp;
    }

    public boolean verifyOtp(String email, String inputOtp) {
        return verifyOtp(email, inputOtp, "REGISTRATION");
    }

    public boolean verifyOtp(String email, String inputOtp, String type) {
        Optional<RegistrationOtp> recordOpt = otpRepository.findTopByEmailAndTypeOrderByCreatedAtDesc(email, type);
        if (recordOpt.isEmpty()) {
            return false;
        }

        RegistrationOtp record = recordOpt.get();
        if (record.getExpiresAt().isBefore(Instant.now())) {
            otpRepository.delete(record);
            return false;
        }

        if (record.getOtp().equals(inputOtp)) {
            otpRepository.delete(record);
            return true;
        }

        return false;
    }
}
