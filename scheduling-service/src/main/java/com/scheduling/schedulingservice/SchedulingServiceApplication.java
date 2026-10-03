package com.scheduling.schedulingservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.util.Arrays;

@SpringBootApplication
@EnableScheduling
@EnableCaching
public class SchedulingServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(SchedulingServiceApplication.class, args);
    }

}
