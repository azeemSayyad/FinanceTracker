"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { TransactionType } from "@/lib/types";
import { createTransaction } from "@/actions/transaction-actions";
import { IndianRupee, Calendar, FileText, Camera, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddTransactionModalProps {
    workerId?: string;
    clientId?: string;
    defaultType: TransactionType;
    isOpen: boolean;
    onClose: () => void;
}

export function AddTransactionModal({ workerId, clientId, defaultType, isOpen, onClose }: AddTransactionModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    const isIncoming = defaultType === TransactionType.INCOMING;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        try {
            await createTransaction(formData);
            onClose();
            setPreview(null);
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert("Failed to save transaction");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isIncoming ? "Add Received Payment" : "Add New Payout"}
        >
            <form action={handleSubmit} className="space-y-3">
                <input type="hidden" name="workerId" value={workerId || ""} />
                <input type="hidden" name="clientId" value={clientId || ""} />
                <input type="hidden" name="type" value={defaultType} />

                {/* Amount Input */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Amount (₹)</label>
                    <div className="relative group">
                        <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                        <input
                            name="amount"
                            type="number"
                            step="0.01"
                            required
                            className="w-full bg-secondary border-2 border-border rounded-2xl py-3 pl-12 pr-6 text-3xl font-black outline-none focus:border-primary transition-all"
                            placeholder="0.00"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Date Input */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Date</label>
                        <input
                            name="date"
                            type="datetime-local"
                            required
                            defaultValue={new Date().toISOString().slice(0, 16)}
                            className="w-full bg-secondary border-2 border-border rounded-xl p-3 text-sm font-bold outline-none focus:border-primary transition-all"
                        />
                    </div>
                    {/* Notes Input */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Notes</label>
                        <input
                            name="notes"
                            className="w-full bg-secondary border-2 border-border rounded-xl p-3 text-sm font-bold outline-none focus:border-primary transition-all"
                            placeholder="Ref details..."
                        />
                    </div>
                </div>

                {/* Receipt Upload */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Receipt Image</label>
                    <div className="relative overflow-hidden border-2 border-dashed border-border rounded-2xl bg-secondary/30 flex flex-col items-center justify-center p-6 hover:bg-secondary/50 transition-all cursor-pointer group min-h-[140px]">
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="absolute inset-0 opacity-0 cursor-pointer z-20"
                        />
                        {preview ? (
                            <img src={preview} alt="Preview" className="h-24 object-contain rounded-lg shadow-md relative z-10" />
                        ) : (
                            <div className="flex flex-col items-center gap-2 group-hover:scale-105 transition-transform">
                                <Upload className="h-8 w-8 text-muted-foreground/40" />
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 text-center">Tap to upload receipt</p>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                </div>

                {/* Submit Buttons */}
                <div className="pt-2 flex flex-col gap-3">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={cn(
                            "w-full h-16 rounded-[1.5rem] font-black text-lg justify-center transition-all shadow-xl flex items-center gap-3 active:scale-[0.98]",
                            isIncoming
                                ? "bg-gradient-to-br from-success to-[#059669] text-white shadow-success/20 hover:shadow-success/30"
                                : "bg-gradient-to-br from-primary to-[#0055D4] text-white shadow-primary/20 hover:shadow-primary/30",
                            isSubmitting && "opacity-70 animate-pulse"
                        )}
                    >
                        {isSubmitting ? "Processing..." : isIncoming ? "Confirm Payment" : "Confirm Payout"}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full py-3 text-xs font-black uppercase tracking-widest text-muted-foreground hover:bg-muted rounded-xl transition-all"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </Modal>
    );
}
