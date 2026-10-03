package com.expensetracker.backend.dto.response;

import com.expensetracker.backend.model.Expense;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {

    private Double totalSpent;

    private Double monthlyBudget;

    private Double remainingBudget;

    @Builder.Default
    private String currency = "INR";

    private List<Expense> recentExpenses;
}
