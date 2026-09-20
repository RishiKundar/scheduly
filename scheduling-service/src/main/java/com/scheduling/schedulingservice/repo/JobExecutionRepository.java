package com.scheduling.schedulingservice.repo;

import com.scheduling.schedulingservice.entity.JobExecution;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface JobExecutionRepository extends JpaRepository<JobExecution, UUID> {


    @Transactional
    @Modifying
    @Query(nativeQuery = true,
    value = "UPDATE job_scheduler_clean.job_executions " +
            "SET status = 'RUNNING', worker_id = :workerId, started_at = :now, lease_expiry_at = :leaseExpiry " +
            "WHERE id = :executionId and status = 'QUEUED'")
    int claimExecution(@Param("executionId") UUID executionId,
                       @Param("workerId") String workerId,
                       @Param("now") Instant now,
                       @Param("leaseExpiry") Instant leaseExpiry);

    @Query(nativeQuery = true,
    value = """
    SELECT * FROM job_scheduler_clean.job_executions
    WHERE (status = 'RETRYING' AND scheduled_for <= :now)
    OR (status = 'RUNNING' AND lease_expiry_at <= :now)
    ORDER BY scheduled_for desc
    LIMIT :batchsize
    FOR UPDATE SKIP LOCKED
""")
    List<JobExecution> claimRecoveryExecutions(@Param("now") Instant now, @Param("batchsize") int batchsize);

    List<JobExecution> findByJob_IdOrderByScheduledForDesc(UUID jobId);

    @Query("SELECT je.status, count(je) FROM JobExecution je JOIN je.job j WHERE j.userId = :userId GROUP BY je.status")
    List<Object[]> countExecutionsByStatus(@Param("userId") UUID userId);

    @Query(nativeQuery = true, value = """
        SELECT date_trunc('hour', je.started_at) as hour_bucket, je.status, count(je.id)
        FROM job_scheduler_clean.job_executions je
        JOIN job_scheduler_clean.jobs j ON je.job_id = j.id
        WHERE j.user_id = :userId AND je.started_at >= :since
        GROUP BY date_trunc('hour', je.started_at), je.status
        ORDER BY hour_bucket ASC
    """)
    List<Object[]> getHourlyMetrics(@Param("userId") UUID userId, @Param("since") Instant since);
}
