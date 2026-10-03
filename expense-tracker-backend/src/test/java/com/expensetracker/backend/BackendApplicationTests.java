package com.expensetracker.backend;

import com.expensetracker.backend.dto.request.ExpenseRequest;
import com.expensetracker.backend.dto.request.LoginRequest;
import com.expensetracker.backend.dto.request.RegisterRequest;
import com.expensetracker.backend.dto.request.VerifyOtpRequest;
import com.expensetracker.backend.dto.response.AuthResponse;
import com.expensetracker.backend.dto.response.DashboardResponse;
import com.expensetracker.backend.model.Expense;
import com.expensetracker.backend.model.RegistrationOtp;
import com.expensetracker.backend.model.User;
import com.expensetracker.backend.repository.ExpenseRepository;
import com.expensetracker.backend.repository.RegistrationOtpRepository;
import com.expensetracker.backend.repository.UserRepository;
import com.expensetracker.backend.service.AuthService;
import com.expensetracker.backend.service.DashboardService;
import com.expensetracker.backend.service.ExpenseService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class BackendApplicationTests {

    @Autowired
    private AuthService authService;

    @Autowired
    private ExpenseService expenseService;

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RegistrationOtpRepository otpRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    private final String testEmail = "teststudent@example.com";

    @BeforeEach
    void cleanup() {
        Optional<User> existing = userRepository.findByEmail(testEmail);
        existing.ifPresent(user -> {
            expenseRepository.findByUserIdOrderByDateDesc(user.getId())
                    .forEach(expenseRepository::delete);
            userRepository.delete(user);
        });
        otpRepository.deleteByEmail(testEmail);
    }

    @Test
    void contextLoads() {
        assertNotNull(authService);
        assertNotNull(expenseService);
        assertNotNull(dashboardService);
    }

    @Test
    void testCompleteBackendFlowWithLoginOtp() {
        // 1. Register User
        RegisterRequest registerReq = RegisterRequest.builder()
                .name("Test Student")
                .email(testEmail)
                .password("password123")
                .build();
        String regOtp = authService.register(registerReq);
        assertNotNull(regOtp);
        assertEquals(6, regOtp.length());

        User user = userRepository.findByEmail(testEmail).orElse(null);
        assertNotNull(user);
        assertFalse(user.isEmailVerified());

        // 2. Verify Registration OTP
        VerifyOtpRequest verifyRegReq = VerifyOtpRequest.builder()
                .email(testEmail)
                .otp(regOtp)
                .build();
        boolean verified = authService.verifyRegistration(verifyRegReq);
        assertTrue(verified);

        User verifiedUser = userRepository.findByEmail(testEmail).orElse(null);
        assertNotNull(verifiedUser);
        assertTrue(verifiedUser.isEmailVerified());

        // 3. Initiate Login (Email + Password requires OTP)
        LoginRequest loginReq = LoginRequest.builder()
                .email(testEmail)
                .password("password123")
                .build();
        String loginOtp = authService.initiateLogin(loginReq);
        assertNotNull(loginOtp);
        assertEquals(6, loginOtp.length());

        // 4. Verify Login OTP -> returns JWT token
        VerifyOtpRequest verifyLoginReq = VerifyOtpRequest.builder()
                .email(testEmail)
                .otp(loginOtp)
                .build();
        AuthResponse authResponse = authService.verifyLoginOtp(verifyLoginReq);
        assertNotNull(authResponse);
        assertNotNull(authResponse.getToken());
        assertEquals("Bearer", authResponse.getTokenType());
        assertEquals(testEmail, authResponse.getUser().getEmail());

        // 5. Add Expenses using authenticated user
        ExpenseRequest expense1 = ExpenseRequest.builder()
                .amount(450.0)
                .category("Food")
                .description("Hostel Dinner")
                .date("2026-10-02")
                .paymentMethod("UPI")
                .build();
        Expense createdExpense = expenseService.createExpense(testEmail, expense1);
        assertNotNull(createdExpense.getId());
        assertEquals(450.0, createdExpense.getAmount());

        ExpenseRequest expense2 = ExpenseRequest.builder()
                .amount(80.0)
                .category("Transport")
                .description("Metro Ticket")
                .date("2026-10-02")
                .paymentMethod("UPI")
                .build();
        expenseService.createExpense(testEmail, expense2);

        // 6. List Expenses
        List<Expense> expenses = expenseService.getExpenses(testEmail, "All", null);
        assertEquals(2, expenses.size());

        // 7. Check Dashboard Aggregations
        DashboardResponse dashboard = dashboardService.getDashboardData(testEmail);
        assertEquals(530.0, dashboard.getTotalSpent()); // 450 + 80
        assertEquals(12000.0, dashboard.getMonthlyBudget());
        assertEquals(11470.0, dashboard.getRemainingBudget()); // 12000 - 530
        assertEquals(2, dashboard.getRecentExpenses().size());

        // 8. Delete Expense
        expenseService.deleteExpense(testEmail, createdExpense.getId());
        List<Expense> afterDelete = expenseService.getExpenses(testEmail, "All", null);
        assertEquals(1, afterDelete.size());

        // Dashboard after delete
        DashboardResponse dashboardAfter = dashboardService.getDashboardData(testEmail);
        assertEquals(80.0, dashboardAfter.getTotalSpent());
    }
}
