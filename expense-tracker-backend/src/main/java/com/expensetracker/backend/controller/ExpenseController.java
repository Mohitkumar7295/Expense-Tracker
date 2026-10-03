package com.expensetracker.backend.controller;

import com.expensetracker.backend.dto.request.ExpenseRequest;
import com.expensetracker.backend.dto.response.ApiResponse;
import com.expensetracker.backend.model.Expense;
import com.expensetracker.backend.service.ExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Expense>>> getExpenses(
            Principal principal,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search
    ) {
        List<Expense> expenses = expenseService.getExpenses(principal.getName(), category, search);
        return ResponseEntity.ok(ApiResponse.success("Expenses retrieved successfully", expenses));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Expense>> getExpenseById(
            Principal principal,
            @PathVariable String id
    ) {
        Expense expense = expenseService.getExpenseById(principal.getName(), id);
        return ResponseEntity.ok(ApiResponse.success(expense));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Expense>> createExpense(
            Principal principal,
            @Valid @RequestBody ExpenseRequest request
    ) {
        Expense created = expenseService.createExpense(principal.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Expense added successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Expense>> updateExpense(
            Principal principal,
            @PathVariable String id,
            @Valid @RequestBody ExpenseRequest request
    ) {
        Expense updated = expenseService.updateExpense(principal.getName(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Expense updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, String>>> deleteExpense(
            Principal principal,
            @PathVariable String id
    ) {
        expenseService.deleteExpense(principal.getName(), id);
        return ResponseEntity.ok(ApiResponse.success("Expense deleted successfully", Map.of("id", id)));
    }
}
