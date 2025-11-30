import { NavLink } from "react-router-dom";
import { cn } from "@/components/ui/utils";
import { Clock, PlusCircle } from "lucide-react";

export const Sidebar = () => {
    const base =
        "flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-colors";
    const inactive = "text-muted-foreground hover:bg-muted/40";
    const active = "bg-primary/10 text-primary";

    return (
        <aside className="hidden h-full w-56 border-r border-border/60 bg-background/60 p-4 md:block">
            <div className="mb-6">
                <div className="text-xs font-semibold tracking-tight text-muted-foreground">
                    Distributed
                </div>
                <div className="text-sm font-semibold tracking-tight">Scheduler</div>
            </div>
            <nav className="space-y-1 text-xs">
                <NavLink
                    to="/"
                    className={({ isActive }) => cn(base, isActive ? active : inactive)}
                >
                    <Clock className="h-3.5 w-3.5" />
                    Jobs
                </NavLink>
                <NavLink
                    to="/jobs/new"
                    className={({ isActive }) => cn(base, isActive ? active : inactive)}
                >
                    <PlusCircle className="h-3.5 w-3.5" />
                    Create Job
                </NavLink>
            </nav>
        </aside>
    );
};
