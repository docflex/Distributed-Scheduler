package com.example.scheduler.infrastructure.quartz;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class GenericQuartzJob implements Job {

    private static final Logger log = LoggerFactory.getLogger(GenericQuartzJob.class);

    @Override
    public void execute(JobExecutionContext context) {
        String jobId = context.getMergedJobDataMap().getString("jobId");
        String payload = context.getMergedJobDataMap().getString("payload");

        // TODO: call a domain service to actually perform the work, using jobId + payload
        log.info("Executing jobId={} with payload={}", jobId, payload);

        // You’d also log to job_execution_log table here via a separate service.
    }
}
