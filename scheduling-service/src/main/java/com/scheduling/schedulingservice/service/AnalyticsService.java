package com.scheduling.schedulingservice.service;

import com.scheduling.schedulingservice.dto.AnalyticsResponseDto;
import com.scheduling.schedulingservice.entity.User;
import com.scheduling.schedulingservice.enums.ExecutionStatus;
import com.scheduling.schedulingservice.enums.JobStatus;
import com.scheduling.schedulingservice.repo.JobExecutionRepository;
import com.scheduling.schedulingservice.repo.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final JobRepository jobRepository;
    private final JobExecutionRepository jobExecutionRepository;

    private UUID getCurrentUserID() {
        return ((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
    }

    public AnalyticsResponseDto getDashboardAnalytics() {
        UUID userId = getCurrentUserID();

        long totalJobs = jobRepository.countByUserId(userId);
        long activeJobs = jobRepository.countByUserIdAndStatus(userId, JobStatus.ACTIVE);

        List<Object[]> statusCounts = jobExecutionRepository.countExecutionsByStatus(userId);
        Map<String, Long> executionsByStatus = new HashMap<>();
        for (Object[] row : statusCounts) {
            String status = row[0] != null ? row[0].toString() : "UNKNOWN";
            Long count = ((Number) row[1]).longValue();
            executionsByStatus.put(status, count);
        }

        Instant since = Instant.now().minus(24, ChronoUnit.HOURS);
        List<Object[]> hourlyData = jobExecutionRepository.getHourlyMetrics(userId, since);

        // Group by hour
        Map<String, AnalyticsResponseDto.HourlyMetric> metricMap = new LinkedHashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm").withZone(ZoneId.systemDefault());

        for (Object[] row : hourlyData) {
            if (row[0] == null) continue;
            Instant hourBucket = ((Timestamp) row[0]).toInstant();
            String hourKey = formatter.format(hourBucket);
            String status = row[1] != null ? row[1].toString() : "UNKNOWN";
            long count = ((Number) row[2]).longValue();

            AnalyticsResponseDto.HourlyMetric current = metricMap.getOrDefault(hourKey,
                    new AnalyticsResponseDto.HourlyMetric(hourKey, 0, 0, 0, 0));

            long s = current.success();
            long f = current.failed();
            long r = current.retrying();
            long q = current.queued();

            if (status.equals("SUCCESS")) s += count;
            else if (status.equals("FAILED") || status.equals("DEAD_LETTER")) f += count;
            else if (status.equals("RETRYING")) r += count;
            else if (status.equals("QUEUED") || status.equals("RUNNING")) q += count;

            metricMap.put(hourKey, new AnalyticsResponseDto.HourlyMetric(hourKey, s, f, r, q));
        }

        return new AnalyticsResponseDto(
                totalJobs,
                activeJobs,
                executionsByStatus,
                new ArrayList<>(metricMap.values())
        );
    }
}
