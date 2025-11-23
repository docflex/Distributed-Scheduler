-- V2__job_definition_and_logs.sql

CREATE TABLE job_definition (
    id                   UUID PRIMARY KEY,
    name                 VARCHAR(255) NOT NULL,
    schedule_type        VARCHAR(50) NOT NULL,   -- CRON / FIXED_RATE / FIXED_DELAY
    cron_expression      VARCHAR(255),           -- nullable for non-cron jobs
    interval_seconds     BIGINT,                 -- for FIXED_RATE / FIXED_DELAY
    initial_delay_seconds BIGINT,                -- for FIXED_DELAY only
    payload              JSONB,
    status               VARCHAR(32) NOT NULL,   -- ACTIVE, PAUSED, DELETED
    version              INTEGER NOT NULL DEFAULT 0,
    created_at           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_job_definition_status ON job_definition(status);

CREATE TABLE job_execution_log (
    id               UUID PRIMARY KEY,
    job_id           UUID NOT NULL,
    fire_time        TIMESTAMP WITH TIME ZONE NOT NULL,
    status           VARCHAR(32) NOT NULL,      -- SUCCESS, FAILED
    error_message    TEXT,
    created_at       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_job_execution_log_job_id ON job_execution_log(job_id);
CREATE INDEX idx_job_execution_log_fire_time ON job_execution_log(fire_time);