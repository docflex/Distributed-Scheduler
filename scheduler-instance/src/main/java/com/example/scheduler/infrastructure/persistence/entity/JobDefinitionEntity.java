package com.example.scheduler.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "job_definition")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class JobDefinitionEntity {

    @Id
    private UUID id;

    private String name;

    @Column(name = "schedule_type")
    private String scheduleType;

    @Column(name = "cron_expression")
    private String cronExpression;

    @Column(name = "interval_seconds")
    private Long intervalSeconds;

    @Column(name = "initial_delay_seconds")
    private Long initialDelaySeconds;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private String payload;

    private String status;

    private Integer version;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;
}
