package com.scheduling.schedulingservice.controller;


import com.scheduling.schedulingservice.dto.LoginDto;
import com.scheduling.schedulingservice.dto.UserRequestDto;
import com.scheduling.schedulingservice.entity.User;
import com.scheduling.schedulingservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/user")
    public ResponseEntity<Object> addUser(@RequestBody UserRequestDto userRequestDto){
        userService.createUser(userRequestDto);
        return ResponseEntity.ok("User is Created");
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String,String>> login(@RequestBody LoginDto loginDto){
        return ResponseEntity.ok().body(userService.login(loginDto.email(), loginDto.password()));
    }

}
