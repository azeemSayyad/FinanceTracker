import { Modal } from "./modal";
import { cn } from "@/lib/utils";
import { AlertTriangle, Info } from "lucide-react";

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: "danger" | "info";
    isLoading?: boolean;
}

export function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = "danger",
    isLoading = false
}: ConfirmationModalProps) {
    const isDanger = type === "danger";

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="space-y-6 pt-2">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-muted/30 border border-border">
                    <div className={cn(
                        "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                        isDanger ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
                    )}>
                        {isDanger ? <AlertTriangle className="h-5 w-5" /> : <Info className="h-5 w-5" />}
                    </div>
                    <p className="text-sm font-medium text-muted-foreground leading-relaxed pt-2">
                        {message}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="h-12 rounded-xl font-bold bg-muted hover:bg-muted/80 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={cn(
                            "h-12 rounded-xl  font-bold text-white transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg flex items-center justify-center gap-2",
                            isDanger
                                ? "bg-gradient-to-br from-rose-500 to-red-600 shadow-rose-500/20 hover:shadow-rose-500/30"
                                : "bg-gradient-to-br from-primary to-[#0055D4] shadow-primary/20 hover:shadow-primary/30"
                        )}
                    >
                        {isLoading && (
                            <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        )}
                        {confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
