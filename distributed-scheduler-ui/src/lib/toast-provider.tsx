import { ReactNode } from "react";
import { Toaster } from "@/components/ui/toast";

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    return (
        <>
            {children}
            <Toaster />
        </>
    );
};
