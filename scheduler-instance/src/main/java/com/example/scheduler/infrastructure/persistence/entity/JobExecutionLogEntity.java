package com.example.scheduler.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "job_execution_log")
@Getter
@Setter
public class JobExecutionLogEntity {

    @Id
    private UUID id;

    @Column(name = "job_id", nullable = false)
    private UUID jobId;

    @Column(name = "fire_time", nullable = false)
    private Instant fireTime;

    @Column(name = "status", nullable = false)
    private String status;  // SUCCESS / FAILED

    @Column(name = "error_message")
    private String errorMessage;

    @Column(name = "created_at")
    private Instant createdAt;
}
