import { Link, useNavigate } from "react-router-dom";
import { useJobs } from "@/hooks/useJobs";
import {
    useRunJobNow,
    usePauseJob,
    useResumeJob,
    useDeleteJob,
} from "@/hooks/useJobActions";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/StatusBadge";
import { useToast } from "@/components/ui/use-toast";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useState } from "react";
import { Job } from "@/graphql/types";

type PendingConfirm = { type: "pause" | "resume" | "delete"; job: Job } | null;

export const JobListPage = () => {
    const { data, isLoading, isError, error } = useJobs();
    const runNowMutation = useRunJobNow();
    const pauseMutation = usePauseJob();
    const resumeMutation = useResumeJob();
    const deleteMutation = useDeleteJob();
    const { toast } = useToast();
    const [pendingConfirm, setPendingConfirm] = useState<PendingConfirm>(null);
    const navigate = useNavigate();

    const handleRunNow = async (jobId: string) => {
        try {
            await runNowMutation.mutateAsync(jobId);
            toast({
                title: "Job triggered",
                description: "Job will run shortly.",
                type: "success",
            });
        } catch (e: any) {
            toast({
                title: "Failed to run job",
                description: e.message || "Unknown error",
                type: "error",
            });
        }
    };

    const confirmAction = async () => {
        if (!pendingConfirm) return;
        const { type, job } = pendingConfirm;
        try {
            if (type === "pause") {
                await pauseMutation.mutateAsync(job.id);
                toast({ title: "Job paused", description: job.name, type: "success" });
            } else if (type === "resume") {
                await resumeMutation.mutateAsync(job.id);
                toast({ title: "Job resumed", description: job.name, type: "success" });
            } else if (type === "delete") {
                await deleteMutation.mutateAsync(job.id);
                toast({ title: "Job deleted", description: job.name, type: "success" });
            }
        } catch (e: any) {
            toast({
                title: "Action failed",
                description: e.message || "Unknown error",
                type: "error",
            });
        } finally {
            setPendingConfirm(null);
        }
    };

    const isMutating =
        runNowMutation.isPending ||
        pauseMutation.isPending ||
        resumeMutation.isPending ||
        deleteMutation.isPending;

    return (
        <>
            <Card>
                <CardHeader>
                    <div>
                        <CardTitle>Jobs</CardTitle>
                        <CardDescription>
                            Manage all scheduled jobs in the cluster.
                        </CardDescription>
                    </div>
                    <Button size="sm" onClick={() => navigate("/jobs/new")}>
                        New Job
                    </Button>
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
                            Failed to load jobs:{" "}
                            {(error as any)?.message ?? "Unknown error"}
                        </p>
                    )}
                    {!isLoading && data && data.length === 0 && (
                        <p className="text-xs text-muted-foreground">
                            No jobs configured yet. Create your first job to get started.
                        </p>
                    )}
                    {!isLoading && data && data.length > 0 && (
                        <Table>
                            <THead>
                                <TR>
                                    <TH>Name</TH>
                                    <TH>Schedule Type</TH>
                                    <TH>Status</TH>
                                    <TH>Created At</TH>
                                    <TH>Updated At</TH>
                                    <TH className="text-right">Actions</TH>
                                </TR>
                            </THead>
                            <TBody>
                                {data.map((job) => (
                                    <TR key={job.id}>
                                        <TD className="font-medium">{job.name}</TD>
                                        <TD>
                                            <span className="rounded-full bg-muted/40 px-2 py-0.5 text-[11px] uppercase tracking-wide text-muted-foreground">
                                                {job.scheduleType}
                                            </span>
                                        </TD>
                                        <TD>
                                            <StatusBadge status={job.status} />
                                        </TD>
                                        <TD className="text-xs text-muted-foreground">
                                            {new Date(job.createdAt).toLocaleString()}
                                        </TD>
                                        <TD className="text-xs text-muted-foreground">
                                            {new Date(job.updatedAt).toLocaleString()}
                                        </TD>
                                        <TD>
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleRunNow(job.id)}
                                                    disabled={isMutating}
                                                >
                                                    Run
                                                </Button>
                                                {job.status.toLowerCase() === "paused" ? (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() =>
                                                            setPendingConfirm({
                                                                type: "resume",
                                                                job,
                                                            })
                                                        }
                                                        disabled={isMutating}
                                                    >
                                                        Resume
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() =>
                                                            setPendingConfirm({
                                                                type: "pause",
                                                                job,
                                                            })
                                                        }
                                                        disabled={isMutating}
                                                    >
                                                        Pause
                                                    </Button>
                                                )}
                                                <Link to={`/jobs/${job.id}/logs`}>
                                                    <Button size="sm" variant="ghost">
                                                        Logs
                                                    </Button>
                                                </Link>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() =>
                                                        setPendingConfirm({
                                                            type: "delete",
                                                            job,
                                                        })
                                                    }
                                                    disabled={isMutating}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </TD>
                                    </TR>
                                ))}
                            </TBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <ConfirmDialog
                open={!!pendingConfirm}
                title={
                    pendingConfirm?.type === "delete"
                        ? "Delete job?"
                        : pendingConfirm?.type === "pause"
                        ? "Pause job?"
                        : "Resume job?"
                }
                description={
                    pendingConfirm ? `Job: ${pendingConfirm.job.name}` : undefined
                }
                confirmLabel={
                    pendingConfirm?.type === "delete"
                        ? "Delete"
                        : pendingConfirm?.type === "pause"
                        ? "Pause"
                        : "Resume"
                }
                variant={pendingConfirm?.type === "delete" ? "destructive" : "default"}
                loading={isMutating}
                onCancel={() => setPendingConfirm(null)}
                onConfirm={confirmAction}
            />
        </>
    );
};
