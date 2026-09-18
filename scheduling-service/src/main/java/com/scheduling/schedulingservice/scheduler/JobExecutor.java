package com.scheduling.schedulingservice.scheduler;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.scheduling.schedulingservice.entity.Job;
import com.scheduling.schedulingservice.entity.JobAttempt;
import com.scheduling.schedulingservice.entity.JobExecution;
import com.scheduling.schedulingservice.repo.JobAttemptRepository;
import com.scheduling.schedulingservice.repo.JobExecutionRepository;
import com.scheduling.schedulingservice.repo.JobRepository;
import com.scheduling.schedulingservice.util.EncryptionUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class JobExecutor {

    private final JobRepository jobRepository;
    private final JobExecutionRepository jobExecutionRepository;
    private final JobAttemptRepository jobAttemptRepository;
    private final RestTemplate restTemplate;
    private final EncryptionUtil encryptionUtil;

    public void execute(UUID executionId){
        Integer attempts = jobAttemptRepository.countByExecutionId(executionId);
        JobAttempt jobAttempt = new JobAttempt();
        jobAttempt.setExecutionId(executionId);
        jobAttempt.setAttemptNumber(attempts + 1);
        jobAttempt.setStartedAt(Instant.now());
        Optional<JobExecution> optionalJobExecution = jobExecutionRepository.findById(executionId);
        if(optionalJobExecution.isPresent()){
            JobExecution jobExecution = optionalJobExecution.get();
            Optional<Job> optionalJob = jobRepository.findById(jobExecution.getJobId());
            if(optionalJob.isPresent()){
                Job job = optionalJob.get();
                String url = job.getTargetUrl();
                JsonNode headers = getHeader(job.getHeaders());
                String httpMethod = job.getHttpMethod();
                String payload = job.getPayload();
                HttpMethod method = HttpMethod.valueOf(httpMethod.toUpperCase());
                HttpHeaders httpHeaders = new HttpHeaders();
                if (headers != null && headers.isObject()) {
                    headers.fields().forEachRemaining(entry ->
                            httpHeaders.set(entry.getKey(),entry.getValue().asText()));
                }
                HttpEntity<String> requestEntity = new HttpEntity<>(payload,httpHeaders);
                try{
                    jobAttemptRepository.save(jobAttempt);
                    ResponseEntity<String> response = restTemplate.exchange(url,method,requestEntity,String.class);
                    jobExecution.setStatus("SUCCESS");
                    jobAttempt.setEndedAt(Instant.now());
                    jobAttempt.setHttpStatusCode(response.getStatusCode().value());
                    jobAttempt.setResponseBody(response.getBody());
                } catch (RestClientResponseException e) {
                    log.error("HTTP request failed with status: {}", e.getStatusCode());
                    handleFailure(jobExecution,jobAttempt,job);
                    jobAttempt.setEndedAt(Instant.now());
                    jobAttempt.setHttpStatusCode(e.getStatusCode().value());
                    jobAttempt.setResponseBody(e.getMessage());
                } catch (Exception e){
                    log.error("Network error executing job: {}", e.getMessage());
                    handleFailure(jobExecution,jobAttempt,job);
                    jobAttempt.setEndedAt(Instant.now());
                    jobAttempt.setHttpStatusCode(500);
                    jobAttempt.setResponseBody(e.getMessage());
                }finally {
                    jobExecution.setCompletedAt(Instant.now());
                    jobExecutionRepository.save(jobExecution);
                    jobAttemptRepository.save(jobAttempt);
                }
            }else{
                // No Job was found
                log.warn("No Jobs were found for the executionId : {}", executionId);
                return;
            }
        }else{
            // No Job Execution was present
            log.warn("No Execution Id was found in the Database : {} ", executionId);
            return;
        }
    }

    private String decrypt(String headers){
        String decrypt = null;
        try{
            decrypt = encryptionUtil.decrypt(headers);
        } catch (Exception e) {
            log.error("Error in encrypting",e);
        }
        return decrypt;
    }

    private JsonNode getHeader(String jsonString) {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = null;
        try {
            jsonNode = objectMapper.readTree(decrypt(jsonString));
        } catch (IOException e) {
            log.error("Error in Parsing Json {} ", jsonString);
            log.error("Exception Caught",e);
        }
        return jsonNode;
    }


    private void handleFailure(JobExecution jobExecution, JobAttempt jobAttempt, Job job){
        if(jobAttempt.getAttemptNumber() < job.getMaxRetries()){
            jobExecution.setStatus("RETRYING");
            long secondsToWait = jobAttempt.getAttemptNumber() * 10;
            jobExecution.setScheduledFor(Instant.now().plusSeconds(secondsToWait));
            jobExecution.setWorkerId(null);
            jobExecution.setLeaseExpiryAt(null);
            log.warn("Execution {} failed, will retry at {}", jobExecution.getId(), jobExecution.getScheduledFor());
        }else{
            jobExecution.setStatus("DEAD_LETTER");
            log.error("Execution {} permanently failed after {} attempts", jobExecution.getId(), jobAttempt.getAttemptNumber());
        }
    }
}
