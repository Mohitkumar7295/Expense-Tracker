package com.expensetracker.backend.dto.request;

import jakarta.validation.constraints.DecimalMin;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {

    private String name;

    @DecimalMin(value = "0.0", message = "Monthly budget cannot be negative")
    private Double monthlyBudget;
}
