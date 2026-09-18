package com.scheduling.schedulingservice.dto;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.validation.constraints.NotBlank;

import java.time.Instant;

public record JobRequest(
        @NotBlank String name,
        @NotBlank String targetUrl,
        @NotBlank String httpMethod,
        String headers,
        String payload,
        @NotBlank String scheduleType,
        String cronExpression,
        String timezone,
        Instant nextExecutionAt,
        Integer maxRetries
) {}
