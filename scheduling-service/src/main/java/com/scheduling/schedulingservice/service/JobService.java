package com.scheduling.schedulingservice.service;


import com.scheduling.schedulingservice.dto.JobRequest;
import com.scheduling.schedulingservice.dto.JobResponseDto;
import com.scheduling.schedulingservice.entity.Job;
import com.scheduling.schedulingservice.entity.User;
import com.scheduling.schedulingservice.exception.JobException;
import com.scheduling.schedulingservice.repo.JobRepository;
import com.scheduling.schedulingservice.repo.UserRepository;
import com.scheduling.schedulingservice.util.EncryptionUtil;
import com.scheduling.schedulingservice.validator.SsrfValidator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Clock;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class JobService {

    private final SsrfValidator ssrfValidator;
    private final JobRepository jobRepository;
    private final com.scheduling.schedulingservice.repo.JobExecutionRepository jobExecutionRepository;
    private final UserRepository userRepository;
    private final EncryptionUtil encryptionUtil;

    public void createJob(JobRequest jobRequest){

        if(ssrfValidator.isUnsafeUrl (jobRequest.targetUrl())){
            throw new JobException("The Provided URL is not Safe");
        }

        UUID userId = getCurrentUserID();

        Job job = new Job();
        job.setName(jobRequest.name());
        job.setUserId(userId);
        job.setStatus("ACTIVE");
        job.setTargetUrl(jobRequest.targetUrl());
        job.setHttpMethod(jobRequest.httpMethod());
        job.setHeaders(encrypt(jobRequest.headers()));
        job.setPayload(jobRequest.payload());
        job.setScheduleType(jobRequest.scheduleType());
        job.setCronExpression(jobRequest.cronExpression());
        job.setTimezone(jobRequest.timezone() != null ? jobRequest.timezone() : Instant.now(Clock.systemUTC()).toString());
        job.setNextExecutionAt(jobRequest.nextExecutionAt() != null ? jobRequest.nextExecutionAt() : Instant.now(Clock.systemUTC()));
        job.setMaxRetries(jobRequest.maxRetries());
        jobRepository.save(job);
    }

    private String encrypt(String headers){
            String encrypted = null;
            try{
                encrypted = encryptionUtil.encrypt(headers);
            } catch (Exception e) {
                log.error("Error in encrypting",e);
            }
            return encrypted;
    }

    public List<JobResponseDto> getJobs(){
        UUID userId = getCurrentUserID();
        List<Job> jobList = jobRepository.findByUserId(userId);
        return jobList.stream().map(job -> new JobResponseDto(
                job.getId().toString(),
                job.getName(),
                job.getStatus(),
                job.getTargetUrl(),
                job.getHttpMethod(),
                job.getHeaders().toString(),
                job.getPayload(),
                job.getScheduleType(),
                job.getCronExpression(),
                job.getNextExecutionAt(),
                job.getMaxRetries()
        )).collect(Collectors.toList());
    }

    public String getCurrentUsername(){
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    public UUID getCurrentUserID(){
        String username = getCurrentUsername();
        User user = userRepository.findByEmail(username).get();
        return user.getId();
    }

    public void deleteJob(UUID jobId) {
        Job job = jobRepository.findById(jobId)
            .orElseThrow(() -> new JobException("Job not found"));
        if (!job.getUserId().equals(getCurrentUserID())) {
            throw new JobException("Unauthorized to delete this job");
        }
        jobRepository.delete(job);
    }

    public List<com.scheduling.schedulingservice.entity.JobExecution> getJobExecutions(UUID jobId) {
        Job job = jobRepository.findById(jobId)
            .orElseThrow(() -> new JobException("Job not found"));
        if (!job.getUserId().equals(getCurrentUserID())) {
            throw new JobException("Unauthorized to view this job");
        }
        return jobExecutionRepository.findByJobIdOrderByScheduledForDesc(jobId);
    }
}
