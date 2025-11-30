import { Badge } from "@/components/ui/badge";

export const StatusBadge = ({ status }: { status: string }) => {
    const normalized = status.toLowerCase();
    let variant: "success" | "warning" | "danger" | "outline" = "outline";

    if (["running", "active"].includes(normalized)) variant = "success";
    else if (["paused"].includes(normalized)) variant = "warning";
    else if (["failed", "error"].includes(normalized)) variant = "danger";

    return <Badge variant={variant}>{status}</Badge>;
};
