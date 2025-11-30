import { useParams, Link } from "react-router-dom";
import { useExecutionLogs } from "@/hooks/useExecutionLogs";
import { useJob } from "@/hooks/useJob";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/StatusBadge";

export const ExecutionLogsPage = () => {
    const { jobId } = useParams<{ jobId: string }>();
    const { data: job, isLoading: jobLoading } = useJob(jobId);
    const { data, isLoading, isError, error } = useExecutionLogs(jobId);

    return (
        <Card>
            <CardHeader>
                <div>
                    <CardTitle>Execution Logs</CardTitle>
                    <CardDescription>
                        {jobLoading && "Loading job details..."}
                        {!jobLoading && job && (
                            <>
                                Job: <span className="font-medium">{job.name}</span>
                            </>
                        )}
                        {!jobLoading && !job && "Unknown job."}
                    </CardDescription>
                </div>
                <Link to="/">
                    <Button size="sm" variant="outline">
                        Back to Jobs
                    </Button>
                </Link>
            </CardHeader>
            <CardContent>
                {isLoading && (
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                    </div>
                )}
                {isError && (
                    <p className="text-xs text-red-400">
                        Failed to load logs: {(error as any)?.message ?? "Unknown error"}
                    </p>
                )}
                {!isLoading && data && data.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                        No execution logs for this job.
                    </p>
                )}
                {!isLoading && data && data.length > 0 && (
                    <Table>
                        <THead>
                            <TR>
                                <TH>Fire Time</TH>
                                <TH>Status</TH>
                                <TH>Error Message</TH>
                                <TH>Created At</TH>
                            </TR>
                        </THead>
                        <TBody>
                            {data.map((log) => (
                                <TR key={log.id}>
                                    <TD className="text-xs">
                                        {new Date(log.fireTime).toLocaleString()}
                                    </TD>
                                    <TD>
                                        <StatusBadge status={log.status} />
                                    </TD>
                                    <TD className="text-xs text-red-300">
                                        {log.errorMessage || "-"}
                                    </TD>
                                    <TD className="text-xs text-muted-foreground">
                                        {new Date(log.createdAt).toLocaleString()}
                                    </TD>
                                </TR>
                            ))}
                        </TBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
};
