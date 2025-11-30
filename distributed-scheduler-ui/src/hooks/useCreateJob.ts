import { useMutation, useQueryClient } from "@tanstack/react-query";
import { JobService } from "@/services/jobService";
import { CreateJobInput, Job } from "@/graphql/types";
import { JOBS_QUERY_KEY } from "./useJobs";

export function useCreateJob() {
    const queryClient = useQueryClient();
    return useMutation<Job, Error, CreateJobInput>({
        mutationFn: (input) => JobService.createJob(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: JOBS_QUERY_KEY });
        },
    });
}
