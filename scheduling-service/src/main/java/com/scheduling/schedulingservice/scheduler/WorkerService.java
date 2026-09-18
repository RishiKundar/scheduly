package com.scheduling.schedulingservice.scheduler;

import com.scheduling.schedulingservice.entity.Worker;
import com.scheduling.schedulingservice.repo.JobExecutionRepository;
import com.scheduling.schedulingservice.repo.WorkerRepository;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class WorkerService {

    private final WorkerRepository workerRepository;
    private final JobExecutionRepository jobExecutionRepository;
    private final JobExecutor jobExecutor;

    private static final String WORKER_ID = "worker-" + UUID.randomUUID().toString();

    @PostConstruct
    public void registerWorker(){
        Worker worker = new Worker();
        worker.setId(WORKER_ID);
        worker.setStatus("ACTIVE");
        worker.setLastHeartbeat(Instant.now());
        workerRepository.save(worker);
        log.info("Registered worker node with ID: {}", WORKER_ID);
    }


    @KafkaListener(topics = "job-scheduling-topic", groupId = "scheduling-group")
    public void consumeJob(String executionId){
        UUID exeId = UUID.fromString(executionId);
        log.info("Worker received execution Id: {} ", exeId);

        int rowsUpdated = jobExecutionRepository.claimExecution(
                exeId,
                WORKER_ID,
                Instant.now(),
                Instant.now().plus(5, ChronoUnit.MINUTES));

        if(rowsUpdated == 1){
            log.info("Worker {} successfully claimed execution {}", WORKER_ID, exeId);
            jobExecutor.execute(exeId);
        }else{
            log.warn("Execution {} already claimed or cancelled. Worker {} ignoring.", exeId, WORKER_ID);
        }
    }
}
