package com.scheduling.schedulingservice.controller;

import com.scheduling.schedulingservice.dto.AnalyticsResponseDto;
import com.scheduling.schedulingservice.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    public ResponseEntity<AnalyticsResponseDto> getDashboardMetrics() {
        return ResponseEntity.ok(analyticsService.getDashboardAnalytics());
    }
}
