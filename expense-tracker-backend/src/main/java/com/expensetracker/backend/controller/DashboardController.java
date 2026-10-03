package com.expensetracker.backend.controller;

import com.expensetracker.backend.dto.response.ApiResponse;
import com.expensetracker.backend.dto.response.DashboardResponse;
import com.expensetracker.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboard(Principal principal) {
        DashboardResponse response = dashboardService.getDashboardData(principal.getName());
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
