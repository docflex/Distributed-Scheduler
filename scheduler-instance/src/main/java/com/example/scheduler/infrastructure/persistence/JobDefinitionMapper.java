package com.example.scheduler.infrastructure.persistence;

import com.example.scheduler.domain.model.JobDefinition;
import com.example.scheduler.domain.model.JobId;
import com.example.scheduler.domain.model.enums.JobStatus;
import com.example.scheduler.infrastructure.persistence.entity.JobDefinitionEntity;


public class JobDefinitionMapper {

    public static JobDefinitionEntity toEntity(JobDefinition domain) {
        return JobDefinitionEntity.builder()
                .id(domain.getId())
                .name(domain.getName())
                .scheduleType(domain.getScheduleType().name())
                .cronExpression(domain.getCronExpression())
                .intervalSeconds(domain.getIntervalSeconds())
                .initialDelaySeconds(domain.getInitialDelaySeconds())
                .payload(domain.getPayload())
                .status(domain.getStatus().toString())
                .version(domain.getVersion())
                .createdAt(domain.getCreatedAt())
                .updatedAt(domain.getUpdatedAt())
                .build();
    }

    public static JobDefinition toDomain(JobDefinitionEntity entity) {
        return JobDefinition.builder()
                .id(new JobId(entity.getId()).value())
                .name(entity.getName())
                .scheduleType(entity.getScheduleType() != null
                        ? Enum.valueOf(com.example.scheduler.domain.model.enums.ScheduleType.class, entity.getScheduleType())
                        : null)
                .cronExpression(entity.getCronExpression())
                .intervalSeconds(entity.getIntervalSeconds())
                .initialDelaySeconds(entity.getInitialDelaySeconds())
                .payload(entity.getPayload())
                .status(JobStatus.valueOf(entity.getStatus()))
                .version(entity.getVersion())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
