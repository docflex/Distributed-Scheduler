import { apolloClient } from "@/lib/apolloClient";
import { GET_JOBS, GET_JOB, GET_EXECUTION_LOGS } from "@/graphql/queries";
import {
    CREATE_JOB,
    RUN_JOB_NOW,
    PAUSE_JOB,
    RESUME_JOB,
    DELETE_JOB,
} from "@/graphql/mutations";
import { CreateJobInput, ExecutionLog, Job } from "@/graphql/types";

export const JobService = {
    async listJobs(): Promise<Job[]> {
        const { data } = await apolloClient.query<{ jobs: Job[] }>({
            query: GET_JOBS,
            fetchPolicy: "network-only",
        });
        return data.jobs;
    },

    async getJob(id: string): Promise<Job | null> {
        const { data } = await apolloClient.query<{ job: Job | null }>({
            query: GET_JOB,
            variables: { id },
        });
        return data.job;
    },

    async createJob(input: CreateJobInput): Promise<Job> {
        const { data } = await apolloClient.mutate<{ createJob: Job }>({
            mutation: CREATE_JOB,
            variables: { input },
        });
        if (!data) {
            throw new Error("Failed to create job");
        }
        return data.createJob;
    },

    async runNow(jobId: string): Promise<boolean> {
        const { data } = await apolloClient.mutate<{ runJobNow: boolean }>({
            mutation: RUN_JOB_NOW,
            variables: { id: jobId },
        });
        return !!data?.runJobNow;
    },

    async pause(jobId: string): Promise<Job> {
        const { data } = await apolloClient.mutate<{ pauseJob: Job }>({
            mutation: PAUSE_JOB,
            variables: { id: jobId },
        });
        if (!data) {
            throw new Error("Failed to pause job");
        }
        return data.pauseJob;
    },

    async resume(jobId: string): Promise<Job> {
        const { data } = await apolloClient.mutate<{ resumeJob: Job }>({
            mutation: RESUME_JOB,
            variables: { id: jobId },
        });
        if (!data) {
            throw new Error("Failed to resume job");
        }
        return data.resumeJob;
    },

    async delete(jobId: string): Promise<boolean> {
        const { data } = await apolloClient.mutate<{ deleteJob: boolean }>({
            mutation: DELETE_JOB,
            variables: { id: jobId },
        });
        return !!data?.deleteJob;
    },

    async executionLogs(jobId: string): Promise<ExecutionLog[]> {
        const { data } = await apolloClient.query<{ jobLogs: ExecutionLog[] }>({
            query: GET_EXECUTION_LOGS,
            variables: { jobId },
            fetchPolicy: "network-only",
        });

        return data.jobLogs;
    },
};
