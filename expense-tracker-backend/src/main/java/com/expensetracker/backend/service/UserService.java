package com.expensetracker.backend.service;

import com.expensetracker.backend.dto.request.UpdateProfileRequest;
import com.expensetracker.backend.exception.ResourceNotFoundException;
import com.expensetracker.backend.model.User;
import com.expensetracker.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User getProfile(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    public User updateProfile(String email, UpdateProfileRequest request) {
        User user = getProfile(email);

        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName().trim());
        }
        if (request.getMonthlyBudget() != null) {
            user.setMonthlyBudget(request.getMonthlyBudget());
        }
        user.setUpdatedAt(Instant.now());

        return userRepository.save(user);
    }
}
