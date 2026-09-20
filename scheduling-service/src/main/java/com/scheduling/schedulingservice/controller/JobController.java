package com.scheduling.schedulingservice.controller;

import com.scheduling.schedulingservice.dto.JobRequest;
import com.scheduling.schedulingservice.dto.JobResponseDto;
import com.scheduling.schedulingservice.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @PostMapping("/jobs")
    public ResponseEntity<Object> createJob(@Valid @RequestBody JobRequest jobRequest){
        jobService.createJob(jobRequest);
        return ResponseEntity.ok("Job is Created");
    }

    @GetMapping("/jobs")
    public ResponseEntity<List<com.scheduling.schedulingservice.dto.JobResponseDto>> getJobs(){
        return ResponseEntity.ok(jobService.getJobs());
    }

    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<Object> deleteJob(@PathVariable UUID id) {
        jobService.deleteJob(id);
        return ResponseEntity.ok("Job Deleted");
    }

    @GetMapping("/jobs/{id}")
    public ResponseEntity<JobResponseDto> getJobById(@PathVariable UUID id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    @GetMapping("/jobs/{id}/executions")
    public ResponseEntity<List<com.scheduling.schedulingservice.entity.JobExecution>> getJobExecutions(@PathVariable UUID id) {
        return ResponseEntity.ok(jobService.getJobExecutions(id));
    }

}
