import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onCancel: () => void;
    onConfirm: () => void;
    loading?: boolean;
    variant?: "default" | "destructive";
}

export const ConfirmDialog = ({
    open,
    title,
    description,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    onCancel,
    onConfirm,
    loading,
    variant = "default",
}: ConfirmDialogProps) => {
    return (
        <Dialog
            open={open}
            onClose={onCancel}
            title={title}
            description={description}
            footer={
                <>
                    <Button variant="outline" onClick={onCancel} disabled={loading}>
                        {cancelLabel}
                    </Button>
                    <Button
                        variant={variant === "destructive" ? "destructive" : "default"}
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? "Working..." : confirmLabel}
                    </Button>
                </>
            }
        />
    );
};
