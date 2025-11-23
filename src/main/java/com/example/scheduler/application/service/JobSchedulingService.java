package com.example.scheduler.application.service;

import com.example.scheduler.application.dto.CreateJobRequestDto;
import com.example.scheduler.application.dto.ExecutionLogResponseDto;
import com.example.scheduler.application.dto.JobResponseDto;
import com.example.scheduler.application.mapper.JobMapper;
import com.example.scheduler.domain.model.JobDefinition;
import com.example.scheduler.domain.model.JobId;
import com.example.scheduler.domain.model.enums.JobStatus;
import com.example.scheduler.domain.port.JobDefinitionRepositoryPort;
import com.example.scheduler.domain.port.JobSchedulerPort;
import com.example.scheduler.infrastructure.persistence.repository.JobExecutionLogJpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class JobSchedulingService {

    private final JobDefinitionRepositoryPort jobRepo;
    private final JobSchedulerPort schedulerPort;
    private final JobExecutionLogJpaRepository executionLogRepo;
    private final JobMapper jobMapper;

    public JobSchedulingService(JobDefinitionRepositoryPort jobRepo,
                                JobSchedulerPort schedulerPort,
                                JobExecutionLogJpaRepository executionLogRepo,
                                JobMapper jobMapper) {
        this.jobRepo = jobRepo;
        this.schedulerPort = schedulerPort;
        this.executionLogRepo = executionLogRepo;
        this.jobMapper = jobMapper;
    }

    @Transactional
    public JobResponseDto createJob(CreateJobRequestDto request) {
        JobDefinition job = jobMapper.toDomain(request);
        JobDefinition saved = jobRepo.save(job);
        schedulerPort.scheduleJob(saved);
        return jobMapper.toDto(saved);
    }

    @Transactional
    public JobResponseDto pauseJob(UUID jobId) {
        JobDefinition job = getJob(jobId);
        job.setStatus(JobStatus.PAUSED);
        job.setUpdatedAt(Instant.now());
        JobDefinition saved = jobRepo.save(job);
        schedulerPort.pauseJob(jobId.toString());
        return jobMapper.toDto(saved);
    }

    @Transactional
    public JobResponseDto resumeJob(UUID jobId) {
        JobDefinition job = getJob(jobId);
        job.setStatus(JobStatus.ACTIVE);
        job.setUpdatedAt(Instant.now());
        JobDefinition saved = jobRepo.save(job);
        schedulerPort.resumeJob(jobId.toString());
        return jobMapper.toDto(saved);
    }

    @Transactional
    public void deleteJob(UUID jobId) {
        jobRepo.delete(new JobId(jobId));
        schedulerPort.deleteJob(jobId.toString());
    }

    @Transactional(readOnly = true)
    public List<JobResponseDto> listJobs() {
        return jobRepo.findAll().stream()
                .map(jobMapper::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public JobResponseDto getJobById(UUID id) {
        return jobMapper.toDto(getJob(id));
    }

    @Transactional
    public void runJobNow(UUID id) {
        schedulerPort.runNow(id.toString());
    }

    @Transactional(readOnly = true)
    public List<ExecutionLogResponseDto> getExecutionLogs(UUID jobId) {
        return executionLogRepo.findByJobIdOrderByFireTimeDesc(jobId).stream()
                .map(jobMapper::toDto)
                .toList();
    }

    private JobDefinition getJob(UUID id) {
        return jobRepo.findById(new JobId(id))
                .orElseThrow(() -> new IllegalArgumentException("Job not found: " + id));
    }
}
