"use client";

import { useState } from "react";
import { createTransaction } from "@/actions/transaction-actions";
import { Modal } from "@/components/ui/modal";
import { Loader2, Camera, Upload } from "lucide-react";
import { TransactionType } from "@/lib/types";

interface AddTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    workerId?: string;
    clientId?: string;
    defaultType: TransactionType;
}

export function AddTransactionModal({ isOpen, onClose, workerId, clientId, defaultType }: AddTransactionModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        // Append entity relation
        if (workerId) formData.append("workerId", workerId);
        if (clientId) formData.append("clientId", clientId);

        // Type checking? FormData values are strings.
        // The server action expects string and parses it.

        const result = await createTransaction(formData);

        if (result.success) {
            onClose();
            window.location.reload();
        } else {
            alert(result.error);
        }
        setIsSubmitting(false);
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={defaultType === TransactionType.OUTGOING ? "Record Payment to Worker" : "Record Payment from Client"}>
            <form action={handleSubmit} className="space-y-4">
                <input type="hidden" name="type" value={defaultType} />

                <div className="space-y-2">
                    <label className="text-sm font-medium">Amount (₹)</label>
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-muted-foreground">₹</span>
                        <input type="number" step="0.01" name="amount" required className="w-full bg-background border border-border rounded-lg pl-8 pr-4 py-3 text-lg font-bold outline-none ring-offset-background focus:ring-2 focus:ring-primary/20" placeholder="0.00" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Date & Time</label>
                    <input
                        type="datetime-local"
                        name="date"
                        required
                        defaultValue={new Date().toISOString().slice(0, 16)}
                        className="w-full bg-background border border-border rounded-lg p-1.5 outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Notes (Optional)</label>
                    <textarea name="notes" className="w-full bg-background border border-border rounded-lg p-1.5 outline-none focus:ring-2 focus:ring-primary/20 min-h-[60px]" placeholder="Description..." />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium block">Receipt / Screenshot</label>
                    <div className="relative border-2 border-dashed border-border rounded-xl p-2 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer group">
                        <input type="file" name="image" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                        {preview ? (
                            <img src={preview} alt="Preview" className="h-32 object-contain rounded-md" />
                        ) : (
                            <>
                                <Upload className="h-8 w-8 mb-2 group-hover:scale-110 transition-transform" />
                                <span className="text-xs">Tap to upload image</span>
                            </>
                        )}
                    </div>
                </div>

                <div className="pt-4 flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg hover:bg-muted text-sm font-medium transition-colors">Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-medium shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all disabled:opacity-50 flex items-center gap-2">
                        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                        Save Transaction
                    </button>
                </div>
            </form>
        </Modal>
    );
}
