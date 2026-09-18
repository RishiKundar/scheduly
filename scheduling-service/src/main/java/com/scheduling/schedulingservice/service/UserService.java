package com.scheduling.schedulingservice.service;


import com.scheduling.schedulingservice.dto.UserRequestDto;
import com.scheduling.schedulingservice.entity.User;
import com.scheduling.schedulingservice.enums.Role;
import com.scheduling.schedulingservice.repo.UserRepository;
import com.scheduling.schedulingservice.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserDetailsService userDetailsService;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public void createUser(UserRequestDto userRequestDto){
        User user  = new User();
        user.setEmail(userRequestDto.email());
        user.setPassword(passwordEncoder.encode(userRequestDto.password()));
        user.setRole(userRequestDto.role());
        userRepository.save(user);
    }

    public Map<String,String> login(String username,String password){
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username,password));
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        Map<String,String> response = new HashMap<>();
        String token = jwtUtil.generateToken(userDetails);
        response.put("token",token);
        response.put("status","200");
        return response;
    }
}
