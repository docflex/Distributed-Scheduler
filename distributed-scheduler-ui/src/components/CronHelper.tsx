import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface CronHelperProps {
    expression?: string;
}

function describeCron(expr: string): string {
    const parts = expr.trim().split(/\s+/);
    if (parts.length < 6) {
        return "Cron appears incomplete. Expecting Quartz 6+ fields.";
    }
    return `Quartz cron: seconds=${parts[0]}, minutes=${parts[1]}, hours=${
        parts[2]
    }, day-of-month=${parts[3]}, month=${parts[4]}, day-of-week=${parts[5]}${
        parts[6] ? ", year=" + parts[6] : ""
    }`;
}

export const CronHelper = ({ expression }: CronHelperProps) => {
    if (!expression) {
        return (
            <p className="text-xs text-muted-foreground">
                Use standard Quartz cron syntax, e.g. <code>0/10 * * * * ?</code>
            </p>
        );
    }

    return (
        <div className="mt-2 space-y-1 rounded-lg border border-border/60 bg-muted/40 p-2">
            <div className="flex items-center justify-between">
                <Label className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    Cron Visualizer
                </Label>
                <Badge variant="outline" className="text-[10px]">
                    Preview
                </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">
                {describeCron(expression)}
            </p>
        </div>
    );
};
