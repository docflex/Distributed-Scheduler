package com.example.scheduler.application.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class TriggerConfigDto {
    private ScheduleTypeDto type;
    private String cronExpression;
    private Long intervalSeconds;
    private Long initialDelaySeconds;
}