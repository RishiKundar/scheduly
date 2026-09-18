package com.scheduling.schedulingservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;

public record UserRequestDto(
        @NotNull @Email String email,
        @NotNull String password,
        @NotNull String role
) {
}
