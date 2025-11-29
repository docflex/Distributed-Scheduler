package com.example.scheduler.domain.port;

import com.example.scheduler.domain.model.JobDefinition;
import com.example.scheduler.domain.model.JobId;

import java.util.List;
import java.util.Optional;

public interface JobDefinitionRepositoryPort {

    JobDefinition save(JobDefinition jobDefinition);

    Optional<JobDefinition> findById(JobId id);

    List<JobDefinition> findAllActive();

    void delete(JobId jobId);

    boolean exists(JobId id);

    List<JobDefinition> findAll();
}
