package com.example.scheduler.infrastructure.quartz;

import com.example.scheduler.infrastructure.persistence.entity.JobExecutionLogEntity;
import com.example.scheduler.infrastructure.persistence.repository.JobExecutionLogJpaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class QuartzJobExecutor implements Job {

    private final JobExecutionLogJpaRepository executionLogRepository;
    // TODO: inject a domain service that actually performs the work the job represents

    @Override
    public void execute(JobExecutionContext context) {
        String jobIdStr = context.getMergedJobDataMap().getString("jobId");
        String payload = context.getMergedJobDataMap().getString("payload");

        UUID jobId = UUID.fromString(jobIdStr);
        Instant fireTime = context.getFireTime().toInstant();

        log.info("Executing jobId={} payload={}", jobId, payload);

        JobExecutionLogEntity logEntity = new JobExecutionLogEntity();
        logEntity.setId(UUID.randomUUID());
        logEntity.setJobId(jobId);
        logEntity.setFireTime(fireTime);
        logEntity.setCreatedAt(Instant.now());

        try {
            // TODO: call domain service with jobId + payload

            logEntity.setStatus("SUCCESS");
            logEntity.setErrorMessage(null);
        } catch (Exception e) {
            log.error("Job {} failed", jobId, e);
            logEntity.setStatus("FAILED");
            logEntity.setErrorMessage(e.getMessage());
        }

        executionLogRepository.save(logEntity);
    }
}
