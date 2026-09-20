package com.scheduling.schedulingservice.repo;

import com.scheduling.schedulingservice.entity.JobAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface JobAttemptRepository extends JpaRepository<JobAttempt, UUID> {

    Integer countByJobExecution_Id(UUID executionId);
}
