package com.example.scheduler.application.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
public class CreateJobRequestDto {
    private String name;
    private String description;
    private TriggerConfigDto trigger;
    private Map<String, Object> payload; // will be JSON-serialized
}
