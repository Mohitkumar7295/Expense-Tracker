package com.expensetracker.backend.service;

import com.expensetracker.backend.dto.response.DashboardResponse;
import com.expensetracker.backend.exception.ResourceNotFoundException;
import com.expensetracker.backend.model.Expense;
import com.expensetracker.backend.model.User;
import com.expensetracker.backend.repository.ExpenseRepository;
import com.expensetracker.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final ExpenseRepository expenseRepository;

    public DashboardResponse getDashboardData(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        List<Expense> allExpenses = expenseRepository.findByUserIdOrderByDateDesc(user.getId());
        double totalSpent = allExpenses.stream()
                .mapToDouble(Expense::getAmount)
                .sum();

        double monthlyBudget = user.getMonthlyBudget() != null ? user.getMonthlyBudget() : 12000.0;
        double remainingBudget = monthlyBudget - totalSpent;

        List<Expense> recent = expenseRepository.findTop5ByUserIdOrderByDateDesc(user.getId());

        return DashboardResponse.builder()
                .totalSpent(totalSpent)
                .monthlyBudget(monthlyBudget)
                .remainingBudget(remainingBudget)
                .currency("INR")
                .recentExpenses(recent)
                .build();
    }
}
