package com.scheduling.schedulingservice.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.scheduling.schedulingservice.entity.Job;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebhookClient {

    private final RestTemplate restTemplate;

    @CircuitBreaker(name = "webhook")
    public ResponseEntity<String> customExchanger(String url, HttpMethod httpMethod, HttpEntity<String> httpEntity){
        return restTemplate.exchange(url,httpMethod,httpEntity,String.class);
    }



}
