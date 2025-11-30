import * as React from "react";
import { cn } from "./utils";

export const Table = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="w-full overflow-x-auto">
        <table
            className={cn("w-full text-sm border-collapse min-w-[640px]", className)}
            {...props}
        />
    </div>
);

export const THead = (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead
        className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground"
        {...props}
    />
);

export const TBody = (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <tbody className="divide-y divide-border/60" {...props} />
);

export const TR = (props: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr className="hover:bg-muted/30 transition-colors" {...props} />
);

export const TH = (props: React.ThHTMLAttributes<HTMLTableCellElement>) => (
    <th className="px-3 py-2 text-left font-medium" {...props} />
);

export const TD = (props: React.TdHTMLAttributes<HTMLTableCellElement>) => (
    <td className="px-3 py-2 align-middle" {...props} />
);
