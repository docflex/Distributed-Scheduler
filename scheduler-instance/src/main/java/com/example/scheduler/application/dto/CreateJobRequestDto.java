package com.example.scheduler.application.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
public class CreateJobRequestDto {
    private String name;
    private String description;
    private String scheduleType;      // CRON / FIXED_RATE / FIXED_DELAY
    private String cronExpression;    // for CRON
    private Long intervalSeconds;     // for FIXED_RATE or FIXED_DELAY
    private Long initialDelaySeconds; // for FIXED_DELAY
    private Map<String, Object> payload; // will be JSON-serialized
}
