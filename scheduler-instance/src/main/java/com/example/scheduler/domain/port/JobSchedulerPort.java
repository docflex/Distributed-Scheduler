package com.example.scheduler.domain.port;

import com.example.scheduler.domain.model.JobDefinition;

import java.util.List;

public interface JobSchedulerPort {

    void scheduleJob(JobDefinition job);

    void pauseJob(String jobId);

    void resumeJob(String jobId);

    void deleteJob(String jobId);

    void runNow(String jobId);

    boolean exists(String jobId);

    String getQuartzState(String jobId);

    List<String> listAllQuartzJobs();
}
