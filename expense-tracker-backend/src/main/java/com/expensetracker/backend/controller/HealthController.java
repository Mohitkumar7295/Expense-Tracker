package com.expensetracker.backend.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/health")
@RequiredArgsConstructor
public class HealthController {

    private final MongoTemplate mongoTemplate;

    @GetMapping
    public ResponseEntity<Map<String, Object>> checkHealth() {
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", Instant.now().toString());

        try {
            // Ping MongoDB to verify live connectivity
            Document pingResult = mongoTemplate.getDb().runCommand(new Document("ping", 1));
            String dbName = mongoTemplate.getDb().getName();

            response.put("status", "UP");
            response.put("database", "CONNECTED");
            response.put("databaseName", dbName);
            response.put("ping", pingResult.get("ok"));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("MongoDB health check failed: {}", e.getMessage());
            response.put("status", "DEGRADED");
            response.put("database", "DISCONNECTED");
            response.put("error", e.getMessage());

            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response);
        }
    }
}
