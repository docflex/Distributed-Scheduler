import { useToastStore } from "./use-toast";

export const Toaster = () => {
    const { toasts, removeToast } = useToastStore();
    if (!toasts.length) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className="w-72 rounded-xl border border-border bg-card/90 p-3 shadow-card backdrop-blur"
                >
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            {toast.title && (
                                <h4 className="text-xs font-semibold leading-tight">
                                    {toast.title}
                                </h4>
                            )}
                            {toast.description && (
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {toast.description}
                                </p>
                            )}
                        </div>
                        <button
                            className="text-muted-foreground hover:text-foreground text-xs"
                            onClick={() => removeToast(toast.id)}
                        >
                            ✕
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};
