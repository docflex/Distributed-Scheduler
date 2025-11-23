package com.example.scheduler.infrastructure.persistence.repository;

import com.example.scheduler.infrastructure.persistence.entity.JobDefinitionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface JobDefinitionJpaRepository extends JpaRepository<JobDefinitionEntity, UUID> {

    List<JobDefinitionEntity> findByStatus(String status);
}
