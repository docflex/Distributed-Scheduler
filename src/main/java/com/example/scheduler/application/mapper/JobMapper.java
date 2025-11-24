package com.example.scheduler.application.mapper;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.scheduler.application.dto.*;
import com.example.scheduler.domain.model.JobDefinition;
import com.example.scheduler.domain.model.enums.JobStatus;
import com.example.scheduler.domain.model.enums.ScheduleType;
import com.example.scheduler.infrastructure.persistence.entity.JobExecutionLogEntity;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.UUID;

@Component
public class JobMapper {

    private final ObjectMapper objectMapper;

    public JobMapper(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public JobDefinition toDomain(CreateJobRequestDto dto) {
        if (dto.getScheduleType() == null) {
            throw new IllegalArgumentException("Schedule type is required.");
        }

        ScheduleType type = ScheduleType.valueOf(dto.getScheduleType());

        String cron = null;
        Long interval = null;
        Long initialDelay = null;

        switch (type) {
            case CRON -> {
                if (dto.getCronExpression() == null) {
                    throw new IllegalArgumentException("Cron expression required for CRON.");
                }
                cron = dto.getCronExpression();
            }
            case FIXED_RATE -> {
                if (dto.getIntervalSeconds() == null) {
                    throw new IllegalArgumentException("intervalSeconds required for FIXED_RATE.");
                }
                interval = dto.getIntervalSeconds();
            }
            case FIXED_DELAY -> {
                if (dto.getIntervalSeconds() == null) {
                    throw new IllegalArgumentException("intervalSeconds required for FIXED_DELAY.");
                }
                interval = dto.getIntervalSeconds();
                initialDelay = dto.getInitialDelaySeconds();
            }
        }

        String payloadJson;
        try {
            payloadJson = dto.getPayload() == null ? null : objectMapper.writeValueAsString(dto.getPayload());
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Invalid payload JSON", e);
        }

        Instant now = Instant.now();
        return new JobDefinition(
                UUID.randomUUID(),
                dto.getName(),
                type,
                cron,
                interval,
                initialDelay,
                payloadJson,
                JobStatus.ACTIVE,
                0,
                now,
                now
        );
    }

    public JobResponseDto toDto(JobDefinition job) {
        JobResponseDto dto = new JobResponseDto();
        dto.setId(job.getId());
        dto.setName(job.getName());
        dto.setScheduleType(job.getScheduleType().name());
        dto.setCronExpression(job.getCronExpression());
        dto.setIntervalSeconds(job.getIntervalSeconds());
        dto.setInitialDelaySeconds(job.getInitialDelaySeconds());
        dto.setPayload(job.getPayload());
        dto.setStatus(job.getStatus().toString());
        dto.setVersion(job.getVersion());
        dto.setCreatedAt(job.getCreatedAt());
        dto.setUpdatedAt(job.getUpdatedAt());
        return dto;
    }

    public ExecutionLogResponseDto toDto(JobExecutionLogEntity e) {
        ExecutionLogResponseDto dto = new ExecutionLogResponseDto();
        dto.setId(e.getId());
        dto.setJobId(e.getJobId());
        dto.setFireTime(e.getFireTime());
        dto.setStatus(e.getStatus());
        dto.setErrorMessage(e.getErrorMessage());
        dto.setCreatedAt(e.getCreatedAt());
        return dto;
    }
}
