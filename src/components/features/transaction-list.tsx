"use client";

import { TransactionDTO, TransactionType } from "@/lib/types";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, Image as ImageIcon, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";

export function TransactionList({ transactions }: { transactions: TransactionDTO[] }) {
    if (transactions.length === 0) {
        return <div className="text-center py-20 text-muted-foreground font-bold">No transactions recorded yet.</div>;
    }

    return (
        <div className="relative space-y-12">
            {/* Timeline Line */}
            <div className="absolute left-[34px] top-4 bottom-4 w-1 bg-border/40 rounded-full hidden md:block" />

            {transactions.map((t, i) => (
                <motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative flex items-start gap-6 group"
                >
                    {/* Timeline Node */}
                    <div className="relative z-10 hidden md:flex h-[68px] items-center">
                        <div className={cn(
                            "h-5 w-5 rounded-full border-4 border-background shadow-sm transition-transform group-hover:scale-125",
                            t.type === TransactionType.INCOMING ? "bg-success" : "bg-destructive"
                        )} />
                    </div>

                    <div className="flex-1 bg-card/40 hover:bg-card/60 border border-border/50 p-3 rounded-[2rem] shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-5">
                            <div className={cn(
                                "h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg",
                                t.type === TransactionType.INCOMING
                                    ? "bg-success/10 text-success shadow-success/10"
                                    : "bg-destructive/10 text-destructive shadow-destructive/10"
                            )}>
                                {t.type === TransactionType.INCOMING ? <ArrowDownLeft className="h-7 w-7" /> : <ArrowUpRight className="h-7 w-7" />}
                            </div>

                            <div className="space-y-1">
                                <div className="font-black text-lg text-foreground leading-tight">
                                    {t.notes || (t.type === TransactionType.INCOMING ? "Payment Received" : "Expense Paid")}
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                    {format(new Date(t.date), "MMM d, h:mm a")}
                                    <span className="h-1 w-1 rounded-full bg-border" />
                                    Property ID: {t.id.slice(0, 6)}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-border pt-4 md:pt-0">
                            <div className="space-y-1 text-right">
                                <div className={cn(
                                    "text-xl font-black",
                                    t.type === TransactionType.INCOMING ? "text-success" : "text-destructive"
                                )}>
                                    {t.type === TransactionType.INCOMING ? "+" : "-"}₹{Number(t.amount).toLocaleString("en-IN")}
                                </div>
                                <div className={cn(
                                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter",
                                    t.type === TransactionType.INCOMING ? "bg-success/10 text-success" : "bg-primary/10 text-primary"
                                )}>
                                    {t.type === TransactionType.INCOMING ? (
                                        <><CheckCircle2 className="h-3 w-3" /> Success</>
                                    ) : (
                                        <><Clock className="h-3 w-3" /> Processing</>
                                    )}
                                </div>
                            </div>

                            {t.imageUrl && (
                                <a
                                    href={t.imageUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="h-12 w-12 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all shadow-sm"
                                    title="View Receipt"
                                >
                                    <ImageIcon className="h-5 w-5" />
                                </a>
                            )}
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
