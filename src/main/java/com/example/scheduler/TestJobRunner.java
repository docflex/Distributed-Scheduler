//package com.example.scheduler;
//
//import com.example.scheduler.application.dto.CreateJobRequestDto;
//import com.example.scheduler.application.dto.ScheduleTypeDto;
//import com.example.scheduler.application.dto.TriggerConfigDto;
//import com.example.scheduler.application.service.JobSchedulingService;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.stereotype.Component;
//
//import java.util.Map;
//
//@Slf4j
//@Component
//@RequiredArgsConstructor
//public class TestJobRunner implements CommandLineRunner {
//
//    private final JobSchedulingService jobService;
//
//    @Override
//    public void run(String... args) throws Exception {
//
//        log.info("🚀 Creating test job via JobSchedulingService...");
//
//        CreateJobRequestDto dto = new CreateJobRequestDto(
//                "startup-test-job",
//                "CRON",
//                new TriggerConfigDto(
//                        ScheduleTypeDto.CRON,
//                        "*/5 * * * * ?",      // runs every 5 seconds
//                        null,
//                        null),
//                Map.of("type", "startup-test")
//        );
//
//        var created = jobService.createJob(dto);
//
//        log.info("✅ Created job: {}", created);
//    }
//}
