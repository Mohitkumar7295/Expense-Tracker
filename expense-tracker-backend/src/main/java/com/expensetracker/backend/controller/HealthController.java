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
        response.put("status", "UP");

        try {
            // Ping MongoDB with a fast check
            Document pingResult = mongoTemplate.getDb().runCommand(new Document("ping", 1));
            String dbName = mongoTemplate.getDb().getName();

            response.put("database", "CONNECTED");
            response.put("databaseName", dbName);
            response.put("ping", pingResult.get("ok"));
        } catch (Exception e) {
            log.warn("MongoDB health check ping failed: {}", e.getMessage());
            response.put("database", "DISCONNECTED");
            response.put("databaseError", e.getMessage());
        }

        return ResponseEntity.ok(response);
    }
}
