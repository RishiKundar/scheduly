package com.scheduling.schedulingservice.dto;

import java.time.Instant;

public record JobResponseDto(
        String id,
        String name,
        String status,
        String targetUrl,
        String httpMethod,
        String headers,
        String payload,
        String scheduleType,
        String cronExpression,
        Instant nextExecutionAt,
        int maxRetries
) {
}
