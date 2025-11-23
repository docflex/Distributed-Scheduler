package com.example.scheduler.domain.model;

import com.example.scheduler.domain.model.enums.JobStatus;
import com.example.scheduler.domain.model.enums.ScheduleType;
import lombok.*;

import java.util.UUID;
import java.time.Instant;

@Data
@Builder
@Getter
@Setter
@AllArgsConstructor
public class JobDefinition {
    private UUID id;
    private String name;

    private ScheduleType scheduleType;
    private String cronExpression;
    private Long intervalSeconds;
    private Long initialDelaySeconds;

    private String payload;  // JSON
    private JobStatus status;   // ACTIVE, PAUSED, DELETED
    private Integer version;
    private Instant createdAt;
    private Instant updatedAt;

    public boolean isCronSchedule() {
        return this.scheduleType == ScheduleType.CRON;
    }

    public boolean isFixedRateSchedule() {
        return this.scheduleType == ScheduleType.FIXED_RATE;
    }

    public boolean isFixedDelaySchedule() {
        return this.scheduleType == ScheduleType.FIXED_DELAY;
    }
}
