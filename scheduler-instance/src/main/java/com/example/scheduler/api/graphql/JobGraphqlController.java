package com.example.scheduler.api.graphql;

import com.example.scheduler.application.dto.CreateJobRequestDto;
import com.example.scheduler.application.dto.ExecutionLogResponseDto;
import com.example.scheduler.application.dto.JobResponseDto;
import com.example.scheduler.application.service.JobSchedulingService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;
import java.util.UUID;

@Controller
@RequiredArgsConstructor
public class JobGraphqlController {

    private final JobSchedulingService jobSchedulingService;

    // ------------------------
    // Queries
    // ------------------------

    @QueryMapping
    public List<JobResponseDto> jobs() {
        return jobSchedulingService.listJobs();
    }

    @QueryMapping
    public JobResponseDto job(@Argument("id") UUID id) {
        return jobSchedulingService.getJobById(id);
    }

    @QueryMapping
    public List<ExecutionLogResponseDto> jobLogs(@Argument("jobId") UUID jobId) {
        return jobSchedulingService.getExecutionLogs(jobId);
    }

    // ------------------------
    // Mutations
    // ------------------------

    @MutationMapping
    public JobResponseDto createJob(@Argument("input") CreateJobRequestDto input) {
        // GraphQL will map CreateJobInput -> CreateJobRequestDto by field name
        return jobSchedulingService.createJob(input);
    }

    @MutationMapping
    public Boolean runJobNow(@Argument("id") UUID id) {
        jobSchedulingService.runJobNow(id);
        return true;
    }

    @MutationMapping
    public Boolean deleteJob(@Argument("id") UUID id) {
        jobSchedulingService.deleteJob(id);
        return true;
    }

    @MutationMapping
    public JobResponseDto pauseJob(@Argument("id") UUID id) {
        return jobSchedulingService.pauseJob(id);
    }

    @MutationMapping
    public JobResponseDto resumeJob(@Argument("id") UUID id) {
        return jobSchedulingService.resumeJob(id);
    }
}
