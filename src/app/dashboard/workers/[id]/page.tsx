import { getWorkerById } from "@/actions/worker-actions";
import { getTransactionsByWorker } from "@/actions/transaction-actions";
import { TransactionList } from "@/components/features/transaction-list";
import { AddTransactionButton } from "../../../../components/features/add-transaction-button"; // We'll create this small wrapper
import { TransactionType } from "@/lib/types";
import { notFound } from "next/navigation";
import { Phone, Briefcase } from "lucide-react";

export default async function WorkerDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const worker = await getWorkerById(id);

    if (!worker) return notFound();

    const transactions = await getTransactionsByWorker(id);
    const totalPaid = transactions
        .filter(t => t.type === TransactionType.OUTGOING)
        .reduce((sum, t) => sum + Number(t.amount), 0);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 border border-border rounded-2xl p-3 md:p-4 relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row justify-between gap-6 md:items-center">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg shadow-primary/20">
                                {worker.name.charAt(0)}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">{worker.name}</h1>
                                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                    <span className="bg-background/50 px-2 py-0.5 rounded border border-border flex items-center gap-1">
                                        <Briefcase className="h-3 w-3" /> {worker.category}
                                    </span>
                                    {worker.phone && (
                                        <span className="flex items-center gap-1">
                                            <Phone className="h-3 w-3" /> {worker.phone}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        {worker.notes && <p className="text-muted-foreground mt-4 max-w-lg">{worker.notes}</p>}
                    </div>

                    <div className="flex flex-col items-end gap-4">
                        <div className="text-right">
                            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Total Paid</div>
                            <div className="text-4xl font-bold text-foreground">₹{totalPaid.toLocaleString("en-IN")}</div>
                        </div>
                        <AddTransactionButton
                            workerId={worker.id}
                            defaultType={TransactionType.OUTGOING}
                            label="Record Payment"
                        />
                    </div>
                </div>
                {/* BG Decor */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
            </div>

            {/* Ledger */}
            <div>
                <h2 className="text-xl font-bold tracking-tight mb-4">Payment History</h2>
                <TransactionList transactions={JSON.parse(JSON.stringify(transactions))} />
            </div>
        </div>
    );
}
