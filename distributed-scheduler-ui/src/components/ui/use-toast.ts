import { create } from "zustand";

export type ToastType = "default" | "success" | "error";

export interface Toast {
    id: string;
    title?: string;
    description?: string;
    type?: ToastType;
}

interface ToastStore {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, "id">) => void;
    removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
    toasts: [],
    addToast: (toast) =>
        set((state) => ({
            toasts: [
                ...state.toasts,
                { ...toast, id: Math.random().toString(36).slice(2) },
            ],
        })),
    removeToast: (id) =>
        set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
        })),
}));

export function useToast() {
    const addToast = useToastStore((s) => s.addToast);
    return {
        toast: (opts: Omit<Toast, "id">) => addToast(opts),
    };
}
