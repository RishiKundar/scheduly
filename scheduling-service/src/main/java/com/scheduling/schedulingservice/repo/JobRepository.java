package com.scheduling.schedulingservice.repo;


import com.scheduling.schedulingservice.entity.Job;
import com.scheduling.schedulingservice.enums.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface JobRepository  extends JpaRepository<Job, UUID> {

    @Query(nativeQuery = true,
    value = """
    SELECT *
    FROM job_scheduler_clean.jobs
    WHERE next_execution_at <= :now AND STATUS = 'ACTIVE'
    ORDER BY next_execution_at, id
    LIMIT :batchsize
    FOR UPDATE SKIP LOCKED
    """)
    List<Job> claimDueJobs(@Param("now") Instant now, @Param("batchsize") int batchSize);

    List<Job> findByUserId(UUID userid);

    List<Job> findByStatus(JobStatus jobStatus);

    long countByUserId(UUID userId);
    long countByUserIdAndStatus(UUID userId, JobStatus status);
}
