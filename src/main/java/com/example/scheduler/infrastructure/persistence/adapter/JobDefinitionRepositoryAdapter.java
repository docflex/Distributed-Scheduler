package com.example.scheduler.infrastructure.persistence.adapter;

import com.example.scheduler.domain.model.JobDefinition;
import com.example.scheduler.domain.model.JobId;
import com.example.scheduler.domain.model.enums.JobStatus;
import com.example.scheduler.domain.port.JobDefinitionRepositoryPort;
import com.example.scheduler.infrastructure.persistence.JobDefinitionMapper;
import com.example.scheduler.infrastructure.persistence.entity.JobDefinitionEntity;
import com.example.scheduler.infrastructure.persistence.repository.JobDefinitionJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class JobDefinitionRepositoryAdapter implements JobDefinitionRepositoryPort {

    private final JobDefinitionJpaRepository jpaRepository;

    @Override
    public JobDefinition save(JobDefinition jobDefinition) {
        JobDefinitionEntity entity = JobDefinitionMapper.toEntity(jobDefinition);
        JobDefinitionEntity saved = jpaRepository.save(entity);
        return JobDefinitionMapper.toDomain(saved);
    }

    @Override
    public Optional<JobDefinition> findById(JobId id) {
        return jpaRepository.findById(id.value())
                .map(JobDefinitionMapper::toDomain);
    }

    @Override
    public List<JobDefinition> findAllActive() {
        return jpaRepository.findByStatus(JobStatus.ACTIVE.name())
                .stream()
                .map(JobDefinitionMapper::toDomain)
                .toList();
    }

    @Override
    public void delete(JobId jobId) {
        jpaRepository.deleteById(jobId.value());
    }

    @Override
    public boolean exists(JobId id) {
        return jpaRepository.existsById(id.value());
    }

    @Override
    public List<JobDefinition> findAll() {
        return jpaRepository.findAll().stream()
                .map(JobDefinitionMapper::toDomain)
                .toList();
    }

}
