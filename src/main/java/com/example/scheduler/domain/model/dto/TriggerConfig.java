package com.example.scheduler.domain.model.dto;

import com.example.scheduler.domain.model.enums.ScheduleType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TriggerConfig {
    private ScheduleType type;
    private String cronExpression;   // only for CRON

    private Long intervalSeconds;    // only for FIXED_RATE or FIXED_DELAY
    private Long initialDelaySeconds;
}
