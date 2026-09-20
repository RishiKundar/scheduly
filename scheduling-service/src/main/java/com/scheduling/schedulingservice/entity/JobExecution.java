package com.scheduling.schedulingservice.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.List;
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "scheduled_for", nullable = false)
    private Instant scheduledFor;

    @Column(name = "started_at")
    private Instant startedAt;

    @Column(name = "completed_at")
    private Instant completedAt;

    @Column(name = "worker_id")
    private String workerId;

    @Column(name = "lease_expiry_at")
    private Instant leaseExpiryAt;

    @OneToMany(mappedBy = "jobExecution", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<JobAttempt> attempts;

}
