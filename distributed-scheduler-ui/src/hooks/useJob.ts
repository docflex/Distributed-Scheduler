import { useQuery } from "@tanstack/react-query";
import { JobService } from "@/services/jobService";
import { Job } from "@/graphql/types";

export function useJob(jobId: string | undefined) {
    return useQuery<Job | null>({
        queryKey: ["job", jobId],
        queryFn: () => {
            if (!jobId) return Promise.resolve(null);
            return JobService.getJob(jobId);
        },
        enabled: !!jobId,
    });
}
