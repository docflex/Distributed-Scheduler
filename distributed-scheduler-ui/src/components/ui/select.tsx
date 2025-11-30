import * as React from "react";
import { cn } from "./utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, children, ...props }, ref) => (
        <select
            ref={ref}
            className={cn(
                "flex h-9 w-full rounded-lg border border-border bg-background px-3 py-1 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
                className
            )}
            {...props}
        >
            {children}
        </select>
    )
);
Select.displayName = "Select";
