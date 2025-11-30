import { cn } from "./utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: "default" | "outline" | "success" | "warning" | "danger";
}

export const Badge = ({ className, variant = "default", ...props }: BadgeProps) => {
    const styles: Record<string, string> = {
        default: "bg-primary/10 text-primary border border-primary/20",
        outline: "border border-border text-muted-foreground",
        success: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20",
        warning: "bg-amber-500/10 text-amber-300 border border-amber-500/20",
        danger: "bg-red-500/10 text-red-300 border border-red-500/20",
    };
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                styles[variant],
                className
            )}
            {...props}
        />
    );
};
