import { useQuery } from "@tanstack/react-query";
import { JobService } from "@/services/jobService";
import { Job } from "@/graphql/types";

export const JOBS_QUERY_KEY = ["jobs"];

export function useJobs() {
    return useQuery<Job[]>({
        queryKey: JOBS_QUERY_KEY,
        queryFn: () => JobService.listJobs(),
    });
}
