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
public class JobResponseDto {
    private UUID id;
    private String name;
    private String scheduleType;
    private String cronExpression;
    private Long intervalSeconds;
    private Long initialDelaySeconds;
    private String payload;
    private String status;
    private int version;
    private Instant createdAt;
    private Instant updatedAt;
}
