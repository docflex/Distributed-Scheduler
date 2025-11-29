package com.example.scheduler.application.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ExecutionLogResponseDto {
    private UUID id;
    private UUID jobId;
    private Instant fireTime;
    private String status;
    private String errorMessage;
    private Instant createdAt;
}
