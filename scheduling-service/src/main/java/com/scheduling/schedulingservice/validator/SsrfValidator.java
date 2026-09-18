package com.scheduling.schedulingservice.validator;

import org.springframework.stereotype.Component;

@Component
public class SsrfValidator {

    public boolean isUnsafeUrl(String url){
        return url.contains("localhost")
                || url.contains("127.0.0.1")
                || url.contains("0.0.0.0")
                || url.contains("169.254.169.254")
                || url.contains(".internal")
                || url.contains(".local");
    }
}
