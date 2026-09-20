package com.scheduling.schedulingservice.entity;


import com.scheduling.schedulingservice.enums.JobStatus;
import com.scheduling.schedulingservice.enums.ScheduledType;
import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.databind.JsonNode;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "jobs")
@Getter
@Setter
@ToString
@AllArgsConstructor
@RequiredArgsConstructor
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private JobStatus status;

    @Column(name = "target_url", nullable = false)
    private String targetUrl;

    @Column(name = "http_method", nullable = false)
    private String httpMethod;

    @Column(name = "headers", nullable = false)
    private String headers;

    @Column(name = "payload")
    private String payload;

    @Column(name = "schedule_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private ScheduledType scheduleType;

    @Column(name = "cron_expression")
    private String cronExpression;

    @Column(name = "timezone", nullable = false)
    private String timezone;

    @Column(name = "next_execution_at", columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private Instant nextExecutionAt;

    @Column(name = "max_retries", nullable = false)
    private Integer maxRetries;

    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<JobExecution> executions;


}
