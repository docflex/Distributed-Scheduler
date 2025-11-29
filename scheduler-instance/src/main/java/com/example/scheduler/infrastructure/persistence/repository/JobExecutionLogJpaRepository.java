package com.example.scheduler.infrastructure.persistence.repository;

import com.example.scheduler.infrastructure.persistence.entity.JobExecutionLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface JobExecutionLogJpaRepository extends JpaRepository<JobExecutionLogEntity, UUID> {

    List<JobExecutionLogEntity> findByJobIdOrderByFireTimeDesc(UUID jobId);
}
