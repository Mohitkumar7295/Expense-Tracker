package com.expensetracker.backend.controller;

import com.expensetracker.backend.dto.request.LoginRequest;
import com.expensetracker.backend.dto.request.RegisterRequest;
import com.expensetracker.backend.dto.request.ResendOtpRequest;
import com.expensetracker.backend.dto.request.VerifyOtpRequest;
import com.expensetracker.backend.dto.response.ApiResponse;
import com.expensetracker.backend.dto.response.AuthResponse;
import com.expensetracker.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Map<String, Object>>> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                        "Registration initiated. A 6-digit OTP has been sent to your email.",
                        Map.of("email", request.getEmail(), "otpExpiresInSeconds", 300)
                ));
    }

    @PostMapping("/verify-registration")
    public ResponseEntity<ApiResponse<Map<String, Object>>> verifyRegistration(@Valid @RequestBody VerifyOtpRequest request) {
        boolean verified = authService.verifyRegistration(request);
        if (!verified) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Invalid or expired OTP. Please try again.", "INVALID_OTP"));
        }
        return ResponseEntity.ok(ApiResponse.success(
                "Email verified successfully. You can now log in.",
                Map.of("email", request.getEmail(), "emailVerified", true)
        ));
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<ApiResponse<Map<String, Object>>> resendOtp(@Valid @RequestBody ResendOtpRequest request) {
        authService.resendOtp(request.getEmail());
        return ResponseEntity.ok(ApiResponse.success(
                "A fresh registration OTP has been sent to your email.",
                Map.of("email", request.getEmail(), "otpExpiresInSeconds", 300)
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Map<String, Object>>> login(@Valid @RequestBody LoginRequest request) {
        authService.initiateLogin(request);
        return ResponseEntity.ok(ApiResponse.success(
                "Credentials verified. A 6-digit login OTP has been sent to your email.",
                Map.of("email", request.getEmail(), "otpExpiresInSeconds", 300, "requiresOtp", true)
        ));
    }

    @PostMapping("/verify-login")
    public ResponseEntity<ApiResponse<AuthResponse>> verifyLogin(@Valid @RequestBody VerifyOtpRequest request) {
        AuthResponse response = authService.verifyLoginOtp(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @PostMapping("/resend-login-otp")
    public ResponseEntity<ApiResponse<Map<String, Object>>> resendLoginOtp(@Valid @RequestBody ResendOtpRequest request) {
        authService.resendLoginOtp(request.getEmail());
        return ResponseEntity.ok(ApiResponse.success(
                "A fresh login OTP has been sent to your email.",
                Map.of("email", request.getEmail(), "otpExpiresInSeconds", 300)
        ));
    }
}
