package com.scheduling.schedulingservice.scheduler;


import com.scheduling.schedulingservice.entity.Job;
import com.scheduling.schedulingservice.entity.JobExecution;
import com.scheduling.schedulingservice.entity.OutBoxEvent;
import com.scheduling.schedulingservice.enums.JobStatus;
import com.scheduling.schedulingservice.repo.JobExecutionRepository;
import com.scheduling.schedulingservice.repo.JobRepository;

import com.scheduling.schedulingservice.repo.OutBoxEventRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class SchedulerService {

    private final JobRepository jobRepository;
    private final JobExecutionRepository jobExecutionRepository;
    private final OutBoxEventRepository outBoxEventRepository;

    @Transactional
    @Scheduled(fixedDelay = 5000)
    void schedulerLoop(){
        Instant now = Instant.now();
        List<Job> unclaimedJobsList = jobRepository.claimDueJobs(now,3);

        if(unclaimedJobsList.isEmpty()){
            log.info("No Jobs available at {}", now);
            return;
        }

        for(Job job : unclaimedJobsList){
            JobExecution jobExecution = new JobExecution();
            jobExecution.setJob(jobExecution.getJob());
            jobExecution.setStatus("QUEUED");
            jobExecution.setScheduledFor(job.getNextExecutionAt());
            jobExecutionRepository.save(jobExecution);

            OutBoxEvent event = new OutBoxEvent();
            event.setAggregateType("JobExecution");
            event.setAggregateId(jobExecution.getId().toString());
            event.setType("ExecutionDispatched");
            outBoxEventRepository.save(event);

        }

        for(Job job : unclaimedJobsList){
            if (job.getScheduleType() == com.scheduling.schedulingservice.enums.ScheduledType.CRON && job.getCronExpression() != null) {
                try {
                    org.springframework.scheduling.support.CronExpression cron = 
                        org.springframework.scheduling.support.CronExpression.parse(job.getCronExpression());
                    Instant next = cron.next(now.atZone(java.time.ZoneId.of("UTC"))).toInstant();
                    job.setNextExecutionAt(next);
                } catch (Exception e) {
                    log.error("Failed to parse CRON for job " + job.getId(), e);
                    job.setStatus(JobStatus.FAILED);
                }
            } else {
                job.setStatus(JobStatus.COMPLETED);
            }
        }
        jobRepository.saveAll(unclaimedJobsList);
    }


    @Scheduled(fixedDelay = 10000)
    public void recoveryLoop(){
        Instant now  = Instant.now();
        List<JobExecution> jobExecutions = jobExecutionRepository.claimRecoveryExecutions(now,3);

        if(jobExecutions.isEmpty()){
            return;
        }

        for (JobExecution jobExecution : jobExecutions){
            jobExecution.setStatus("QUEUED");
            jobExecution.setWorkerId(null);
            jobExecution.setLeaseExpiryAt(null);

            OutBoxEvent event = new OutBoxEvent();
            event.setAggregateType("JobExecution");
            event.setAggregateId(jobExecution.getId().toString());
            event.setType("ExecutionDispatched");
            outBoxEventRepository.save(event);
        }

        jobExecutionRepository.saveAll(jobExecutions);
    }

}
