import { Routes, Route } from "react-router-dom";
import { JobListPage } from "@/pages/JobListPage";
import { CreateJobPage } from "@/pages/CreateJobPage";
import { ExecutionLogsPage } from "@/pages/ExecutionLogsPage";

export const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<JobListPage />} />
        <Route path="/jobs/new" element={<CreateJobPage />} />
        <Route path="/jobs/:jobId/logs" element={<ExecutionLogsPage />} />
    </Routes>
);
