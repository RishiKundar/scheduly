package com.scheduling.schedulingservice.repo;

import com.scheduling.schedulingservice.entity.OutBoxEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OutBoxEventRepository extends JpaRepository<OutBoxEvent, UUID> {

    @Query(nativeQuery = true,
    value = "SELECT * FROM job_scheduler_clean.outbox_events WHERE processed = false ORDER BY created_at ASC LIMIT :batchSize FOR UPDATE SKIP LOCKED")
    List<OutBoxEvent> claimUnprocessedEvent(@Param("batchSize") int batchSize);
}
