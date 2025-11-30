import { useMutation, useQueryClient } from "@tanstack/react-query";
import { JobService } from "@/services/jobService";
import { JOBS_QUERY_KEY } from "./useJobs";

export function useRunJobNow() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (jobId: string) => JobService.runNow(jobId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: JOBS_QUERY_KEY });
        },
    });
}

export function usePauseJob() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (jobId: string) => JobService.pause(jobId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: JOBS_QUERY_KEY });
        },
    });
}

export function useResumeJob() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (jobId: string) => JobService.resume(jobId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: JOBS_QUERY_KEY });
        },
    });
}

export function useDeleteJob() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (jobId: string) => JobService.delete(jobId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: JOBS_QUERY_KEY });
        },
    });
}
