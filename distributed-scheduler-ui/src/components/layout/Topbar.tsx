import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Topbar = () => {
    const location = useLocation();
    const isCreatePage = location.pathname.startsWith("/jobs/new");

    return (
        <header className="flex items-center justify-between border-b border-border/60 bg-background/60 px-4 py-3">
            <div>
                <h1 className="text-sm font-semibold">
                    {isCreatePage ? "Create Job" : "Jobs"}
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                    Distributed scheduler control plane
                </p>
            </div>
            {!isCreatePage && (
                <Link to="/jobs/new">
                    <Button size="sm">New Job</Button>
                </Link>
            )}
        </header>
    );
};
