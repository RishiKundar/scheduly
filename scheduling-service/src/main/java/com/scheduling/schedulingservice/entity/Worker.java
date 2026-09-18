package com.scheduling.schedulingservice.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "workers")
@Getter
@Setter
@RequiredArgsConstructor
@AllArgsConstructor
public class Worker {

    @Id
    private String id;
    private String status;
    private Instant lastHeartbeat;
}
