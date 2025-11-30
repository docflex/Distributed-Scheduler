export type ScheduleType = "CRON" | "FIXED_RATE" | "FIXED_DELAY";

export interface Job {
    id: string;
    name: string;
    scheduleType: ScheduleType;
    cronExpression?: string;
    intervalSeconds?: number;
    initialDelaySeconds?: number;
    payload?: any;
    status: string;
    version: number;
    createdAt: string;
    updatedAt: string;
}

export interface ExecutionLog {
    id: string;
    jobId: string;
    fireTime: string;
    status: string;
    errorMessage?: string;
    createdAt: string;
}

export interface CreateJobInput {
    name: string;
    scheduleType: ScheduleType;
    cronExpression?: string;
    intervalSeconds?: number;
    initialDelaySeconds?: number;
    payload?: any;
}
