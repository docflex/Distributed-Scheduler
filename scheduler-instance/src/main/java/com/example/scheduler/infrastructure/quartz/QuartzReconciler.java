package com.example.scheduler.infrastructure.quartz;

import com.example.scheduler.domain.port.JobDefinitionRepositoryPort;
import com.example.scheduler.domain.model.JobDefinition;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.quartz.SchedulerException;
import org.quartz.Scheduler;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@AllArgsConstructor
public class QuartzReconciler {

    private final JobDefinitionRepositoryPort jobRepo;
    private final QuartzSchedulingAdapter schedulingAdapter;
    private final Scheduler scheduler;

    @EventListener(ApplicationReadyEvent.class)
    public void reconcileOnStartup() throws SchedulerException {
        log.info("🔄 Reconciling jobs on startup...");
        // Optionally clear existing jobs or diff them; for now, we’ll just ensure all ACTIVE jobs are scheduled.
        List<JobDefinition> activeJobs = jobRepo.findAllActive();

        for (JobDefinition job : activeJobs) {
            // If trigger already exists, reschedule; else schedule.
            try {
                var triggerKey = schedulingAdapter.triggerKey(job.getId());
                if (scheduler.checkExists(schedulingAdapter.jobKey(job.getId()))) {
                    schedulingAdapter.reschedule(job);
                    log.info("🔁 Re-scheduled job '{}'", job.getName());
                } else {
                    schedulingAdapter.schedule(job);
                    log.info("🆕 Scheduled job '{}'", job.getName());
                }
            } catch (SchedulerException e) {
                log.error("❌ Failed scheduling job {} on startup", job.getId(), e);
            }
        }

        log.info("✅ Startup reconciliation complete.");
    }
}
