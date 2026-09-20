package com.scheduling.schedulingservice.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "job_attempts")
@RequiredArgsConstructor
@AllArgsConstructor
public class JobAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "execution_id", nullable = false)
    private JobExecution jobExecution;

    @Column(name = "attempt_number", nullable = false)
    private Integer attemptNumber;

    @Column(name = "started_at", nullable = false)
    private Instant startedAt;

    @Column(name = "ended_at", nullable = false)
    private Instant endedAt;

    @Column(name = "http_status_code")
    private Integer httpStatusCode;

    @Column(name = "response_body")
    private String responseBody;

    @Column(name = "failure_reason")
    private String failureReason;
}
