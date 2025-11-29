package com.example.scheduler.infrastructure.quartz;

import com.example.scheduler.domain.model.JobDefinition;
import com.example.scheduler.domain.model.enums.ScheduleType;
import com.example.scheduler.domain.port.JobSchedulerPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.quartz.*;
import org.quartz.impl.matchers.GroupMatcher;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class QuartzSchedulingAdapter implements JobSchedulerPort {

    private final Scheduler scheduler;

    // ============================================================
    // Key helpers (SINGLE SOURCE OF TRUTH)
    // ============================================================
    private static final String JOB_GROUP = "JOB_GROUP";
    private static final String TRIGGER_GROUP = "TRIGGER_GROUP";

    public JobKey jobKey(UUID id) {
        return JobKey.jobKey(id.toString(), JOB_GROUP);
    }

    public TriggerKey triggerKey(UUID id) {
        return TriggerKey.triggerKey(id.toString(), TRIGGER_GROUP);
    }

    // ============================================================
    // Core scheduling methods used by API + Reconciler
    // ============================================================
    @Override
    public void scheduleJob(JobDefinition job) {
        try {
            scheduler.scheduleJob(buildJobDetail(job), buildTrigger(job));
        } catch (SchedulerException e) {
            throw new RuntimeException(e);
        }
    }

    // same as scheduleJob but cleaner for reconciler
    public void schedule(JobDefinition job) {
        scheduleJob(job);
    }

    public void reschedule(JobDefinition job) {
        try {
            scheduler.rescheduleJob(triggerKey(job.getId()), buildTrigger(job));
        } catch (SchedulerException e) {
            throw new RuntimeException(e);
        }
    }

    // ============================================================
    // Builders
    // ============================================================
    private JobDetail buildJobDetail(JobDefinition job) {

        JobDataMap map = new JobDataMap();
        map.put("jobId", job.getId().toString());
        map.put("payload", job.getPayload());

        return JobBuilder.newJob(QuartzJobExecutor.class)
                .withIdentity(jobKey(job.getId()))
                .withDescription(job.getName())
                .usingJobData(map)
                .storeDurably(false)
                .build();
    }

    private Trigger buildTrigger(JobDefinition job) {

        TriggerBuilder<Trigger> tb = TriggerBuilder.newTrigger()
                .withIdentity(triggerKey(job.getId()))
                .forJob(jobKey(job.getId()))
                .startAt(new Date(System.currentTimeMillis() + 1000));

        switch (job.getScheduleType()) {
            case CRON:
                tb.withSchedule(
                        CronScheduleBuilder.cronSchedule(job.getCronExpression())
                );
                break;

            case FIXED_RATE:
                tb.withSchedule(
                        SimpleScheduleBuilder.simpleSchedule()
                                .withIntervalInMilliseconds(job.getIntervalSeconds() * 1000)
                                .repeatForever()
                );
                break;

            case FIXED_DELAY:
                tb.withSchedule(
                        SimpleScheduleBuilder.simpleSchedule()
                                .withIntervalInMilliseconds(job.getIntervalSeconds() * 1000)
                                .repeatForever()
                );
                tb.startAt(Date.from(Instant.now().plusSeconds(job.getInitialDelaySeconds())));
                break;
        }

        return tb.build();
    }

    // ============================================================
    // Pause / Resume / Delete / Run
    // ============================================================
    @Override
    public void pauseJob(String jobId) {
        try {
            scheduler.pauseJob(jobKey(UUID.fromString(jobId)));
        } catch (Exception e) {
            throw new RuntimeException("Failed to pause job " + jobId, e);
        }
    }

    @Override
    public void resumeJob(String jobId) {
        try {
            scheduler.resumeJob(jobKey(UUID.fromString(jobId)));
        } catch (Exception e) {
            throw new RuntimeException("Failed to resume job " + jobId, e);
        }
    }

    @Override
    public void deleteJob(String jobId) {
        try {
            scheduler.deleteJob(jobKey(UUID.fromString(jobId)));
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete job " + jobId, e);
        }
    }

    @Override
    public void runNow(String jobId) {
        try {
            scheduler.triggerJob(jobKey(UUID.fromString(jobId)));
        } catch (Exception e) {
            throw new RuntimeException("Failed to run job now " + jobId, e);
        }
    }

    // ============================================================
    // Queries
    // ============================================================
    @Override
    public boolean exists(String jobId) {
        try {
            return scheduler.checkExists(jobKey(UUID.fromString(jobId)));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public String getQuartzState(String jobId) {
        try {
            TriggerKey key = triggerKey(UUID.fromString(jobId));
            Trigger.TriggerState state = scheduler.getTriggerState(key);
            return state.name();
        } catch (SchedulerException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<String> listAllQuartzJobs() {
        try {
            return scheduler.getJobKeys(GroupMatcher.anyJobGroup())
                    .stream()
                    .map(JobKey::getName)
                    .toList();
        } catch (SchedulerException e) {
            throw new RuntimeException(e);
        }
    }
}