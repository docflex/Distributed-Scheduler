import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { AppRoutes } from "@/router";

export default function App() {
    return (
        <div className="flex h-screen bg-background text-foreground">
            <Sidebar />
            <div className="flex min-w-0 flex-1 flex-col">
                <Topbar />
                <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
                    <div className="mx-auto w-full max-w-6xl space-y-4">
                        <AppRoutes />
                    </div>
                </main>
            </div>
        </div>
    );
}
