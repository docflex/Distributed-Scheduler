import { useQuery } from "@tanstack/react-query";
import { JobService } from "@/services/jobService";
import { ExecutionLog } from "@/graphql/types";

export function useExecutionLogs(jobId: string | undefined) {
    return useQuery<ExecutionLog[]>({
        queryKey: ["logs", jobId],
        queryFn: () => {
            if (!jobId) return Promise.resolve([]);
            return JobService.executionLogs(jobId);
        },
        enabled: !!jobId,
    });
}
