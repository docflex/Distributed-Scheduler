import { ReactNode } from "react";

interface DialogProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    children?: ReactNode;
    footer?: ReactNode;
}

export const Dialog = ({
    open,
    onClose,
    title,
    description,
    children,
    footer,
}: DialogProps) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
            <div className="w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-card">
                <div className="mb-3 flex items-start justify-between gap-2">
                    <div>
                        {title && <h3 className="text-sm font-semibold">{title}</h3>}
                        {description && (
                            <p className="mt-1 text-xs text-muted-foreground">
                                {description}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground text-xs"
                    >
                        ✕
                    </button>
                </div>
                <div className="space-y-2 text-sm">{children}</div>
                {footer && <div className="mt-4 flex justify-end gap-2">{footer}</div>}
            </div>
        </div>
    );
};
