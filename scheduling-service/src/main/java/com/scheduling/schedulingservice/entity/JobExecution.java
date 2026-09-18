package com.scheduling.schedulingservice.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "job_executions")
@Getter
@Setter
@RequiredArgsConstructor
@AllArgsConstructor
public class JobExecution {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "job_id")
    private UUID jobId;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "scheduled_for", nullable = false)
    private Instant ScheduledFor;

    @Column(name = "started_at")
    private Instant startedAt;

    @Column(name = "completed_at")
    private Instant completedAt;

    @Column(name = "worker_id")
    private String workerId;

    @Column(name = "lease_expiry_at")
    private Instant leaseExpiryAt;

}
