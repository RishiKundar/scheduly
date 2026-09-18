package com.scheduling.schedulingservice.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(JobException.class)
    public ResponseEntity<String> handleJobException(JobException ex){
        return ResponseEntity.badRequest().body(ex.getMessage());
    }
}
