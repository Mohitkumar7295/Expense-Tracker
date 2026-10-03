package com.expensetracker.backend.service;

import com.expensetracker.backend.dto.request.ExpenseRequest;
import com.expensetracker.backend.exception.ResourceNotFoundException;
import com.expensetracker.backend.model.Expense;
import com.expensetracker.backend.model.User;
import com.expensetracker.backend.repository.ExpenseRepository;
import com.expensetracker.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    private User getAuthenticatedUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    public List<Expense> getExpenses(String email, String category, String search) {
        User user = getAuthenticatedUser(email);
        List<Expense> expenses;

        if (category != null && !category.equalsIgnoreCase("All") && !category.isBlank()) {
            expenses = expenseRepository.findByUserIdAndCategoryOrderByDateDesc(user.getId(), category);
        } else {
            expenses = expenseRepository.findByUserIdOrderByDateDesc(user.getId());
        }

        if (search != null && !search.isBlank()) {
            String q = search.toLowerCase();
            return expenses.stream()
                    .filter(e -> (e.getDescription() != null && e.getDescription().toLowerCase().contains(q)) ||
                                 (e.getCategory() != null && e.getCategory().toLowerCase().contains(q)))
                    .toList();
        }

        return expenses;
    }

    public Expense getExpenseById(String email, String id) {
        User user = getAuthenticatedUser(email);
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));

        if (!expense.getUserId().equals(user.getId())) {
            throw new IllegalArgumentException("Access denied to requested expense");
        }
        return expense;
    }

    public Expense createExpense(String email, ExpenseRequest request) {
        User user = getAuthenticatedUser(email);

        Expense expense = Expense.builder()
                .userId(user.getId())
                .amount(request.getAmount())
                .category(request.getCategory())
                .description(request.getDescription())
                .date(request.getDate())
                .paymentMethod(request.getPaymentMethod())
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        return expenseRepository.save(expense);
    }

    public Expense updateExpense(String email, String id, ExpenseRequest request) {
        Expense existing = getExpenseById(email, id);

        existing.setAmount(request.getAmount());
        existing.setCategory(request.getCategory());
        existing.setDescription(request.getDescription());
        existing.setDate(request.getDate());
        existing.setPaymentMethod(request.getPaymentMethod());
        existing.setUpdatedAt(Instant.now());

        return expenseRepository.save(existing);
    }

    public void deleteExpense(String email, String id) {
        Expense existing = getExpenseById(email, id);
        expenseRepository.delete(existing);
    }
}
