import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { JSONEditor } from "@/components/JSONEditor";
import { CronHelper } from "@/components/CronHelper";
import { useCreateJob } from "@/hooks/useCreateJob";
import { useToast } from "@/components/ui/use-toast";
import { ScheduleType } from "@/graphql/types";

export const CreateJobPage = () => {
    const [name, setName] = useState("");
    const [scheduleType, setScheduleType] = useState<ScheduleType>("CRON");
    const [cronExpression, setCronExpression] = useState("");
    const [intervalSeconds, setIntervalSeconds] = useState<string>("");
    const [initialDelaySeconds, setInitialDelaySeconds] = useState<string>("");
    const [payload, setPayload] = useState<any>();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { mutateAsync, isPending } = useCreateJob();
    const { toast } = useToast();
    const navigate = useNavigate();

    const validate = () => {
        const next: Record<string, string> = {};
        if (!name.trim()) next.name = "Name is required.";
        if (!scheduleType) next.scheduleType = "Schedule type is required.";

        if (scheduleType === "CRON") {
            if (!cronExpression.trim())
                next.cronExpression = "Cron expression is required.";
        } else if (scheduleType === "FIXED_RATE") {
            if (!intervalSeconds.trim()) next.intervalSeconds = "Interval is required.";
            else if (Number(intervalSeconds) <= 0)
                next.intervalSeconds = "Interval must be > 0.";
        } else if (scheduleType === "FIXED_DELAY") {
            if (!intervalSeconds.trim()) next.intervalSeconds = "Interval is required.";
            else if (Number(intervalSeconds) <= 0)
                next.intervalSeconds = "Interval must be > 0.";
            if (initialDelaySeconds.trim() && Number(initialDelaySeconds) < 0) {
                next.initialDelaySeconds = "Initial delay must be >= 0.";
            }
        }

        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            await mutateAsync({
                name: name.trim(),
                scheduleType,
                cronExpression:
                    scheduleType === "CRON" ? cronExpression.trim() : undefined,
                intervalSeconds:
                    scheduleType !== "CRON" && intervalSeconds
                        ? Number(intervalSeconds)
                        : undefined,
                initialDelaySeconds:
                    scheduleType === "FIXED_DELAY" && initialDelaySeconds
                        ? Number(initialDelaySeconds)
                        : undefined,
                payload,
            });
            toast({
                title: "Job created",
                description: "Your job has been scheduled.",
                type: "success",
            });
            navigate("/");
        } catch (err: any) {
            toast({
                title: "Failed to create job",
                description: err.message || "Unknown error",
                type: "error",
            });
        }
    };

    return (
        <Card>
            <CardHeader>
                <div>
                    <CardTitle>Create Job</CardTitle>
                    <CardDescription>
                        Define a new job in the distributed scheduler.
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                        <div className="space-y-1">
                            <Label>Name</Label>
                            <Input
                                placeholder="e.g. Sample Cron Task"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            {errors.name && (
                                <p className="text-xs text-red-400">{errors.name}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <Label>Schedule Type</Label>
                            <Select
                                value={scheduleType}
                                onChange={(e) =>
                                    setScheduleType(e.target.value as ScheduleType)
                                }
                            >
                                <option value="CRON">CRON</option>
                                <option value="FIXED_RATE">FIXED_RATE</option>
                                <option value="FIXED_DELAY">FIXED_DELAY</option>
                            </Select>
                            {errors.scheduleType && (
                                <p className="text-xs text-red-400">
                                    {errors.scheduleType}
                                </p>
                            )}
                        </div>

                        {scheduleType === "CRON" && (
                            <div className="space-y-1">
                                <Label>Cron Expression</Label>
                                <Input
                                    placeholder="0/10 * * * * ?"
                                    value={cronExpression}
                                    onChange={(e) => setCronExpression(e.target.value)}
                                />
                                {errors.cronExpression && (
                                    <p className="text-xs text-red-400">
                                        {errors.cronExpression}
                                    </p>
                                )}
                                <CronHelper expression={cronExpression} />
                            </div>
                        )}

                        {scheduleType === "FIXED_RATE" && (
                            <div className="space-y-1">
                                <Label>Interval (seconds)</Label>
                                <Input
                                    type="number"
                                    min={1}
                                    value={intervalSeconds}
                                    onChange={(e) => setIntervalSeconds(e.target.value)}
                                />
                                {errors.intervalSeconds && (
                                    <p className="text-xs text-red-400">
                                        {errors.intervalSeconds}
                                    </p>
                                )}
                            </div>
                        )}

                        {scheduleType === "FIXED_DELAY" && (
                            <>
                                <div className="space-y-1">
                                    <Label>Interval (seconds)</Label>
                                    <Input
                                        type="number"
                                        min={1}
                                        value={intervalSeconds}
                                        onChange={(e) =>
                                            setIntervalSeconds(e.target.value)
                                        }
                                    />
                                    {errors.intervalSeconds && (
                                        <p className="text-xs text-red-400">
                                            {errors.intervalSeconds}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <Label>Initial Delay (seconds)</Label>
                                    <Input
                                        type="number"
                                        min={0}
                                        value={initialDelaySeconds}
                                        onChange={(e) =>
                                            setInitialDelaySeconds(e.target.value)
                                        }
                                    />
                                    {errors.initialDelaySeconds && (
                                        <p className="text-xs text-red-400">
                                            {errors.initialDelaySeconds}
                                        </p>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    <div className="space-y-3">
                        <JSONEditor value={payload} onChange={setPayload} />
                        <div className="flex justify-end pt-2">
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Creating..." : "Create Job"}
                            </Button>
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};
