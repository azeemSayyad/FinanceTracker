"use client";

import { TransactionDTO, TransactionType } from "@/lib/types";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, Image as ImageIcon, CheckCircle2, Clock, Edit2, Trash2, IndianRupee, Calendar, FileText, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { deleteTransaction, updateTransaction } from "@/actions/transaction-actions";
import { Modal } from "@/components/ui/modal";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { Spinner } from "@/components/ui/spinner";
import React, { useState } from "react";

export function TransactionList({ transactions }: { transactions: TransactionDTO[] }) {
    const [editingTransaction, setEditingTransaction] = useState<TransactionDTO | null>(null);
    const [deletingTransactionId, setDeletingTransactionId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    if (transactions.length === 0) {
        return <div className="text-center py-20 text-muted-foreground font-bold">No transactions recorded yet.</div>;
    }

    const handleDelete = async () => {
        if (!deletingTransactionId) return;
        setIsSubmitting(true);
        const result = await deleteTransaction(deletingTransactionId);
        if (!result.success) {
            alert(result.error);
        } else {
            setDeletingTransactionId(null);
        }
        setIsSubmitting(false);
    };

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

    const handleEditSubmit = async (formData: FormData) => {
        if (!editingTransaction) return;
        setIsSubmitting(true);
        try {
            const result = await updateTransaction(editingTransaction.id, formData);
            if (result.success) {
                setEditingTransaction(null);
                setPreview(null);
                window.location.reload();
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error(error);
            alert("Failed to update transaction");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative space-y-4">

            {transactions.map((t, i) => (
                <motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative flex items-start gap-6 group"
                >

                    <div className="flex-1 bg-card/40 hover:bg-card/60 border border-border/50 p-3 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-5">
                            <div className={cn(
                                "h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg",
                                t.type === TransactionType.INCOMING
                                    ? "bg-incoming shadow-incoming"
                                    : "bg-outgoing shadow-outgoing"
                            )}>
                                {t.type === TransactionType.INCOMING ? <ArrowDownLeft className="h-7 w-7" /> : <ArrowUpRight className="h-7 w-7" />}
                            </div>

                            <div className="flex flex-col space-y-1">
                                <div className="font-black text-lg text-foreground leading-tight">
                                    {t.notes || t.worker?.name || t.client?.name || (t.type === TransactionType.INCOMING ? "Payment Received" : "Expense Paid")}
                                </div>
                                <div className="flex  items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                    {format(new Date(t.date), "MMM d, h:mm:ss a")}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-border pt-4 md:pt-0">
                            <div className="space-y-1 text-right">
                                <div className={cn(
                                    "text-xl font-black",
                                    t.type === TransactionType.INCOMING ? "text-incoming" : "text-outgoing"
                                )}>
                                    {t.type === TransactionType.INCOMING ? "+" : "-"}₹{Number(t.amount).toLocaleString("en-IN")}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {t.imageUrl && (
                                    <a
                                        href={t.imageUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all shadow-sm"
                                        title="View Receipt"
                                    >
                                        <ImageIcon className="h-4 w-4" />
                                    </a>
                                )}
                                <button
                                    onClick={() => {
                                        setEditingTransaction(t);
                                        setPreview(t.imageUrl || null);
                                    }}
                                    className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all shadow-sm"
                                    title="Edit Transaction"
                                >
                                    <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => setDeletingTransactionId(t.id)}
                                    className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-destructive hover:text-white transition-all shadow-sm"
                                    title="Delete Transaction"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}

            <ConfirmationModal
                isOpen={!!deletingTransactionId}
                onClose={() => setDeletingTransactionId(null)}
                onConfirm={handleDelete}
                title="Delete Transaction"
                message="Are you sure you want to delete this transaction? This action cannot be undone."
                confirmText="Delete"
                isLoading={isSubmitting}
            />

            <Modal
                isOpen={!!editingTransaction}
                onClose={() => {
                    setEditingTransaction(null);
                    setPreview(null);
                }}
                title="Edit Transaction"
            >
                {editingTransaction && (
                    <form action={handleEditSubmit} className="space-y-3">
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
                                    defaultValue={editingTransaction.amount}
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
                                    defaultValue={new Date(editingTransaction.date).toISOString().slice(0, 16)}
                                    className="w-full bg-secondary border-2 border-border rounded-xl p-3 text-sm font-bold outline-none focus:border-primary transition-all"
                                />
                            </div>
                            {/* Notes Input */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Notes</label>
                                <input
                                    name="notes"
                                    defaultValue={editingTransaction.notes}
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
                                    "bg-gradient-to-br from-primary to-[#0055D4] text-white shadow-primary/20 hover:shadow-primary/30",
                                    isSubmitting && "opacity-70 animate-pulse"
                                )}
                            >
                                {isSubmitting ? <Spinner className="text-white" size="sm" /> : "Update Transaction"}
                            </button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
}
