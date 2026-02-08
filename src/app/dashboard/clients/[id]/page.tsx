import { getClientById } from "@/actions/client-actions";
import { getTransactionsByClient } from "@/actions/transaction-actions";
import { TransactionList } from "@/components/features/transaction-list";
import { AddTransactionButton } from "@/components/features/add-transaction-button";
import { TransactionType } from "@/lib/types";
import { notFound } from "next/navigation";
import { User, Phone } from "lucide-react";

export default async function ClientDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const client = await getClientById(id);

    if (!client) return notFound();

    const transactions = await getTransactionsByClient(id);
    const totalReceived = transactions
        .filter(t => t.type === TransactionType.INCOMING)
        .reduce((sum, t) => sum + Number(t.amount), 0);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-gradient-to-br from-secondary/10 via-background to-primary/10 border border-border rounded-2xl p-3 md:p-8 relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row justify-between gap-6 md:items-center">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-bold text-xl shadow-lg shadow-secondary/20">
                                {client.name.charAt(0)}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">{client.name}</h1>
                                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                    {client.phone && (
                                        <span className="flex items-center gap-1">
                                            <Phone className="h-3 w-3" /> {client.phone}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        {client.notes && <p className="text-muted-foreground mt-4 max-w-lg">{client.notes}</p>}
                    </div>

                    <div className="flex flex-col items-end gap-4">
                        <div className="text-right">
                            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Total Received</div>
                            <div className="text-4xl font-bold text-green-600 dark:text-green-400">₹{totalReceived.toLocaleString("en-IN")}</div>
                        </div>
                        <AddTransactionButton
                            clientId={client.id}
                            defaultType={TransactionType.INCOMING}
                            label="Record Incoming"
                        />
                    </div>
                </div>
                {/* BG Decor */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
            </div>

            {/* Ledger */}
            <div>
                <h2 className="text-xl font-bold tracking-tight mb-4">Payment History</h2>
                <TransactionList transactions={JSON.parse(JSON.stringify(transactions))} />
            </div>
        </div>
    );
}
