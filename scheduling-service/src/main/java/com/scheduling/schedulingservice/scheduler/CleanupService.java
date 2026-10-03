package com.scheduling.schedulingservice.scheduler;


import com.scheduling.schedulingservice.entity.Job;
import com.scheduling.schedulingservice.enums.JobStatus;
import com.scheduling.schedulingservice.repo.JobRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CleanupService {

    private final JobRepository jobRepository;

    @SchedulerLock(name = "cleanUpDeletedJob", lockAtLeastFor = "1m",lockAtMostFor = "5m")
    @Scheduled(fixedDelay = 7200000)
    public void cleanUpDeletedJob(){
        log.info("Starting cleanup of DELETED jobs...");
        List<Job> deletedJobs = jobRepository.findByStatus(JobStatus.DELETED);
        if (!deletedJobs.isEmpty()) {
            jobRepository.deleteAll(deletedJobs);
            log.info("Successfully permanently deleted {} jobs and their execution history.", deletedJobs.size());
        }
    }

}
