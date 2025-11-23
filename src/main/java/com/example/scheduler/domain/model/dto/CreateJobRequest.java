package com.example.scheduler.domain.model.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class CreateJobRequest {
    private String name;
    private String group;
    private String description;
    private TriggerConfig trigger;
    private Map<String, Object> data;
}
