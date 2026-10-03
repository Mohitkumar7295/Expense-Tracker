package com.expensetracker.backend.controller;

import com.expensetracker.backend.dto.request.UpdateProfileRequest;
import com.expensetracker.backend.dto.response.ApiResponse;
import com.expensetracker.backend.model.User;
import com.expensetracker.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<User>> getMe(Principal principal) {
        User user = userService.getProfile(principal.getName());
        user.setPassword(null);
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<User>> updateMe(
            Principal principal,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        User updated = userService.updateProfile(principal.getName(), request);
        updated.setPassword(null);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }

    @PutMapping("/me/budget")
    public ResponseEntity<ApiResponse<User>> updateBudget(
            Principal principal,
            @RequestBody java.util.Map<String, Object> body
    ) {
        Double budget = null;
        if (body.containsKey("monthlyBudget") && body.get("monthlyBudget") != null) {
            budget = Double.valueOf(body.get("monthlyBudget").toString());
        } else if (body.containsKey("budget") && body.get("budget") != null) {
            budget = Double.valueOf(body.get("budget").toString());
        }

        UpdateProfileRequest request = UpdateProfileRequest.builder()
                .monthlyBudget(budget)
                .build();
        User updated = userService.updateProfile(principal.getName(), request);
        updated.setPassword(null);
        return ResponseEntity.ok(ApiResponse.success("Budget updated successfully", updated));
    }
}
