package com.scheduling.schedulingservice.scheduler;


import com.scheduling.schedulingservice.entity.OutBoxEvent;
import com.scheduling.schedulingservice.repo.OutBoxEventRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OutboxRelayService {

    private final OutBoxEventRepository outBoxEventRepository;
    private final KafkaTemplate<String,String> kafkaTemplate;

    @Transactional
    @Scheduled(fixedDelay = 2000)
    void processOutBoxEvents(){
        List<OutBoxEvent> unclaimedOutBoxEvents = outBoxEventRepository.claimUnprocessedEvent(3);

        for(OutBoxEvent outBoxEvent : unclaimedOutBoxEvents){
            kafkaTemplate.send("job-scheduling-topic", outBoxEvent.getAggregateId());
            outBoxEvent.setProcessed(true);
            outBoxEventRepository.save(outBoxEvent);
        }
    }
}
