package com.scheduling.schedulingservice.dto;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

public record AnalyticsResponseDto(
        long totalJobs,
        long activeJobs,
        Map<String, Long> executionsByStatus,
        List<HourlyMetric> hourlyMetrics
) implements Serializable {
    public record HourlyMetric(
            String timestamp,
            long success,
            long failed,
            long retrying,
            long queued
    ) {}
}
