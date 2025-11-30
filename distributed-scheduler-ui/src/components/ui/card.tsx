import * as React from "react";
import { cn } from "./utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "rounded-2xl border border-border bg-card/60 p-5 shadow-card backdrop-blur",
                className
            )}
            {...props}
        />
    );
}

export function CardHeader(props: React.HTMLAttributes<HTMLDivElement>) {
    return <div className="mb-4 flex items-center justify-between gap-2" {...props} />;
}

export function CardTitle(props: React.HTMLAttributes<HTMLHeadingElement>) {
    return <h2 className="text-lg font-semibold tracking-tight" {...props} />;
}

export function CardDescription(props: React.HTMLAttributes<HTMLParagraphElement>) {
    return <p className="text-xs text-muted-foreground" {...props} />;
}

export function CardContent(props: React.HTMLAttributes<HTMLDivElement>) {
    return <div className="space-y-3" {...props} />;
}
